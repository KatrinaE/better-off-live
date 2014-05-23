# Better off Live

## About
Better off Live uses song data from [Echo Nest](http://echonest.com) to compare an
artist's live recordings to recordings made in a studio or other non-live venue. It currently
relies on 'hotttnesss', an Echo Nest measure of a song's current popularity.

See it deployed at [betterofflive.katrinaeg.com](http://betterofflive.katrinaeg.com).

To limit API calls, Better off Live only examines 100 of an artist's songs. This sometimes leads to 
unexepected results - for example, there is insufficient data on the Rolling Stones because the first
100 songs Echo Nest finds are all live versions.


### Source
Better off Live was built with [Flask](http://flask.pocoo.org)
and [D3](http://d3js.org). To run it yourself, you will need
to register for an [Echo Nest API Key](http://developer.echonest.com) and store
it in the environment variable ECHO_NEST_API_KEY.
