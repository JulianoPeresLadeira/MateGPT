from sentiment import Sentiment
from flask import Flask, request
import json

app = Flask(__name__)

s = Sentiment(1000)

s.analyse("chupame la 3=====D")


@app.route('/', methods=['POST'])
def get_text_data():
    data = request.get_json()
    text = data['text']


    # return the values
    return json.dumps(s.analyse(text))

if __name__ == '__main__':
    app.run()
