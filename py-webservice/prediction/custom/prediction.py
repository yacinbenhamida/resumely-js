import pandas as pd
import operator
from itertools import chain
from collections import Counter
from pathlib import Path
import json
import sys
import csv

from flask import Flask
from flask_restful import Resource, Api

# Config
BASE_DIR = Path(__file__).resolve().parent.parent.parent
SHARED_DIR = BASE_DIR / 'shared'
DATA_DIR = SHARED_DIR / 'data'
MODELS_DIR = SHARED_DIR / 'models'

REMOVE_0_CONF_COUNTRIES = True
TOP_SKILLS = 15

DEBUG = False
TEST_FNAME = 'eya'
TEST_LNAME = 'saad'


def load_df():
    train_data_path = DATA_DIR / 'train_data_full.csv'
    df = pd.read_csv(train_data_path, encoding='utf-8')
    return df


def get_occ(word, df, cols=['first_name', 'last_name'], key_name='country', normalize=True, edit_dist_check=True, do_sort=True):
    ARE_CLOSE_THRESHOLD = int(len(word) * 0.3) * edit_dist_check

    word = word.lower()
    df[key_name] = df[key_name].str.lower()
    keys = df[key_name].unique()

    skills = []
    occ = dict()
    all_count = 0

    for key in keys:
        freq = 0
        from nltk.metrics import edit_distance

        for col in cols:
            df[col] = df[col].str.lower()

            sub_df = df.loc[df[key_name].str.lower() == key.lower()]

            results = sub_df.apply(lambda x: edit_distance(
                str(x[col]).lower(), word), axis=1)
            results = pd.DataFrame({'edit_distance': results})
            sub_df = pd.concat([sub_df, results], axis=1)

            sub_df = sub_df.loc[sub_df['edit_distance']
                                <= ARE_CLOSE_THRESHOLD]

            for sk in sub_df['skills']:
                sk = sk.replace('[', '').replace(']', '').replace(
                    '"', '').replace("'", '').split(',')
                sk = [" ".join(s.title().split()) for s in sk]
                skills.append(sk)

            freq += sub_df.shape[0]

        all_count += freq
        occ[key] = freq

    if normalize:
        for k in occ:
            if not all_count:
                occ[k] = 0
            else:
                occ[k] /= all_count

    if do_sort:
        occ = dict(sorted(occ.items(), key=operator.itemgetter(1), reverse=True))

    return occ, all_count, skills


def mean_occ(occ1, occ2):
    occ = dict()

    for k in occ1:
        v = (occ1[k] + occ2[k]) / 2
        if REMOVE_0_CONF_COUNTRIES and v > 0:
            occ[k] = (occ1[k] + occ2[k]) / 2

    occ = dict(sorted(occ.items(), key=operator.itemgetter(1), reverse=True))
    return occ


def merge_skills(skills1, skills2):
    skills = [sk for sk in list(
        chain.from_iterable(skills1 + skills2)) if sk != ""]
    skills = sorted(skills, key=Counter(skills).get, reverse=True)
    skills = list(dict.fromkeys(skills))
    return skills[:TOP_SKILLS]


def correct(fn, ln, lb):

    train_data_path = DATA_DIR / 'train_data_full.csv'

    row_list = [[fn, ln, lb, []]]
    with open(train_data_path, 'a+', newline='') as file:
        writer = csv.writer(file)
        writer.writerows(row_list)

    return True

def predict(fn, ln, df):
    fn_occ, all_fn_count, fn_skills = get_occ(fn, df)
    ln_occ, all_ln_count, ln_skills = get_occ(ln, df)

    occ = mean_occ(fn_occ, ln_occ)
    skills = merge_skills(fn_skills, ln_skills)

    best = 'None'
    if len(occ.keys()):
        best = list(occ.keys())[0].title()

    if DEBUG:
        print('\nFirst Name:\n -OCC:', fn_occ, '\n -Count', all_fn_count)
        print('Last Name:\n -OCC:', ln_occ, '\n -Count', all_ln_count)
        print('Mean:\n -Count:', occ)
        print('TOP Skills:\n ', skills, '\n')

    print('Predicted:', best)

    return occ, skills, best

class Corrector(Resource):

    def get(self, fname, lname, label):

        res = correct(fname, lname, label)

        return True;


class Predictor(Resource):
    
    def get(self, fname, lname):

        res = predict(fname, lname, load_df())

        return {"Prediction": res}


def main():
    return predict(TEST_FNAME, TEST_LNAME, load_df())


if __name__ == '__main__':
    main()
