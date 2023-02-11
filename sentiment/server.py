from flask import Flask
from sentiment import Sentiment
app = Flask(__name__)

s = Sentiment(1000)

s.analyse("chupame la 3=====D")


"""

@app.route("/")
def home(): 
    return("Hey there! Im a bot")


@app.route('/sentiment'  , methods = ['POST', 'DELETE'])
def sentiment():
    s.analyse()
"""
