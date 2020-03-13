from selenium import webdriver
from time import sleep
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.select import Select
import parameters
from parsel import Selector
import csv
import pandas as pd
import json
# specifies the path to the chromedriver.exe
driver = webdriver.Chrome('C:/chromedriver_win32/chromedriver')
driver.get('https:www.google.com')
sleep(3)
search_query = driver.find_element_by_name('q')
search_query.send_keys('site:amendes.finances.gov.tn')
sleep(0.5)
search_query.send_keys(Keys.RETURN)
urls = ["https://amendes.finances.gov.tn/jsp/Amende/cons_amende.jsp?z1=1"]
for url in urls:
    driver.get(url)
    sleep(7)
    sel = Selector(text=driver.page_source)
    driver.find_element_by_css_selector("input[type='radio'][value='im']").click()

    select_fr = Select(driver.find_element_by_name('imm'))
    select_fr.select_by_visible_text('TU')
    driver.find_element_by_id("tu0").send_keys("4642")
    driver.find_element_by_id("tu1").send_keys("175")
    sleep(100)
    driver.find_element_by_name("btValider").click()                                          
    print("content is ")
    sleep(0.5)
    table = driver.find_element_by_xpath('//*[@class="table"]')
    with open('filename.csv', 'w', newline='') as csvfile:
        wr = csv.writer(csvfile)
        for row in table.find_elements_by_css_selector('tr'):
            wr.writerow([d.text.encode('utf-8') for d in row.find_elements_by_css_selector('td')])
driver.quit()