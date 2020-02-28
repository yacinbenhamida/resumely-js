#pip3 install pymongo
#pip3 install pymongo[srv]

import pymongo, pycountry
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SHARED_DIR = BASE_DIR / 'shared'
DATA_DIR = SHARED_DIR / 'data'
profiles_csv_path = DATA_DIR / 'tn_profiles'

sys.path.append(str(SHARED_DIR))

from resumely_lib import *
resumely = Resumely.get()

client = pymongo.MongoClient("mongodb+srv://ybh:MongoDBPWD1920@resumely-g5wzc.mongodb.net/test?retryWrites=true&w=majority")
# dbnames = client.list_database_names()
# print(dbnames)
db_name = 'resumelydb'
db = client['resumelydb']
candidates = db['candidates']

first_names_col = []
last_names_col = []
country_col = []

max_iter = 2000000
i = 0

for c in candidates.find():
    if i > max_iter: break
    i += 1

    if 'profile' not in c.keys():
        continue
    
    profile = c['profile']

    if 'name' in profile.keys():
        name = profile['name']
        # Always exists in all outliers
        if('l’écoute' in name.lower()):
            continue

    has_country = False
    if 'location' in profile.keys():
        location = profile['location']
        
        for country in pycountry.countries:
            if country.name in location:
                country_col.append(country.name)
                has_country = True
                break

    if not has_country: 
        country_col.append('None')
    
    fname, lname = resumely.get_first_last_names(name)

    first_names_col.append(fname)
    last_names_col.append(lname)


    # print(name, 'to:', fname, lname, '\n')
    # Check Keys
    # for key, value in c.items() :
    #     print (key)
      
df = pd.DataFrame()

df['first_name'] = first_names_col
df['last_name'] = last_names_col
df['country'] = country_col

df = df.drop(df[df.country == 'None'].index)

df.to_csv(os.path.join(profiles_csv_path, 'train_mongo_data.csv'), index=False)

