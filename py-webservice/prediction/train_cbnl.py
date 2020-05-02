# Character-Based Neural Language approach
# https://machinelearningmastery.com/develop-character-based-neural-language-model-keras/

import numpy as np
import pandas as pd
import sys

from numpy import array
from pickle import dump
import tensorflow as tf
from keras.utils import to_categorical
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM

from pickle import load
from keras.models import load_model
from keras.utils import to_categorical
from keras.preprocessing.sequence import pad_sequences

from pathlib import Path

# Config
BASE_DIR = Path(__file__).resolve().parent.parent
SHARED_DIR = BASE_DIR / 'shared'
DATA_DIR = SHARED_DIR / 'data'
MODELS_DIR = SHARED_DIR / 'models'

DEBUG = True
TRAIN = False


def load_data():
    train_data_path = DATA_DIR / 'train_data_min.csv'
    data = ''

    with open(train_data_path, encoding='utf-8') as f:
        text = f.read().lower().splitlines()
        for line in text[1:]:
            pack = line.split(",")
            data = data + pack[0] + ' ' + pack[1] + ' is from ' + pack[2] + '\n'

    return data


def get_sequences(data, use_cache=False):
    sequences_path = DATA_DIR / 'train_sequences.txt'

    if use_cache:
        try:
            with open(sequences_path, encoding='utf-8') as f:
                sequences = f.read()
                sequences = '\n'.join(sequences)
                f.close()
                return sequences

        except IOError:
            print('No text cache, will generate now.')

    tokens = data.split()
    data = ' '.join(tokens)

    length = 10
    sequences = list()
    for i in range(length, len(data)):
        # select sequence of tokens
        seq = data[i - length:i + 1]
        # store
        sequences.append(seq)

    if DEBUG:
        print('Total Sequences: %d' % len(sequences))

    sequences = '\n'.join(sequences)
    f = open(sequences_path, 'w', encoding='utf-8')
    f.write(sequences)
    f.close()

    return sequences


def train(sequences):
    model_path = DATA_DIR / 'model.h5'
    mapping_path = DATA_DIR / 'mapping.pkl'

    if not TRAIN:
        model = load_model(model_path)
        mapping = load(open(mapping_path, 'rb'))

        return model, mapping

    lines = sequences.split('\n')

    chars = sorted(list(set(sequences)))
    mapping = dict((c, i) for i, c in enumerate(chars))

    if DEBUG:
        print(chars, '\n', '\n', mapping)

    sequences = list()
    for line in lines:
        # Integer encode line
        encoded_seq = [mapping[char] for char in line]
        # Store
        sequences.append(encoded_seq)

    # Vocabulary size
    vocab_size = len(mapping)
    print('Vocabulary Size: %d' % vocab_size)

    # Separate into input and output
    sequences = array(sequences)
    X, y = sequences[:, :-1], sequences[:, -1]
    sequences = [to_categorical(x, num_classes=vocab_size) for x in X]
    X = array(sequences)
    y = to_categorical(y, num_classes=vocab_size)

    # Define model
    model = Sequential()
    model.add(LSTM(75, input_shape=(X.shape[1], X.shape[2])))
    model.add(Dense(vocab_size, activation='softmax'))
    print(model.summary())
    # Compile model
    model.compile(loss='categorical_crossentropy',
                  optimizer='adam', metrics=['accuracy'])
    # Fit model
    model.fit(X, y, epochs=10, verbose=2)

    # Save the model to file
    model.save(str(model_path))
    # Save the mapping
    dump(mapping, open(str(mapping_path), 'wb'))

    return model, mapping


def predict(model, mapping, seq_length, seed_text, n_chars):
    seed_text = seed_text.lower()
    in_text = seed_text
    # generate a fixed number of characters
    for _ in range(n_chars):
        # encode the characters as integers
        encoded = [mapping[char] for char in in_text]
        # truncate sequences to a fixed length
        encoded = pad_sequences([encoded], maxlen=seq_length, truncating='pre')
        # one hot encode
        encoded = to_categorical(encoded, num_classes=len(mapping))
        # encoded = encoded.reshape(-1, encoded.shape[0], encoded.shape[1])
        # predict character
        yhat = model.predict_classes(encoded, verbose=0)
        # reverse map integer to character
        out_char = ''
        for char, index in mapping.items():
            if index == yhat:
                out_char = char
                break
        # append to input
        in_text += char
    return in_text


def main():
    data = load_data()
    sequences = get_sequences(data)
    model, mapping = train(sequences)
    pred = predict(model, mapping, 10, 'achraf saad ', 20)
    print(pred)


if __name__ == '__main__':
    main()
