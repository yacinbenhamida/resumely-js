import numpy as np
from xgboost import XGBClassifier
from sklearn import preprocessing
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

from flask import Flask
from flask_restful import Resource, Api

import pandas as pd
import os, glob, sys, pickle, json
from pathlib import Path

# label encoding => hot encode training data
# save the last encoding in a map (name => ohe)
# when you get an input x_new for prediction
# start with a onehotvector of zero
# perform a levenshtein_distance between x_new and every map entry
# add the entry's one hot vector * clamp(0, 1, val = 10 - dist)

BASE_DIR = Path(__file__).resolve().parent.parent
SHARED_DIR = BASE_DIR / 'shared'
DATA_DIR = SHARED_DIR / 'data'
MODELS_DIR = SHARED_DIR / 'models'

profiles_csv_path = DATA_DIR / 'tn_profiles'

sys.path.append(str(SHARED_DIR))

from resumely_lib import *

train_file_name = 'train_mongo_data.csv'
#profiles_csv_path = DATA_DIR / "tn_profiles" / "new_tn_profiles.csv"
profiles_csv_path = DATA_DIR / "tn_profiles" / train_file_name

country_col_name = 'country'

n_rows = 1000
real_row_count = -1
seed = 7
fn_dict, ln_dict = {}, {}
model = None
encoder = None
do_shuffle_df = True

def get_df(path = None, file = '*'):
    if path is None: return
    df = pd.read_csv(path)

    if n_rows > 0: df = df.head(n_rows)

    if do_shuffle_df: df = df.sample(frac=1)
    print(df.head())

    return df

def get_data():
    dataset = get_df(profiles_csv_path, train_file_name)
    fn_X, ln_X = dataset['first_name'], dataset['last_name']

    global real_row_count
    real_row_count = dataset.shape[0]

    fn_le, ln_le = LabelEncoder(), LabelEncoder()
    fn_le.fit(fn_X)
    ln_le.fit(ln_X)
    fn_X, ln_X = fn_le.fit_transform(fn_X), ln_le.fit_transform(ln_X)

    #print('After LE: \n', fn_le.classes_, '\n', ln_le.classes_, '\n')

    fn_ohe, ln_ohe = OneHotEncoder(handle_unknown='ignore'), OneHotEncoder(handle_unknown='ignore')
    fn_X, ln_X = fn_X.reshape(-1, 1), ln_X.reshape(-1, 1)

    fn_ohe.fit(fn_X)
    ln_ohe.fit(ln_X)

    fn_X, ln_X = fn_ohe.fit_transform(fn_X).toarray(), ln_ohe.fit_transform(ln_X).toarray()
    X = fn_ohe.fit_transform(dataset[['first_name','last_name']]).toarray()
    
    global encoder
    encoder = fn_ohe
    #X = fn_ohe.fit_transform(dataset[['first_name','last_name']] + dataset[['first_name','last_name']]).toarray(), ln_ohe.fit_transform(ln_X).toarray()

    global fn_dict, ln_dict 

    fn_X_list = fn_X.tolist()
    ln_X_list = ln_X.tolist()


    fn_dict = dict(zip(dataset['first_name'], fn_X_list))
    ln_dict = dict(zip(dataset['last_name'], ln_X_list))

    #print()
    real_row_count = len(fn_dict)

    #print('Dictionaries: \n', 'FN:', fn_dict, '\n \n', 'LN:', ln_dict, '\n')

    le = LabelEncoder()
    le.fit(dataset[country_col_name])
    y_train_enc = le.transform(dataset[country_col_name])
    
    print(
        'Classes:',
        le.classes_, '\n'
    )

    pickle.dump(le, open(MODELS_DIR / "label_encoder.pickle.dat", "wb"))

    return X, y_train_enc
    #return fn_X, ln_X, y_train_enc
    #return X, y_train_enc
    # split data into X and y

def main():
    global model, real_row_count, fn_dict, ln_dict

    # Load data
    #x_1, x_2, labels = get_data()
    X_train, y_train = get_data()
    #X_train = np.concatenate((x_1, x_2), axis=1)
    # x_1 = x_1 + x_2
    #print(X_train)
    # fn_x_new = 'kamel'
    # ln_x_new = 'Saad'
    # X_input = prepare_input(fn_x_new, ln_x_new)
    # print(fn_oh)
    # split data into train and test sets
    test_size = 0.33

    Resumely.print_unique_vals_and_count(y_train)

    X_train, X_test, y_train, y_test = train_test_split(X_train, y_train, test_size=test_size, random_state=seed)

    # fit model no training data
    model = XGBClassifier()
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    predictions = [round(value) for value in y_pred]

    # evaluate predictions
    accuracy = accuracy_score(y_test, predictions)
    print("Accuracy: %.2f%%" % (accuracy * 100.0))

    with open(MODELS_DIR / 'train_info.json', 'wb') as file:
        final_output = {'real_row_count': real_row_count, 'fn_dict': fn_dict, 'ln_dict': ln_dict}
        file.write(json.dumps(final_output, sort_keys=True, indent=4).encode("utf-8"))
        # file.write(json.dumps(fn_dict, sort_keys=True, indent=4).encode("utf-8"))
        # file.write(json.dumps(ln_dict, sort_keys=True, indent=4).encode("utf-8"))

    pickle.dump(model, open(MODELS_DIR / "model.pickle.dat", "wb"))
    pickle.dump(encoder, open(MODELS_DIR / "encoder.pickle.dat", "wb"))

if __name__ == '__main__':
    main()