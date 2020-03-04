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

# driver.get method() will navigate to a page given by the URL address
driver.get('https://www.linkedin.com')

# locate login redirect href link to fill data
showFormButton = driver.find_element_by_class_name('nav__button-secondary')
showFormButton.click()

# locate email form by_class_name
username = driver.find_element_by_name('session_key')


# send_keys() to simulate key strokes
username.send_keys('fixitnoreply2019@gmail.com')
# sleep for 0.5 seconds
sleep(0.5)
# locate password form by_class_name
password = driver.find_element_by_name('session_password')

# send_keys() to simulate key strokes
password.send_keys('Yassinassil23')
# locate submit button by_class_name
log_in_button = driver.find_element_by_xpath('//*[@type="submit"]')

log_in_button.click()
sleep(0.5)

#google scrapping 
driver.get('https:www.google.com')
sleep(3)

search_query = driver.find_element_by_name('q')
search_query.send_keys(parameters.search_query)
sleep(0.5)

search_query.send_keys(Keys.RETURN)
sleep(3)

linkedin_urls = driver.find_elements_by_xpath('//a[starts-with(@href, "https://tn.linkedin.com/in/")]')
print(linkedin_urls)
linkedin_urls = [url.get_attribute("href") for url in linkedin_urls]
sleep(0.5)
# For loop to iterate over each URL in the list
for linkedin_url in linkedin_urls:

    # get the profile URL 
    driver.get(linkedin_url)

    # add a 5 second pause loading each URL
    sleep(7)

    sel = Selector(text=driver.page_source) 

    #xpath to extract the first h1 text 
    name = sel.xpath('//*[starts-with(@class,"pv-top-card--list")]//li/text()').extract_first()
    
    if name:
        name = name.strip()
    # xpath to extract the text from the class containing the job title
    job_title = sel.xpath('//h2[starts-with(@class,"mt1 t-18")]/text()').extract_first()

    if job_title:
        job_title = job_title.strip()


    # xpath to extract the text from the class containing the company
    company = sel.xpath('//p[starts_with(@class,"pv-entity__secondary-title")]/text()').extract_first()

    if company:
        company = company.strip()


    # xpath to extract the text from the class containing the college
    college = sel.xpath('//h3[starts_with(@class,"pv-entity__school-name")]/text()').extract_first()

    if college:
        college = college.strip()


    # xpath to extract the text from the class containing the location
    location = sel.xpath('//li[starts_with(@class,"t-16")]/text()').extract_first()

    if location:
        location = location.strip()


    linkedin_url = driver.current_url

    name = validate_field(name)
    job_title = validate_field(job_title)
    company = validate_field(company)
    college = validate_field(college)
    location = validate_field(location)
    linkedin_url = validate_field(linkedin_url)

    # printing the output to the terminal
    print('\n')
    print('Name: ' + name)
    print('Job Title: ' + job_title)
    print('Company: ' + company)
    print('College: ' + college)
    print('Location: ' + location)
    print('URL: ' + linkedin_url)
    print('\n')

    #writing and saving data to csv
    # defining new variable passing two parameters
    writer = csv.writer(open(parameters.file_name, 'w'))

    # writerow() method to the write to the file object
    writer.writerow(['Name','Job Title','Company','College', 'Location','URL'])

    # writing the corresponding values to the header
    writer.writerow([name.encode('utf-8'),
                    job_title.encode('utf-8'),
                    company.encode('utf-8'),
                    college.encode('utf-8'),
                    location.encode('utf-8'),
                    linkedin_url.encode('utf-8')])
driver.quit()

