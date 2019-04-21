from flask import Flask
app = Flask(__name__)

from flask import render_template, json, jsonify

import os

# render index
@app.route('/')
def render_index(name=None):
    return render_template('index.html', name=name)

# send processed data upon request
@app.route('/corpus', methods = ['POST'])
def send_corpus_json():

    """
    TODO CAISEEN

    TODO #0 - load text
    TODO #1 - stemming
    TODO #2 - collocations (prints to stdout -> need a solution to catch these words and write into array)
    TODO #3 - repeat for all texts

    TODO #4 - get 30 most common words within all word environments and store that info in metadata

    TODO: Ultimately we want the following data structure: (using stringify to create it)

    {
        "metadata": {
            "CurrentKeyword": "",
            "topwords": [
                "", "", etc...
            ]
        },

        "data": [
            {
            "textID": "1",
            "title": "Johann Friedrich Herbart",
            "author": "Psychologie als Wissenschaft",
            "year": 1824,
            "CurrentKeyword": "Traum",
            "environments": [
                ["word21", "word4", "word1", "word2", "word5","word6","word7","Traum", "word9", "word10", "word11", "word12", "word13","word14","word15"],
                ["word1", "word2", "word3", "word5", "word4","word6","word7","Traum", "word9", "word10", "word11", "word12", "word13","word14","word15"],
                etc...
                ]
            },
            {
                "textID": "textID_2",
                "title": "Title 2",
                "author": "Fechner",
                "year": 1860,
                "CurrentKeyword": "Traum",
                "environments": [
                    ["word1", "word2", "word3", "word4", "word5","word6","word7","Traum", "word9", "word10", "word11", "word12", "word13","word14","word15"],
                    ["word1", "word2", "word3", "word4", "word5","word6","word7","Traum", "word9", "word10", "word11", "word12", "word13","word14","word15"],
                    etc...
                    ]
            }
        ]
    }
    """

    # grab current path
    #path = os.path.realpath(os.path.dirname(__file__))

    # join path with location of json file
    #json_url = os.path.join(path, "static\data", "data.json")

    # load json and jsonify the data to send it back to the server
    raw_data = json.load(open("static\data\data.json", 'r'))
    data = jsonify(raw_data)

    test = 'test'
    return data
