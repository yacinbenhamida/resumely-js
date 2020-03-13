import numpy as np
import pandas as pd
from pathlib import Path
import pycountry
import os, glob, sys, re

BASE_DIR = Path(__file__).resolve().parent.parent
SHARED_DIR = BASE_DIR / 'shared'
DATA_DIR = SHARED_DIR / 'data'

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(SHARED_DIR))

from resumely_lib import *

profiles_csv_path = DATA_DIR / 'tn_profiles'
dict_path = DATA_DIR / 'dict_names'
n_rows = -1

class Resumely:
   __instance = None
   @staticmethod 
   def get():
      """ Static access method. """
      if Resumely.__instance == None:
         Resumely()
      return Resumely.__instance
   def __init__(self):
      """ Virtually private constructor. """
      
      self.__load_data_preprocess()

      if Resumely.__instance != None:
         raise Exception("This class is a singleton!")
      else:
         Resumely.__instance = self

   ### PATHS ###
   @staticmethod
   def get_base_dir():
      return BASE_DIR;

   @staticmethod
   def get_data_dir():
      return DATA_DIR;

   @staticmethod
   def get_shared_dir():
      return SHARED_DIR;

   ### PREPROCESSING ###

   @staticmethod
   def augment_data(df = None, max_ln_iter = -1):
      if df is None: return None;
      
      by = ['first_name', 'last_name', 'country']
      
      all_cats = df['country'].unique()

      first_names_col = []
      last_names_col = []
      country_col = []

      for _, cat in enumerate(all_cats):
         print('Cat: ' + cat)
         loop_df = df.loc[df['country'] == cat]

         for index, row in loop_df.iterrows():
               for scnd_index, scnd_row in loop_df.iterrows():
                  if max_ln_iter > 0 and scnd_index >= max_ln_iter: break
                  first_names_col.append(row['first_name'])
                  last_names_col.append(scnd_row['last_name'])
                  country_col.append(cat)

      df = pd.DataFrame()

      df['first_name'] = first_names_col
      df['last_name'] = last_names_col
      df['country'] = country_col

      return df

   def __load_data_preprocess(self):
         # Used as a dictionnary to compare for first names.
         self.__first_names_df = pd.concat(map(pd.read_csv, glob.glob(os.path.join(dict_path, "*.csv"))))
         
         # Minimal distance to consider current name as first name.
         self.__min_is_firstname_dist = 5 
          
   # https://medium.com/@ertuodaba/string-matching-using-machine-learning-with-python-matching-products-of-getir-and-carrefoursa-f8ce29d2959f
   # Return similarity distance between two strings.
   @staticmethod
   def levenshtein_distance(seq1, seq2):
      seq1 = seq1.lower()
      seq2 = seq2.lower()

      seq1 = re.sub(r'\W+', '', seq1)
      seq2 = re.sub(r'\W+', '', seq2)

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
      
   @staticmethod
   def sorted_levenshtein_rate(seq1, seq2):
      seq1 = ''.join(sorted(seq1))
      seq2 = ''.join(sorted(seq2))
      return Resumely.levenshtein_rate(seq1, seq2)

   @staticmethod
   def levenshtein_rate(seq1, seq2):
      distance = Resumely.levenshtein_distance(seq1, seq2)
      max_len = max(len(seq1), len(seq2))
      return 1 - (distance / max_len)

   @staticmethod
   def sorted_levenshtein_apply(str):
      seq1 = ''.join(sorted(str))
      seq2 = ''.join(sorted(row['last_name']))
      distance = Resumely.levenshtein_distance(seq1, seq2)
      return distance

   @staticmethod
   def sorted_levenshtein_rate_apply(row):
      seq1 = ''.join(sorted(row['first_name']))
      seq2 = ''.join(sorted(row['last_name']))
      distance = Resumely.levenshtein_distance(seq1, seq2)
      max_len = max(len(seq1), len(seq2))
      return 1 - (distance / max_len)

   @staticmethod
   def test_levenshtein():
      met1 = 'Achraf'
      met2 = 'Chrif'
      print('Levenshtein Distance: {}, MatchScore: {} '.\
            format(Resumely.levenshtein_distance(met1, met2), Resumely.levenshtein_rate(met1, met2)))
      # print('Sorted Levenshtein Distance: ', sorted_levenshtein(met1, met2))
      print('Sorted Levenshtein Distance: {}, MatchScore: {} '.\
            format(Resumely.sorted_levenshtein(met1, met2), Resumely.sorted_levenshtein_rate(met1, met2)))

   @staticmethod
   def get_closest_country_to_name(name = 'None', use_ratio = False):
      distance = 9999
      
      name = re.sub(r'\W+', '', name)

      # Split an example 'TunisTunisTunisie' to ['Tunis' 'Tunis' 'Tunisie'] array
      name = re.sub( r"([A-Z])", r" \1", name)

      outName = name
      
      for country in pycountry.countries:
         countryName = country.name
         # print(countryName)

         for subname in name.split():
            curDist = 9999

            if use_ratio:
               curDist = Resumely.levenshtein_rate(subname, countryName)
            else:
               curDist = Resumely.levenshtein_distance(subname, countryName)

            if(distance > curDist):
               distance = curDist
               outName = countryName
      
      print('From', name, 'to', outName, 'with Distance:', distance)
      return outName, distance

   # Returns a DataFrame object from a file(s) (could be *) of a specified path.
   # Can concatenate found files of similar structure.
   @staticmethod
   def get_df(path = None, file = None, n_rows = 0):
      if path is None or file is None: return None

      df = pd.concat(map(pd.read_csv, glob.glob(os.path.join(path, file))))

      if n_rows > 0: df = df.head(n_rows)
      return df

   # Whether the given name is a first name.
   # TODO: Return the guess' name country as well.
   def is_first_name(self, name):
      if name is None: return False
      if self.__first_names_df is None: return False

      min_dist = sys.float_info.max
      min_dist_similiar_name = 'None'

      for index, row in self.__first_names_df.iterrows():
         dist = self.levenshtein_distance(name, row[0])
         if dist < min_dist:
               min_dist_similiar_name = row[0]
               min_dist = dist

      # print('Min distance recorded to \'' + name + '\' =', min_dist, ", being similar to: \'" + min_dist_similiar_name + '\'')
      print('Min Distance = ' + str(min_dist) + ': \'(' + name + ", " + min_dist_similiar_name + ")\'")
      if n_rows > 0: input()
      return min_dist < self.__min_is_firstname_dist

   # Here check if first substring is more likely a first name.
   def get_first_last_names(self, fullname = None):
      if fullname is None: return

      seq1, seq2 = fullname.split(" ", 1)[0], fullname.split(" ", 1)[1]

      if self.is_first_name(seq1):
         return seq1, seq2

      return seq2, seq1

   def preprocess(self, df = None):
      if df is None: return
      
      first_names_col = []
      last_names_col = []

      for index, row in df.iterrows():
         fullname = row[0]

         f_name, l_name = self.get_first_last_names(fullname)

         first_names_col.append(f_name)
         last_names_col.append(l_name)
      
      df['first_name'] = first_names_col
      df['last_name'] = last_names_col

      # Remove Duplicates
      df1 = pd.DataFrame(np.sort(df[['first_name','last_name']], axis=1))

   ### HELPERS ###

   @staticmethod
   def print_unique_vals_and_count(arr):
      print('\n')
      #print('Original Numpy Array : ' , arr)
      # Get a tuple of unique values & their frequency in numpy array
      uniqueValues, occurCount = np.unique(arr, return_counts=True)
      for i in range(len(uniqueValues)):
         print(uniqueValues[i], ':', occurCount[i])

Resumely.get()