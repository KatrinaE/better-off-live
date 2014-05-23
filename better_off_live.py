import os
from better_off_live.main import app

if __name__ == "__main__":
    # Bind to PORT if defined (by Heroku), otherwise default to 5000.
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
