# import web driver
from selenium import webdriver
from time import sleep
from selenium.webdriver.common.keys import Keys
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
search_query.send_keys('site:opendata.interieur.gov.tn "accidents" ')
sleep(0.5)
search_query.send_keys(Keys.RETURN)
urls = ["http://opendata.interieur.gov.tn/fr/catalog/les-accidents-et-leurs-victimes-par-an" , 
        "http://opendata.interieur.gov.tn/fr/catalog/les-accidents-de-la-route-enregistres-pendant-la-periode-d-aout-2013",
        "http://opendata.interieur.gov.tn/fr/catalog/repartition-des-accidents-de-la-route-et-les-victimes-selon-les-lieux-des-accidents-du-01-janvier-au-31-aout-2014"
        ,"http://opendata.interieur.gov.tn/fr/catalog/les-accidents-de-la-route-enregistres-pendant-la-periode-d-aout-2013"]
for url in urls:
    driver.get(url)
    sleep(7)
    sel = Selector(text=driver.page_source) 
    data = sel.xpath('//*[@id="json"]/text()').extract_first()
    if data:
        data = data.strip()
    json_format = json.loads(data)
    
    filename = sel.xpath('//*[@class="breadcrumb title"]//li/a/text()').extract_first()
    if filename:
        filename =filename.strip()
        filename = filename.replace(" ","_")
        
    print(filename)
    print("content is ")
    keys = []
    for entries in json_format : 
        print(entries.values())
        keys.append(entries.keys())
    with open(filename+'.csv','w') as outfile:
        for k in keys:
            outfile.write(str(list(k)))
        outfile.write("\n")
        for entries in json_format:
            outfile.write(str(list(entries.values())))
            outfile.write("\n")
driver.quit()


