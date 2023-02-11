from nltk.classify import NaiveBayesClassifier
from nltk.corpus import subjectivity
from nltk.sentiment import SentimentAnalyzer
from nltk.sentiment.util import *
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import nltk 
from nltk import tokenize



nltk.download('subjectivity')
nltk.download('punkt')
nltk.download('vader_lexicon')

class Sentiment:
    def __init__(self,  instances):
        self.n_instances = instances
        self.subj_docs = [(sent, 'subj') for sent in subjectivity.sents(categories='subj')[:self.n_instances]]
        self.obj_docs = [(sent, 'obj') for sent in subjectivity.sents(categories='obj')[:self.n_instances]]
        self.train_subj_docs = self.subj_docs[:80]
        self.test_subj_docs = self.subj_docs[80:self.n_instances]
        self.train_obj_docs = self.obj_docs[:80]
        self.test_obj_docs = self.obj_docs[80:self.n_instances]
        self.training_docs = self.train_subj_docs + self.train_obj_docs
        self.testing_docs = self.test_subj_docs + self.test_obj_docs
        self.sentim_analyzer = SentimentAnalyzer()
        self.all_words_neg = self.sentim_analyzer.all_words([mark_negation(doc) for doc in self.training_docs])
        self.unigram_feats = self.sentim_analyzer.unigram_word_feats(self.all_words_neg, min_freq=4)
        self.sentim_analyzer.add_feat_extractor(extract_unigram_feats, unigrams=self.unigram_feats)

        training_set = self.sentim_analyzer.apply_features(self.training_docs)
        test_set = self.sentim_analyzer.apply_features(self.testing_docs)

        trainer = NaiveBayesClassifier.train
        classifier = self.sentim_analyzer.train(trainer, training_set)
        for key,value in sorted(self.sentim_analyzer.evaluate(test_set).items()):
            print('{0}: {1}'.format(key, value))

    def analyse(self, input):
        sid = SentimentIntensityAnalyzer()
        print(input)
        ss = sid.polarity_scores(input)
        return_values = {}
        for k in sorted(ss):
            print('{0}: {1}, '.format(k, ss[k]), end='')
            return_values[k] = ss[k]
        return return_values