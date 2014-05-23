import sys
import json
import string
import pyen
import flask
app = flask.Flask(__name__)
from .utils import format_title, separate_versions, compare_versions

@app.route('/')
@app.route('/index')
def index():
    artist = flask.request.args.get('artist', None)
    if artist == None:
        return flask.render_template('index.html', data=False, artist=artist)
    else:
        artist = string.capwords(artist)
        return en_data(artist)

def en_data(artist):
    en = pyen.Pyen()

    try:
        raw_response = en.get('song/search', 
                              artist = artist,
                              bucket=['song_type', 'song_hotttnesss'], 
                              #sort=['title-asc'], 
                              results=100)
    except pyen.PyenException, pyen.PyenConfigurationException:
        data = False
        msg = "Better off Live couldn't reach the EchoNest database. Please try again later."

    else:
        if raw_response['songs'] == []:
            data = False
            msg = "There are no songs by %s in EchoNest's database." % artist
        else:
            all_songs = [format_title(song) for song in raw_response['songs']]
            output = compare_versions(*separate_versions(all_songs))
            if output == []:
                data = False
                msg = "There's not enough data on %s to compare live versions " % artist +\
                      "to non-live versions."
            else:
                sorted_output = sorted(output, 
                                       key=lambda d: d['live_value'] - d['regular_value'], 
                                       reverse=True)
                data = json.dumps(sorted_output)
                msg = ""
    finally:
        return flask.render_template('index.html', data=data, msg=msg, artist=artist)
