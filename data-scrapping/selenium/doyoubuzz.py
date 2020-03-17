from selenium import webdriver
from time import sleep
from selenium.webdriver.common.keys import Keys
import parameters
from parsel import Selector
import json

def validate_field(field):
    if not field:
        field = 'No results'
    return field

extracted_data = {}
extracted_data['candidates'] = []
driver = webdriver.Chrome('C:/chromedriver_win32/chromedriver')

driver.maximize_window()
driver.get('https:www.google.com')
sleep(3)
country = "chile"
potential_title = ""
search_query = driver.find_element_by_name('q')
search_query.send_keys(parameters.search_query+' AND "'+potential_title+'" AND "'+country+'"')
sleep(0.5)

search_query.send_keys(Keys.RETURN)
sleep(150)


pages=driver.find_elements_by_xpath("//*[@class='AaVjTc']/tbody/tr/td/a")
print(pages)
youbuzz_urls = []
for page in pages:
    href = driver.find_elements_by_xpath('//a[starts-with(@href, "https://www.doyoubuzz.com/")]')
    for i in href:
        youbuzz_urls.append(i.get_attribute('href'))
    try:
        driver.find_element_by_xpath("//span[text()='Suivant']").click()
    except:
        pass
sleep(0.5)
for youbuzz_url in youbuzz_urls:
    driver.get(youbuzz_url)

    # add a 5 second pause loading each URL
    sleep(5)

    sel = Selector(text=driver.page_source) 

    firstName = sel.xpath('//*[starts-with(@class,"userName__firstName")]/text()').extract_first()
    
    if firstName:
        firstName = firstName.strip()
        
    lastName = sel.xpath('//*[starts-with(@class,"userName__lastName")]/text()').extract_first()

    if lastName:
        lastName = lastName.strip()


    current_title = sel.xpath('//*[@class="cvTitle"]/text()').extract_first()
    if current_title:
        current_title = current_title.strip()


    lives_in = sel.xpath('//*[starts-with(@class,"widgetUserInfo__item widgetUserInfo__item_location")]/text()').extract_first()
    if lives_in:
        lives_in = lives_in.strip()
        
    youbuzz_url = driver.current_url

    firstName = validate_field(firstName)
    lastName = validate_field(lastName)
    current_title = validate_field(current_title)
    lives_in = validate_field(lives_in)
    youbuzz_url = validate_field(youbuzz_url)

    if lives_in != 'No Results':
        lives_in = ' '.join(lives_in.split())
    try:
        # printing the output to the terminal
        print('\n')
        print('First Name: ' + firstName)
        print('last Name: ' + lastName)
        print('current_title: ' + current_title)
        print('lives_in: ' + lives_in)
        print('youbuzz_url: ' + youbuzz_url)
        print('\n')
    except:
        pass
    if firstName != 'No results' and lastName != 'No results':       
        with open('data.json',mode='a', encoding='utf-8') as outfile:
            res = {        
                'currentPosition' : current_title,
                'livesIn' : lives_in,
                'country' : country,
                'profile' : youbuzz_url,
                'firstName': firstName,
                'lastName' : lastName,
            }
            json.dump(res, outfile, indent=2) 
    else:
        print('skipping...')

  
driver.quit()