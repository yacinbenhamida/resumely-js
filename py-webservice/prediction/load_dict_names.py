import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException as TE
import os
from pathlib import Path

wait_te = 10
wait_class = 't12'
name_class = 't12'

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / 'shared' / 'data'
CHROME_DRIVERS_DIR = BASE_DIR / 'shared' / 'chromedrivers'

dict_names_path = DATA_DIR / 'dict_names'
save_path = dict_names_path / 'first_names.csv'

driver_path = CHROME_DRIVERS_DIR / 'chromedriver_80.exe'
print(driver_path)
driver_path = str(driver_path)


urls = [
    'http://www.top-names.info/names.php?S=M&P=TUN',
    'http://www.top-names.info/names.php?S=F&P=TUN'
    ]

def main():
    driver = webdriver.Chrome(executable_path = driver_path)
    first_names = []

    for url in urls:
        cur_names = []
        driver.get(url)

        try:
            element = WebDriverWait(driver, wait_te).until(
                EC.presence_of_element_located((By.CLASS_NAME, wait_class))
            )
        except TE as e:
            print("Timeout.")
            continue
        finally:
            print("Loading from:", url)
            names = driver.find_elements_by_class_name(name_class)
            for name in names:
                cur_names.append(name.text)

            first_names = first_names + cur_names

    if not os.path.exists(dict_names_path):
        os.mkdir(dict_names_path)

    df = pd.DataFrame(first_names)
    df.to_csv(save_path, index=False)

    print('Loading task ended successfully, saved in:', save_path)

    driver.quit()

main()