from selenium import webdriver
from time import sleep
from selenium.webdriver.common.keys import Keys
import parameters
from parsel import Selector
import bson
import pymongo
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

client = pymongo.MongoClient("mongodb+srv://ybh:ybh@resumely-g5wzc.mongodb.net/resumely?retryWrites=true&w=majority")
database = client["resumelydb"]
profiles_collection = database['profiles']
done = set()
extracted_data = {}
extracted_data['candidates'] = []
driver = webdriver.Chrome('C:/chromedriver_win32/chromedriver')

driver.maximize_window()
for x in profiles_collection.find(no_cursor_timeout=True).skip(3600):
    driver.get(x['profile'])
    sleep(5)
    sel = Selector(text=driver.page_source) 
    age = sel.xpath('//*[starts-with(@class,"widgetUserInfo__item widgetUserInfo__item_age")]/text()').extract_first()
    if age:
        age = age.strip()    
    age = validate_field(age)   
    try:
        if age != 'No Results':
            age = ' '.join(age.split())
            for a in age.split():
                if a.isdigit():
                    profiles_collection.update_one({"_id" : bson.ObjectId(x['_id'])},{ "$set": { "age": int(a) } })
    except:
        pass
    # experiences
    experiencesTab = []
    skills = []
    education = []
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
        profiles_collection.update_one({"_id" : bson.ObjectId(x['_id'])},{ "$set": { "experiences": experiencesTab } })
    except:
        pass
    try:
        presentation = driver.find_element_by_xpath('//*[@class="widget widget_presentation"]//*[@class="widgetElement__text"]').text
        presentation = validate_field(presentation)
        if presentation != "No results":
            profiles_collection.update_one({"_id" : bson.ObjectId(x['_id'])},{ "$set": { "presentation": presentation } })
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
        profiles_collection.update_one({"_id" : bson.ObjectId(x['_id'])},{ "$set": { "education": education } })
    except:
        pass
    try:
        for div in driver.find_elements_by_xpath("//*[@class='widget widget_skills']"): 
            for lang in div.find_elements_by_xpath("//*[@class='widget widget_skills']//*[starts-with(@class,'widgetElement__list skillsBulletList')]/li"):  
                fetch = lang.text
                skills.append(fetch)
        if len(skills) > 0 :
            profiles_collection.update_one({"_id" : bson.ObjectId(x['_id'])},{ "$set": { "skills": skills } })
    except:
        pass

driver.quit()