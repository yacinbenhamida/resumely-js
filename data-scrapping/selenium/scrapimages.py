from selenium import webdriver
from time import sleep
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from parsel import Selector
import bson
import pymongo
def validate_field(field):
    if not field:
        field = 'No results'
    return field

client = pymongo.MongoClient("mongodb+srv://ybh:ybh@resumely-g5wzc.mongodb.net/resumely?retryWrites=true&w=majority")
database = client["resumelydb"]
profiles_collection = database['profiles']
options = webdriver.ChromeOptions()
options.add_experimental_option("excludeSwitches",["ignore-certificate-errors"])
options.add_argument('--disable-gpu')
options.add_argument('--headless')
driver = webdriver.Chrome('C:/chromedriver_win32/chromedriver',chrome_options=options)
i = 0
for x in profiles_collection.find(no_cursor_timeout=True).skip(5):
    driver.get(x['profile'])
    i=i+1
    sleep(3)
    try:
        image = driver.find_element_by_xpath("//img[@class='widgetAvatar__avatar']").get_attribute("src")
        if image:
            image = image.strip()
        image = validate_field(image)   
        print(str(i)+"/ fetched image "+str(image)) 
    except:
        pass
driver.quit()