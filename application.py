from flask import Flask
app = Flask(__name__)

from flask import render_template, json, jsonify

import os

# render index
@app.route('/')
def render_index(name=None):
    #app.logger.info('test')
    return render_template('index.html', name=name)

# send processed data upon request
@app.route('/corpus', methods = ['POST'])
def send_corpus_json():

    # grab current path
    path_new = os.path.dirname(__file__)

    # join path with location of json file
    json_url = os.path.join(path_new, "static/data", "data.json")

    # load json and jsonify the data to send it back to the server
    raw_data = json.load(open(json_url, 'r'))
    data = jsonify(raw_data)

    return data
