import sys
import re
import string
import json
import pyen
import flask
app = flask.Flask(__name__)

def is_live(song):
    """Returns True if we believe the song is a live version."""
    return 'live' in song['song_type'] or '(Live)' in song['title']

def format_title(song):
    """Removes expressions in parens and makes everything title case."""
    remove_parens = lambda s:  re.sub('(\s|^)\(.*\)','', s)
    song['title'] = remove_parens(string.capwords(song['title']))
    return song

def avg(values):
    return sum(values)/len(values)

@app.route('/')
@app.route('/index')
def en_data():
    artist = 'Lady GaGa'
    comparator = 'song_hotttnesss'
    en = pyen.Pyen()
    raw_response = en.get('song/search', 
                          artist = artist,
                          bucket=['song_type', comparator], 
                          sort=['liveness-desc'], 
                          results=100)
    all_songs = map(format_title, [song for song 
                                   in raw_response['songs']])
    live_versions = [song for song in all_songs if is_live(song)]
    live_titles = set(song['title'] for song in live_versions)
    regular_versions = [song for song in all_songs
                        if not is_live(song)
                        and song['title'] in live_titles]
    regular_titles = set(song['title'] for song in regular_versions)

    comparator_data = {title: {'regular': [], 'live': []} 
                        for title in regular_titles}

    for song in regular_versions:
        comparator_data[song['title']]['regular']\
            .append(song[comparator])
    for song in live_versions:
        if song['title'] in comparator_data:
            comparator_data[song['title']]['live']\
                .append(song[comparator])


    output = [{ 'title': title,
                'score': avg(values['live']) - avg(values['regular']) }
              for (title, values) in comparator_data.iteritems()]
    sorted_output = sorted(output, key=lambda d: d['score'])
    output_json = json.dumps(sorted_output)

    return flask.render_template('index.html', data=output_json)


if __name__ == '__main__':
    app.run()
