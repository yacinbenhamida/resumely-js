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
import bson
def validate_field(field):
    if not field:
        field = 'No results'
    return field
    
def scrapper(country,idop):
    # database connection
    client = pymongo.MongoClient("mongodb+srv://ybh:ybh@resumely-g5wzc.mongodb.net/resumely?retryWrites=true&w=majority")
    database = client["resumelydb"]
    profiles_collection = database['profiles']
    scrapping_request_collection = database['scraprequests']
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
    #potential_title = "egyptian"
    search_query = driver.find_element_by_name('q')
    search_query.send_keys('site:doyoubuzz.com AND "'+country+'"')
    sleep(0.5)
    search_query.send_keys(Keys.RETURN)
    sleep(5)
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
    print('recording state to database with id '+idop)
    scrapping_request_collection.update_one({"_id" : bson.ObjectId(idop)},{ "$set": { "expectedNoOfRows": len(youbuzz_urls) } })
    sleep(0.5)
    j = 0
    for youbuzz_url in youbuzz_urls:
        target = scrapping_request_collection.find({"_id" : bson.ObjectId(idop)},{"currentState":1})[0]
        print(target)
        if str(target['currentState']) == "stopped":
            print("scrapping stopped, exiting... ")
            break;
        driver.get(youbuzz_url)
        # add a 5 second pause loading each URL
        sleep(5)
        sel = Selector(text=driver.page_source) 
        
        lastName = sel.xpath('//*[starts-with(@class,"userName__lastName")]/text()').extract_first()
        
        if lastName and lastName not in done: 
            lastName = lastName.strip()           
            firstName = sel.xpath('//*[starts-with(@class,"userName__firstName")]/text()').extract_first()
            if firstName:
                firstName = firstName.strip() 
            current_title = sel.xpath('//*[@class="cvTitle"]/text()').extract_first()
            if current_title:
                current_title = current_title.strip()
            lives_in = sel.xpath('//*[starts-with(@class,"widgetUserInfo__item widgetUserInfo__item_location")]/text()').extract_first()
            if lives_in:
                lives_in = lives_in.strip()    
            age = sel.xpath('//*[starts-with(@class,"widgetUserInfo__item widgetUserInfo__item_age")]/text()').extract_first()
            if age:
                age = age.strip()                      
            experiences = []
            skills = []
            education = []
            presentation = ""
            m = 1
            i = 1
            #experiences 
            try:
                for div in driver.find_elements_by_xpath("//*[@class='widget widget_experiences']//*[@class='widgetElement widgetElement_topInfos']/div["+str(i)+"]"):
                    job = div.find_element_by_class_name('widgetElement__titleLink').text
                    job_details = div.find_element_by_class_name('widgetElement__subtitle').text
                    job_date = div.find_element_by_class_name('widgetElement__subtitleItem_date').text
                    experiences.append({
                        'job' : job,
                        'job_details' : job_details,
                        'job_date' : job_date
                    })
                    i=i+1
            except:
                pass
            #presentation
            try:
                presentation = driver.find_element_by_xpath('//*[@class="widget widget_presentation"]//*[@class="widgetElement__text"]').text
                if presentation : 
                    presentation = presentation.strip()
            except:
                pass
            #education 
            try : 
                for div2 in driver.find_elements_by_xpath("//*[@class='widget widget_educations']//*[@class='widgetElement widgetElement_topInfos']/div["+str(m)+"]"): 
                    diploma = div2.find_element_by_class_name('widgetElement__titleLink').text
                    university = div2.find_element_by_class_name('widgetElement__subtitle').text
                    date = div2.find_element_by_class_name('widgetElement__info').text
                    education.append({
                        'diploma ' : diploma,
                        'university ' : university,
                        'date' : date
                    })
                    m=m+1
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
            
            youbuzz_url = driver.current_url
            firstName = validate_field(firstName)
            lastName = validate_field(lastName)
            current_title = validate_field(current_title)
            lives_in = validate_field(lives_in)
            youbuzz_url = validate_field(youbuzz_url)
            age = validate_field(age)
            presentation = validate_field(presentation)
            
            if firstName != 'No results' and lastName != 'No results':
                if lives_in != 'No Results':
                    lives_in = ' '.join(lives_in.split())   
                try:
                    if age != 'No Results':
                        age = ' '.join(age.split())
                        for a in age.split():
                            if a.isdigit():
                                age = int(a)  
                except:
                    pass               
                try:
                    # printing the output to the terminal
                    print('\n')
                    print('First Name: ' + firstName)
                    print('last Name: ' + lastName)
                    print('current_title: ' + current_title)
                    print('lives_in: ' + lives_in)
                    print('age '+str(age))
                    print('youbuzz_url: ' + youbuzz_url)
                    print('presentation :'+presentation)
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
                        'age' : age,
                        'skills' : skills,
                        'education' : education,
                        'experiences' : experiences                
                    }
                j = j+1
                print('relevant record, inserting to database...')
                done.add(res['lastName']) 
                extracted_data.append(res)
                profiles_collection.insert_one(res)
                scrapping_request_collection.update_one({"_id" : bson.ObjectId(idop)},{ "$set": { "currentNoOfRows": j } })
            else:
                print('skipping...')
        else:
            print('already scrapped, moving on....')
    scrapping_request_collection.update_one({"_id" : bson.ObjectId(idop)},{ "$set": { "currentState" :"done" } })
    driver.quit()
    return Response(json.dumps({"status" : "done"}),  mimetype='application/json')