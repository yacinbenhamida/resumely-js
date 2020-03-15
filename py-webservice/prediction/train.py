# Math & Data Format

import numpy as np
import pandas as pd

# Data Processing

from sklearn import preprocessing
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

# Models

# from xgboost import XGBClassifier # No longer making use of XGBoost
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import Perceptron
from sklearn.metrics import accuracy_score
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import classification_report
from sklearn.metrics import fbeta_score
from sklearn.metrics import f1_score

# API

from flask import Flask
from flask_restful import Resource, Api

# Utils
import os, glob, sys, pickle, json
from pathlib import Path

# Paths

BASE_DIR = Path(__file__).resolve().parent.parent
SHARED_DIR = BASE_DIR / 'shared'
DATA_DIR = SHARED_DIR / 'data'
MODELS_DIR = SHARED_DIR / 'models'

profiles_csv_path = DATA_DIR / 'tn_profiles'

sys.path.append(str(SHARED_DIR))

# Resumely LIB
from resumely_lib import *

# Where is the labeled training data.
train_file_name = 'train_mongo_data.csv'
# train_file_name = 'new_tn_profiles.csv'

# This is for the data to fill its country predictions.
fill_prediction_file_name = 'new_tn_profiles.csv'
fill_country_col_name = 'Pays'

profiles_csv_path = DATA_DIR / "tn_profiles" / train_file_name

country_col_name = 'country'

# Settings

n_rows = -1             # Used to work on a portion of data, usier for debugging.
seed = 7                # Used to seed train_test splitting.
model = None            # To save the model for prediction API.
encoder = None          # To save the OHE encoder for future inverse_transforms during predictions.
le = None               # To save the Label encoder for future inverse_transforms during predictions.
do_shuffle_df = False   # Whether to shuffle the data upon read.
group_samples = -1      # Whether to group rows by existing labels, make sure you specify a number >= to the least label count.
rem_cat_frequency = 1   # Whether to remove rows with above or equal to specified frequency

def get_df(path = None):
    if path is None: return
    df = pd.read_csv(path)

    if n_rows > 0: df = df.head(n_rows)

    # Manually getting rid of very low count label rows.
    # nm = ['Georgia']
    # df = df[~df[country_col_name].isin(nm)]

    # Specifying what to read, for debugging.
    # nm = ['Saad', 'Laure']
    # df = df[(df['first_name'].isin(nm))]

    pd.set_option('display.max_rows', df.shape[0]+1)
    
    # Here we remove categories with frequency = 1
    counts_category = df.groupby(country_col_name)[country_col_name].transform(len)
    mask = (counts_category > max(rem_cat_frequency, 1))
    df = df[mask]
    # print(counts_category)

    if group_samples > 0:
        df = pd.concat(g.sample(group_samples) for idx, g in df.groupby(country_col_name))

    if do_shuffle_df: df = df.sample(frac=1)
    
    # df = df[80:]
    Resumely.print_unique_vals_and_count(df[country_col_name])
    # print(df)

    return df

def get_data():
    dataset = get_df(profiles_csv_path)
    #dataset = dataset.sort_values('first_name')
    
    enc = OneHotEncoder(handle_unknown='ignore')
    X = dataset[['first_name','last_name']]
    #X = dataset[['first_name']]

    # print('X:', X)
    enc.fit(X)
    X = enc.transform(X).toarray()

    np.set_printoptions(threshold=sys.maxsize)

    global encoder
    encoder = enc

    """
    global fn_dict, ln_dict 

    fn_X_list = fn_X.tolist()
    ln_X_list = ln_X.tolist()

    fn_dict = dict(zip(dataset['first_name'], fn_X_list))
    ln_dict = dict(zip(dataset['last_name'], ln_X_list))

    real_row_count = len(fn_dict)
    """
    global le
    le = LabelEncoder()
    lab_fit = le.fit(dataset[country_col_name])
    labels = le.transform(dataset[country_col_name])

    # print(dataset[country_col_name])

    """
    print(
        'Classes:',
        le.classes_, '\n'
    )
    """

    pickle.dump(le, open(MODELS_DIR / "label_encoder.pickle.dat", "wb"))

    return X, labels

from sklearn.model_selection import KFold
from sklearn.model_selection import cross_val_score
from sklearn.metrics import confusion_matrix
from sklearn.svm import SVC

def main():

    global model, encoder, le

    # Load Data
    X_train, y_train = get_data()

    # print('Labels:', y_train)
    
    X_train, X_test, y_train, y_test = train_test_split(X_train, y_train#, test_size=0.25
                                                    #,random_state=4#, stratify=y_train, shuffle=True
                                                    )
    print('*'*3, 'MODEL SELECTION', '*'*3, '\n')

    # NOTE: Use Perceptron or LogisticRegression when training on CPU with large DATA.
    models = {
        'Perceptron' : Perceptron(max_iter=40, eta0=0.1, random_state=1)#,
        # 'LogisticRegression' : LogisticRegression(C=100.0, random_state=1),
        # 'LinearSVC' : SVC(kernel='linear', C=1.0, random_state=1),
        # 'KernelizedSVC' : SVC(kernel='rbf', random_state=1, gamma=5.0, C=1.0),
        # 'MLP' : MLPClassifier(activation='relu', alpha=0.0001, batch_size='auto', beta_1=0.9,
        # beta_2=0.999, early_stopping=False, epsilon=1e-08,
        # hidden_layer_sizes=(20, 20, 20), learning_rate='constant',
        # learning_rate_init=0.001, max_iter=500, momentum=0.9,
        # nesterovs_momentum=True, power_t=0.5, random_state=None,
        # shuffle=True, solver='adam', tol=0.0001, validation_fraction=0.1,
        # verbose=False, warm_start=False)
        }

    best_model_acc = 0
    best_model_name = 'None'
    best_model = None

    # Used for informative prediction testing during model selection.
    test_fnames = ['Saad', 'Laure']
    test_lnames = ['Achraf', 'Bouchart']
    # test_fnames = ['Saad', 'Laure']

    for model_name, model in models.items():
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)

        print('\n', '---' * 30, '\n')
        print(model_name)

        cur_acc = accuracy_score(y_test, y_pred)
        print('Accuracy: %.2f' % cur_acc)
        # creating a confusion matrix
        cm = confusion_matrix(y_test, y_pred)
        
        # print(cm)

        # print('Fscore: %.2f' % f1_score(y_test, y_pred))
        # print(classification_report(y_test, y_pred, labels=[1, 0], target_names=['match', 'no-match']))
        
        if cur_acc > best_model_acc:
            best_model = model
            best_model_acc = cur_acc
            best_model_name = model_name

        for idx in range(len(test_fnames)):
            inp = encoder.transform([[test_fnames[idx], test_lnames[idx]]]).toarray()
            # inp = encoder.transform([[test_fnames[idx]]]).toarray()
            z = encoder.inverse_transform(inp)
            pred = model.predict(inp)
            name_pred = le.inverse_transform(pred)

            # print(inp)
            print(z)
            print(pred, "=>", name_pred)

    print('\n ===> Best Model:', best_model_name, 'with accuracy =', best_model_acc, '\n')

    # No longer used.
    """ 
    with open(MODELS_DIR / 'train_info.json', 'wb') as file:
        # final_output = {'real_row_count': real_row_count, 'fn_dict': fn_dict, 'ln_dict': ln_dict} 
        file.write(json.dumps(final_output, sort_keys=True, indent=4).encode("utf-8"))
    """

    pickle.dump(model, open(MODELS_DIR / "model.pickle.dat", "wb"))
    pickle.dump(encoder, open(MODELS_DIR / "encoder.pickle.dat", "wb"))

if __name__ == '__main__':
    main()