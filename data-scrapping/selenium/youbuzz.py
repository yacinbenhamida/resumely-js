# import web driver
from selenium import webdriver
from time import sleep
from selenium.webdriver.common.keys import Keys
import parameters
from parsel import Selector
import csv

def validate_field(field):
        field = 'No results'
        return field

driver = webdriver.Chrome('C:/chromedriver_win32/chromedriver')
driver.get("https://www.doyoubuzz.com/mohamed-ghanay")

    # add a 5 second pause loading each URL
sleep(5)

sel = Selector(text=driver.page_source) 
firstName = sel.xpath('//*[starts-with(@class,"userName__firstName")]/text()').extract_first()

if firstName:
    firstName = firstName.strip()  
print(firstName)

lastName = sel.xpath('//*[starts-with(@class,"userName__lastName")]/text()').extract_first()

if lastName:
    lastName = lastName.strip()
print(lastName)

current_title = sel.xpath('//*[@class="cvTitle"]/text()').extract_first()
if current_title:
    current_title = current_title.strip()
print(current_title)


lives_in = sel.xpath('//*[starts-with(@class,"widgetUserInfo__item widgetUserInfo__item_location")]/text()').extract_first()
if lives_in:
    lives_in = lives_in.strip()
print(lives_in)

driver.quit()
    