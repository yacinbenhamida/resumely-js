import pandas as pd
import numpy as np
import glob, os, sys

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SHARED_DIR = BASE_DIR / 'shared'
DATA_DIR = SHARED_DIR / 'data'
profiles_csv_path = DATA_DIR / 'tn_profiles'

sys.path.append(str(SHARED_DIR))

from resumely_lib import *

def handle(from_file = 'tn_profiles.csv', to_file = 'new_tn_profiles.csv'):
    resumely = Resumely.get()
    
    df = resumely.get_df(profiles_csv_path, from_file)
    resumely.preprocess(df)

    if not os.path.exists(profiles_csv_path):
        os.mkdir(profiles_csv_path)

    # Just fill Pays for primary testing
    # 3 countries
    df['Pays'] = np.random.randint(0, 3, size=len(df))

    df.to_csv(os.path.join(profiles_csv_path, to_file), index=False)
    new_df = resumely.get_df(profiles_csv_path, to_file)

def main():
    handle()

main()
