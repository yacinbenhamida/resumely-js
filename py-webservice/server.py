from flask import Flask
from flask_restful import Resource, Api
from pathlib import Path
import sys

# Paths
BASE_DIR = Path(__file__).resolve().parent
PREDICTION_DIR = BASE_DIR / 'prediction'

# Import Services
sys.path.append(str(PREDICTION_DIR))
from prediction import Predictor
from customscrapping import scrapdata
# Route your service here
def routes(api):
    api.add_resource(Predictor, '/<string:fname>/<string:lname>')
    api.add_resource(scrapdata.Scrapper, '/scrap/<string:country>')
    
def main():
    app = Flask(__name__)
    api = Api(app)
    routes(api)

    app.run(debug=True, port=5555)

if __name__ == '__main__':
    main()