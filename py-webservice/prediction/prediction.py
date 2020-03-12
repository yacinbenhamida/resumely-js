import numpy as np
#from xgboost import XGBClassifier
from sklearn import preprocessing
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

from flask import Flask
from flask_restful import Resource, Api

import pandas as pd
import os, glob, sys
from pathlib import Path

import pickle
import json

BASE_DIR = Path(__file__).resolve().parent.parent
SHARED_DIR = BASE_DIR / 'shared'
DATA_DIR = SHARED_DIR / 'data'
MODELS_DIR = SHARED_DIR / 'models'

profiles_csv_path = DATA_DIR / "tn_profiles" / "new_tn_profiles.csv"

sys.path.append(str(SHARED_DIR))

from resumely_lib import *

model = None
encoder = None
le = None

def prepare_input(fn_x_new = None, ln_x_new = None):
    if fn_x_new is None or ln_x_new is None: return
    
    global encoder
    resumely = Resumely.get()

    # Start with first name reverse hot encoding
    
    # Handling first name
    min_dist = 9999
    closestFname = fn_x_new

    for fname in encoder.categories_[0]:
        dist = resumely.levenshtein_distance(fn_x_new, fname)
        if(dist < min_dist):
            min_dist = dist
            closestFname = fname
        
    # Handling last name
    min_dist = 9999
    closestLname = ln_x_new
    
    for lname in encoder.categories_[1]:
        dist = resumely.levenshtein_distance(ln_x_new, lname)
        if(dist < min_dist):
            min_dist = dist
            closestLname = lname

    X_input = encoder.transform([[closestFname, closestLname]]).toarray()
    
    print('\n', 'Final closest name:', closestFname, closestLname)

    return X_input

class Predictor(Resource):
    def get(self, fname, lname):
        global model, encoder, le

        X_input = prepare_input(fname, lname)
        # print(X_input.shape)
        y_pred = model.predict(X_input)
        # make predictions for test data
        # evaluate predictions

        accuracy = 'Not Calculated' #accuracy_score([2], y_pred)
        #print("Accuracy: %.2f%%" % (accuracy * 100.0))

        pred = le.inverse_transform(y_pred)

        return {
            'Prediction': str(pred[0])
            ,'Accuracy': str(accuracy)
        }

def main():
    global model, encoder, le
    model = pickle.load(open(str(MODELS_DIR / "model.pickle.dat"), "rb"))
    encoder = pickle.load(open(str(MODELS_DIR / "encoder.pickle.dat"), "rb"))
    le = pickle.load(open(str(MODELS_DIR / "label_encoder.pickle.dat"), "rb"))
    
    app = Flask(__name__)
    api = Api(app)
    api.add_resource(Predictor, '/<string:fname>/<string:lname>')

    app.run(debug=True, port=5555)

if __name__ == '__main__':
    main()