from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from time import sleep
from selenium.webdriver.common.keys import Keys
from parsel import Selector
import json
import pymongo  
from flask import Flask
from flask_restful import Resource, Api
from flask import Response

def validate_field(field):
    if not field:
        field = 'No results'
    return field

class Scrapper(Resource):
    def get(self,country):
        # database connection
        client = pymongo.MongoClient("mongodb+srv://ybh:ybh@resumely-g5wzc.mongodb.net/resumely?retryWrites=true&w=majority")
        database = client["resumelydb"]
        profiles_collection = database['profiles']
        #utils
        done = set()
        extracted_data = []
        options = Options()
        #options.add_argument('--headless')
        #enforcing headless scrapping
        #driver = webdriver.Chrome('./shared/chromedrivers/chromedriver_80.exe',chrome_options=options)
        driver = webdriver.Chrome('./shared/chromedrivers/chromedriver_80.exe')
        driver.maximize_window()
        driver.get('https:www.google.com')
        sleep(3)
        country = "russia"
        #potential_title = "egyptian"
        search_query = driver.find_element_by_name('q')
        search_query.send_keys('site:doyoubuzz.com AND "'+country+'"')
        sleep(0.5)

        search_query.send_keys(Keys.RETURN)
        sleep(10)


        pages=driver.find_elements_by_xpath("//*[@class='AaVjTc']/tbody/tr/td/a")
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


            if firstName != 'No results' and lastName != 'No results':
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
                res = {        
                        'currentPosition' : current_title,
                        'livesIn' : lives_in,
                        'country' : country,
                        'profile' : youbuzz_url,
                        'firstName': firstName,
                        'lastName' : lastName,
                    }
                if res['lastName'] not in done:
                    print('relevant record, inserting to database...')
                    done.add(res['lastName']) 
                    extracted_data.append(res)
                    profiles_collection.insert_one(res)
                else:
                    print('already scrapped, moving...')
            else:
                print('skipping...')
        print(*extracted_data, sep='\n')
        driver.quit()
        return Response(json.dumps(extracted_data),  mimetype='application/json')