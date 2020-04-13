import numpy as np
import pandas as pd
import gensim
import csv
import re
import sys
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE

from pathlib import Path

# Config
BASE_DIR = Path(__file__).resolve().parent.parent
SHARED_DIR = BASE_DIR / 'shared'
DATA_DIR = SHARED_DIR / 'data'
MODELS_DIR = SHARED_DIR / 'models'

DEBUG = True
MODEL_SIZE = 3000
TOP_N = 4


def load_data():
    train_data_path = DATA_DIR / 'train_data_min.csv'
    data = []

    with open(train_data_path, encoding='utf-8') as f:
        text = f.read().lower().splitlines()
        for line in text:
            pack = line.split(",")
            data.append([pack[0], pack[1], pack[2]])
            data.append([pack[1], pack[0], pack[2]])

    data.pop(0)

    labels = list(set([pack[2] for pack in data]))

    return data, labels


def load_model(data):
    model_path = DATA_DIR / 'w2v_model.model'
    use_cache = True

    model = gensim.models.Word2Vec.load(str(model_path))

    if not use_cache or not model:
        model = gensim.models.Word2Vec(data, size=MODEL_SIZE, window=3, sg=1)
        model.save(str(model_path))

    return model


def predict(model, words, labels):

    pred = [[]] * len(words)
    for w_idx, word in enumerate(words):
        word = word.lower()
        for l in labels:
            do_skip = (l not in model.wv.vocab) or (word not in model.wv.vocab)
            if do_skip:
                # pred[w_idx].append({'label': l, 'score': 0})
                continue

            sim = model.wv.similarity(word, l)
            pred[w_idx].append({'label': l, 'score': sim})

    out_pred = pred[0]

    for p in pred[1:]:
        for x in range(len(p)):
            out_pred[x]['score'] = (
                out_pred[x]['score'] + p[x]['score']) / len(words)

    out_pred = sorted(out_pred, key=lambda x: x['score'], reverse=True)

    return out_pred


def plot_vec(model, word):
    if not DEBUG:
        return
    arr = np.empty((0, MODEL_SIZE), dtype='f')
    word_labels = [word]

    # get close words
    close_words = model.wv.similar_by_word(word)

    # add the vector for each of the closest words to the array
    arr = np.append(arr, np.array([model[word]]), axis=0)
    for wrd_score in close_words:
        wrd_vector = model[wrd_score[0]]
        word_labels.append(wrd_score[0])
        arr = np.append(arr, np.array([wrd_vector]), axis=0)

    # find tsne coords for 2 dimensions
    tsne = TSNE(n_components=2, random_state=0)
    np.set_printoptions(suppress=True)
    Y = tsne.fit_transform(arr)

    x_coords = Y[:, 0]
    y_coords = Y[:, 1]
    # display scatter plot
    plt.scatter(x_coords, y_coords)

    for label, x, y in zip(word_labels, x_coords, y_coords):
        plt.annotate(label, xy=(x, y), xytext=(
            0, 0), textcoords='offset points')
    plt.xlim(x_coords.min()+0.00005, x_coords.max()+0.00005)
    plt.ylim(y_coords.min()+0.00005, y_coords.max()+0.00005)
    plt.show()


def main():
    data, labels = load_data()
    model = load_model(data)
    pred = predict(model, ['eya'], labels)
    print(pred[:TOP_N])

    # plot_vec(model, 'tunisia')

    return

    sim = model.wv.similarity('achraf', 'tunisia')
    print(sim)
    # plot_vec(model, 'tunisia')

    return

    result = model.wv.similar_by_word('tunisia')

    print(*result)
    return None
    print("\n" * 3)

    common_dictionary = gensim.corpora.dictionary.Dictionary(data)
    common_corpus = [common_dictionary.doc2bow(pack) for pack in data]

    lda = gensim.models.LdaModel(common_corpus, num_topics=2)
    lsi = gensim.models.LsiModel(
        common_corpus, id2word=common_dictionary, num_topics=2)

    # Query Test
    # other_corpus = [common_dictionary.doc2bow(text) for text in [['eya', 'saad']]]
    # vector = lda[other_corpus[0]]

    doc = "léa cahon"
    vec_bow = common_dictionary.doc2bow(doc.lower().split())
    vec_lsi = lsi[vec_bow]  # convert the query to LSI space

    print(vec_lsi)

    # transform corpus to LSI space and index it
    index = gensim.similarities.MatrixSimilarity(lsi[common_corpus])
    sims = index[vec_lsi]  # perform a similarity query against the corpus
    # print (document_number, document_similarity) 2-tuples
    print(list(enumerate(sims)))

    sims = sorted(enumerate(sims), key=lambda item: -item[1])
    for i, s in enumerate(sims):
        print(s, data[i])


if __name__ == '__main__':
    main()
