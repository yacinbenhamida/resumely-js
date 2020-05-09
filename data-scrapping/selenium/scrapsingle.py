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
import requests

def validate_field(field):
    if not field:
        field = 'No results'
    return field
def getProfileCountry(found_country):
    # finding the correct country name via google maps api
    target = requests.get('https://maps.googleapis.com/maps/api/geocode/json?address='+found_country+"&key="+params.google_api_key).json()
    country = found_country
    for data in target['results']:
        for x in data['address_components']:
            if x['types'][0] == 'country':
                country = str(x['long_name'])
    print(country)
    return country
def indexProfile(id):
    # indexing profile to elasticsearch engine
    target = requests.post('http://51.178.142.162:9200/bulk', json={ "id" : str(id)})
    print('indexing : '+str(id)+' to node server ')
def load_browser():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    service_log_path = '/tmp/local/chromedriver.log'
    print('triggering chrome...')
    driver = webdriver.Chrome('/usr/bin/chromedriver',chrome_options=options, service_log_path=service_log_path)
    return driver 

def connect_to_db():
    client = pymongo.MongoClient("mongodb+srv://ybh:ybh@resumely-g5wzc.mongodb.net/resumely?retryWrites=true&w=majority")
    database = client["resumelydb"]
    return database
def scrap_profile(driver,url,idop):
    database = connect_to_db()
    profiles_collection = database['profiles']
    driver.get(url)
    sleep(5)
    j = 0
    sel = Selector(text=driver.page_source)    
    lastName = sel.xpath('//*[starts-with(@class,"userName__lastName")]/text()').extract_first()
    if lastName : 
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
    age = None
    try:      
        age = sel.xpath('//*[starts-with(@class,"widgetUserInfo__item widgetUserInfo__item_age")]/text()').extract_first()
        if age:
            age = age.strip()  
    except:
        pass                   
    experiences = []
    skills = []
    education = []
    presentation = None
    image   =  None
    m = 1
    k = 1
    #experiences 
    try:
        for div in driver.find_elements_by_xpath("//*[@class='widget widget_experiences']//*[@class='widgetElement widgetElement_topInfos']/div["+str(k)+"]"):
            job = div.find_element_by_class_name('widgetElement__titleLink').text
            job_details = div.find_element_by_class_name('widgetElement__subtitle').text
            job_date = div.find_element_by_class_name('widgetElement__subtitleItem_date').text
            experiences.append({
                'job' : job,
                'job_details' : job_details,
                'job_date' : job_date
            })
            k=k+1
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
    #image scrapping
    try:
        image = driver.find_element_by_xpath("//img[@class='widgetAvatar__avatar']").get_attribute("src")
        print("image found : "+str(image))
        if image:
            image = image.strip()
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
    image = validate_field(image)              

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
            print('image_url : '+str(image))
            print('presentation :'+presentation)
            print('\n')
        except:
            pass
        res = {        
                'currentPosition' : current_title,
                'livesIn' : lives_in,
                'country' : getProfileCountry(lives_in),
                'profile' : youbuzz_url,
                'firstName': firstName,
                'lastName' : lastName,
                'image_url' : str(image),
                'age' : age,
                'skills' : skills,
                'education' : education,
                'experiences' : experiences                
            }
        j = j+1
        inserted = profiles_collection.insert_one(res)
        indexProfile(inserted.inserted_id)
    else:
        print('profile irrelevant skipping...')   

driver = load_browser()
database = connect_to_db()
scrap_profile(driver,'https://www.doyoubuzz.com/emna-boufeda')
driver.quit()

