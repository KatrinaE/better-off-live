import sys
import json
import pyen
import flask
app = flask.Flask(__name__)

from utils import format_title, separate_versions, compare_versions


@app.route('/')
@app.route('/index')
def index():
    artist = flask.request.args.get('artist', None)
    if artist == None:
        return flask.render_template('index.html', data=False)
    else:
        return en_data(artist)

def en_data(artist):
    comparator = 'song_hotttnesss'
    en = pyen.Pyen()
    raw_response = en.get('song/search', 
                          artist = artist,
                          bucket=['song_type', comparator], 
                          sort=['liveness-desc'], 
                          results=100)
    if raw_response['songs'] == []:
        data = False
        msg = "There are no songs for this artist in EchoNest's database."
    else:
        all_songs = [format_title(song) for song in raw_response['songs']]
        output = compare_versions(*separate_versions(all_songs))
        if output == []:
            data = False
            msg = "Not enough data to compare live versions to non-live versions."
        else:
            sorted_output = sorted(output, 
                                   key=lambda d: d['live_value'] - d['regular_value'], 
                                   reverse=True)
            data = json.dumps(sorted_output)
            msg = ""
    return flask.render_template('index.html', data=data, msg=msg)


if __name__ == '__main__':
    app.run()
