import re
import string

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

def separate_versions(all_songs):
    live_versions = [song for song in all_songs if is_live(song)]
    live_titles = set(song['title'] for song in live_versions)
    regular_versions = [song for song in all_songs
                        if not is_live(song)
                        and song['title'] in live_titles]
    regular_titles = set(song['title'] for song in regular_versions)
    return live_versions, live_titles, regular_versions, regular_titles

def compare_versions(live_versions, live_titles, regular_versions, regular_titles):
    output = [{ 'title': title,
                'live_value': avg([x['song_hotttnesss'] 
                                   for x in live_versions if x['title'] == title]),
                'regular_value': avg([x['song_hotttnesss'] 
                                      for x in regular_versions if x['title'] == title])
              }
              for title in live_titles & regular_titles]
    for song in output:
        song['score'] = song['live_value'] - song['regular_value']
    return output
