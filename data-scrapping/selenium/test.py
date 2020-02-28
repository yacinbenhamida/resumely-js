# import web driver
from selenium import webdriver
from time import sleep
from selenium.webdriver.common.keys import Keys
import parameters
from parsel import Selector
import csv

# function to ensure all key data fields have a value
def validate_field(field):# if field is present pass if field:pass
# if field is not present print text else:
        field = 'No results'
        return field

# specifies the path to the chromedriver.exe
driver = webdriver.Chrome('C:/chromedriver_win32/chromedriver')
    # get the profile URL 
driver.get("https://www.linkedin.com/in/yacinbenhamida/")

    # add a 5 second pause loading each URL
sleep(7)

sel = Selector(text=driver.page_source) 
#xpath to extract the first h1 text 
# xpath to extract the text from the class containing the job title
job_title = sel.xpath('//h2[starts-with(@class,"top-card-layout__headline")]/text()').extract_first()

if job_title:
    job_title = job_title.strip()  
 # xpath to extract the text from the class containing the company
print(job_title)

college = sel.xpath('//div[starts-with(@class,"result-card__contents")]/h3/text()').extract_first()

if college:
    college = college.strip()
    # xpath to extract the text from the class containing the location7
print(college)

company = sel.xpath('//div[@class="top-card-link"]/span/text())').extract_first()
if company:
    company = company.strip()
    # xpath to extract the text from the class containing the college
print(company)


location = sel.xpath('//ul[starts-with(@class,"pv-top-card--list")]//li/text()').extract_first()
if location:
    location = location.strip()
print(location)

driver.quit()
    