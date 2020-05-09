from selenium import webdriver
from time import sleep
from selenium.webdriver.common.keys import Keys
import parameters
from parsel import Selector
import json
import pymongo
import requests
from selenium.webdriver.chrome.options import Options

def validate_field(field):
    if not field:
        field = 'No results'
    return field
def getProfileCountry(found_country):
    if found_country != 'No results':
        target = requests.get('https://maps.googleapis.com/maps/api/geocode/json?address='+found_country+"&key=AIzaSyAg5g5m6tKq4pg0fusvq2HDzlm5nnIkaQ8").json()
        country = found_country
        for data in target['results']:
            for x in data['address_components']:
                if x['types'][0] == 'country':
                    country = str(x['long_name'])
        print(country)
        return country
    else :
        return "Germany";

client = pymongo.MongoClient("mongodb+srv://ybh:ybh@resumely-g5wzc.mongodb.net/resumely?retryWrites=true&w=majority")
database = client["resumelydb"]
profiles_collection = database['profiles']
done = set()
for item in profiles_collection.find({},{"_id":0,"lastName":1}):
    done.add(str(item))
extracted_data = {}
extracted_data['candidates'] = []
options = Options()
options.add_argument('--headless')
#options.add_argument('--no-sandbox')
#options.add_argument('--disable-dev-shm-usage')
options.add_argument("--lang=fr");
service_log_path = '/tmp/local/chromedriver.log'

print('triggering chrome...')
driver = webdriver.Chrome('/usr/bin/chromedriver',chrome_options=options,service_log_path = service_log_path)

driver.maximize_window()
driver.get('https:www.google.com')
sleep(3)
country = "german"
search_query = driver.find_element_by_name('q')
search_query.send_keys(parameters.search_query+' AND "'+country+'"')
print('in google..')
sleep(0.5)

search_query.send_keys(Keys.RETURN)
sleep(4)

pages=driver.find_elements_by_xpath("//*[@class='AaVjTc']/tbody/tr/td/a")
print(pages)

test = driver.find_element_by_xpath("//*[starts-with(@class,'gLFyf')]");
print(str(test))
test1 = driver.find_element_by_xpath("//*[starts-with(@id,'result-stats')]");
print(str(test1))
youbuzz_urls = []
try:
    if driver.find_element_by_xpath("//*[contains(text(), 'Suivant')]") :
        print("found next")
        while(driver.find_element_by_xpath("//*[contains(text(), 'Suivant')]")):
            href = driver.find_elements_by_xpath('//a[starts-with(@href, "https://www.doyoubuzz.com/")]')
            for i in href:
                youbuzz_urls.append(i.get_attribute('href'))
            driver.find_element_by_xpath("//*[contains(text(), 'Suivant')]").click()
    elif driver.find_element_by_xpath("//span[contains(text(), 'Next')]") : 
        while(driver.find_element_by_xpath("//span[contains(text(), 'Next')]")):
            href = driver.find_elements_by_xpath('//a[starts-with(@href, "https://www.doyoubuzz.com/")]')
            for i in href:
                youbuzz_urls.append(i.get_attribute('href'))
            driver.find_element_by_xpath("//span[contains(text(), 'Next')]").click()
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
        lives_in = ' '.join(lives_in.split())
       
    age = sel.xpath('//*[starts-with(@class,"widgetUserInfo__item widgetUserInfo__item_age")]/text()').extract_first()
    if age:
        age = age.strip()    
    youbuzz_url = driver.current_url

    
      
    try:
        if age != 'No Results':
            age = ' '.join(age.split())
            for a in age.split():
                if a.isdigit():
                    age = int(a)  
    except:
        pass
    # experiences
    experiencesTab = []
    skills = []
    education = []
    presentation = None
    j = 1
    i = 1
    try:
        for div in driver.find_elements_by_xpath("//*[@class='widget widget_experiences']//*[@class='widgetElement widgetElement_topInfos']/div["+str(i)+"]"):
            job = div.find_element_by_class_name('widgetElement__titleLink').text
            job_details = div.find_element_by_class_name('widgetElement__subtitle').text
            job_date = div.find_element_by_class_name('widgetElement__subtitleItem_date').text
            experiencesTab.append({
                'job' : job,
                'job_details' : job_details,
                'job_date' : job_date
            })
            i=i+1
    except:
        pass
    try:
        presentation = driver.find_element_by_xpath('//*[@class="widget widget_presentation"]//*[@class="widgetElement__text"]').text
        presentation = validate_field(presentation)
    except:
        pass
    try : 
        for div2 in driver.find_elements_by_xpath("//*[@class='widget widget_educations']//*[@class='widgetElement widgetElement_topInfos']/div["+str(j)+"]"): 
            diploma = div2.find_element_by_class_name('widgetElement__titleLink').text
            university = div2.find_element_by_class_name('widgetElement__subtitle').text
            date = div2.find_element_by_class_name('widgetElement__info').text
            education.append({
                'diploma ' : diploma,
                'university ' : university,
                'date' : date
            })
            j=j+1 #3600
    except:
        pass
    #skills
    try:
        for div in driver.find_elements_by_xpath("//*[@class='widget widget_skills']"): 
            for lang in div.find_elements_by_xpath("//*[@class='widget widget_skills']//*[starts-with(@class,'widgetElement__list skillsBulletList')]/li"):  
                fetch = lang.text
                skills.append(fetch)
    except:
        pass
    firstName = validate_field(firstName)
    lastName = validate_field(lastName)
    current_title = validate_field(current_title)
    lives_in = validate_field(lives_in)
    youbuzz_url = validate_field(youbuzz_url)
    age = validate_field(age)
    presentation = validate_field(presentation)
    try:
        # printing the output to the terminal
        print('\n')
        print('First Name: ' + firstName)
        print('last Name: ' + lastName)
        print('current_title: ' + current_title)
        print('lives_in: ' + lives_in)
        print('age '+str(age))
        print('youbuzz_url: ' + youbuzz_url)
        print('presentation : '+presentation)
        print('experiences no '+len(experiencesTab))
        print('\n')
    except:
        pass
    if firstName != 'No results' and lastName != 'No results':       
        res = {        
            'currentPosition' : current_title,
            'livesIn' : lives_in,
            'country' : getProfileCountry(lives_in),
            'profile' : youbuzz_url,
            'firstName': firstName,
            'lastName' : lastName,
            'age' : age,
            "experiences": experiencesTab,
            "presentation": presentation,
            "education": education,
            "skills": skills
        }
        if res['lastName'] not in done:
            print('relevant record, inserting to db ...')
            profiles_collection.insert_one(res)
            done.add(res['lastName']) 
        else:
            print('already scrapped, moving...')
    else:
        print('skipping...')
driver.quit()