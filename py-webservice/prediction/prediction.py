import numpy as np
from xgboost import XGBClassifier
from sklearn import preprocessing
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from sklearn.preprocessing import LabelEncoder, OneHotEncoder

from flask import Flask
from flask_restful import Resource, Api

import pandas as pd
import os, glob
from pathlib import Path

import pickle
import json

app = Flask(__name__)
api = Api(app)

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / 'shared' / 'data'
MODELS_DIR = BASE_DIR / 'shared' / 'models'

profiles_csv_path = DATA_DIR / "tn_profiles" / "new_tn_profiles.csv"

model = None
encoder = None
le = None

def levenshtein_distance(seq1, seq2):
    size_x = len(seq1) + 1
    size_y = len(seq2) + 1
    matrix = np.zeros ((size_x, size_y))
    for x in list(range(size_x)):
        matrix [x, 0] = x
    for y in list(range(size_y)):
        matrix [0, y] = y

    for x in list(range(1, size_x)):
        for y in list(range(1, size_y)):
            if seq1[x-1] == seq2[y-1]:
                matrix [x,y] = min(
                    matrix[x-1, y] + 1,
                    matrix[x-1, y-1],
                    matrix[x, y-1] + 1
                )
            else:
                matrix [x,y] = min(
                    matrix[x-1,y] + 1,
                    matrix[x-1,y-1] + 1,
                    matrix[x,y-1] + 1
                )
    return (matrix[size_x - 1, size_y - 1])

def prepare_input(fn_x_new = None, ln_x_new = None):
    if fn_x_new is None or ln_x_new is None: return
    
    global encoder

    # Start with first name reverse hot encoding
    
    # Handling first name
    min_dist = 9999
    closestFname = fn_x_new

    for fname in encoder.categories_[0]:
        dist = levenshtein_distance(fn_x_new, fname)
        if(dist < min_dist):
            min_dist = dist
            closestFname = fname
        
    # Handling last name
    min_dist = 9999
    closestLname = ln_x_new
    
    # print(encoder.categories_)

    for lname in encoder.categories_[1]:
        dist = levenshtein_distance(ln_x_new, lname)
        if(dist < min_dist):
            min_dist = dist
            closestLname = lname

    X_input = encoder.transform([[closestFname, closestLname]]).toarray()
    
    print('\n', 'Final closest name:', closestFname, closestLname)
    # print(X_input)

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
api.add_resource(Predictor, '/<string:fname>/<string:lname>')

def main():
    global model, encoder, le
    model = pickle.load(open(MODELS_DIR / "model.pickle.dat", "rb"))
    encoder = pickle.load(open(MODELS_DIR / "encoder.pickle.dat", "rb"))
    le = pickle.load(open(MODELS_DIR / "label_encoder.pickle.dat", "rb"))
    
    app.run(debug=True, port=5555)

if __name__ == '__main__':
    main()