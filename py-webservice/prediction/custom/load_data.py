import pandas as pd
import pymongo, pycountry
import sys

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
SHARED_DIR = BASE_DIR / 'shared'
DATA_DIR = SHARED_DIR / 'data'
save_file_name = 'train_data_full.csv'
# profiles_csv_path = DATA_DIR / 'tn_profiles'

sys.path.append(str(SHARED_DIR))

from resumely_lib import *
resumely = Resumely.get()

client = pymongo.MongoClient("mongodb+srv://ybh:ybh@resumely-g5wzc.mongodb.net/test?retryWrites=true&w=majority")

# Settings
db_name = 'resumelydb'
db = client['resumelydb']
source = ['doyoubuzz', 'linkedin']
# source = ['doyoubuzz']
do_augment_data = False

# DF Construction Columns
first_names_col = []
last_names_col = []
country_col = []
skills_col = []

class Country:
    def __init__(self, name):
        self.name = name

countries = pycountry.countries
# countries = [Country('tunisia'), Country('france')]

# -1 All, used to fasten debugging.
max_iter = -1

if 'linkedin' in source:
    candidates = db['candidates']
    i = 0

    print('\n' * 3, '*' * 3, 'LINKEDIN', '*' * 3, '\n' * 3)
    for c in candidates.find():
        if max_iter > 0 and i >= max_iter: break
        i += 1

        if 'profile' not in c.keys():
            continue
        
        profile = c['profile']

        if 'name' in profile.keys():
            name = profile['name']
            # Always exists in all outliers
            if('l’écoute' in name.lower()):
                continue

        if 'location' not in profile.keys(): continue
        
        location = profile['location']
        
        has_country = False
        countryName = location

        for country in countries:
            if country.name.lower() in location.lower():
                countryName = country.name
                has_country = True
                break

        if not has_country:
            continue
            countryName, distance = Resumely.get_closest_country_to_name(location)

        fname, lname = resumely.get_first_last_names(name)

        first_names_col.append(fname)
        last_names_col.append(lname)
        country_col.append(countryName)
        skills_col.append([sk['title'] for sk in c['skills']] if len(c['skills']) else [])

if 'doyoubuzz' in source:
    profiles = db['profiles']
    i = 0
    
    print('\n' * 3, '*' * 3, 'DOYOUBUZZ', '*' * 3, '\n' * 3)
    for profile in profiles.find():
        if max_iter > 0 and i >= max_iter: break
        i += 1
        
        if 'firstName' not in profile.keys(): continue
        if 'lastName' not in profile.keys(): continue
        if 'country' not in profile.keys(): continue

        fname, lname = profile['firstName'], profile['lastName']
        location = profile['country']
        print(fname, lname, location)
        
        has_country = False
        countryName = location

        # Try to directly find exact country
        for country in countries:
            if country.name.lower() in location.lower():
                countryName = country.name
                has_country = True
                break

        # If wasn't possible, search by edit distance
        if not has_country:
            continue
            countryName, distance = Resumely.get_closest_country_to_name(location)

        first_names_col.append(fname)
        last_names_col.append(lname)
        country_col.append(countryName)

        if 'skills' in profile.keys(): 
            skills_col.append(profile['skills'])
        else:
            skills_col.append([])

df = pd.DataFrame()

df['first_name'] = first_names_col
df['last_name'] = last_names_col
df['country'] = country_col
df['skills'] = skills_col

df = df.drop(df[df.country == 'None'].index)

if do_augment_data:
    print('\n' * 3, '*' * 3, 'DATA AUGMENTATION', '*' * 3, '\n' * 3)
    df = Resumely.augment_data(df, max_ln_iter = 2)
    print(df)

df.to_csv(DATA_DIR / save_file_name, index=False)
