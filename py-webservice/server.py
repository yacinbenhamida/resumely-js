from flask import Flask, jsonify, request, Response
from flask_restful import Resource, Api, reqparse
from pathlib import Path
import sys
from login import Login, Protected
# Paths
BASE_DIR = Path(__file__).resolve().parent
PREDICTION_DIR = BASE_DIR / 'prediction' / 'custom'

# Import Services
sys.path.append(str(PREDICTION_DIR))
from prediction import Predictor, Corrector

from BackgroundThreads import BackgroundThread , SingleBgThread
# Route your service here
def routes(api):
    api.add_resource(Corrector, '/<string:fname>/<string:lname>/<string:label>')
    api.add_resource(Predictor, '/<string:fname>/<string:lname>')
    api.add_resource(BackgroundThread, '/scrap/<string:country>/<string:idop>') #get request, multiple profiles
    api.add_resource(SingleBgThread, '/scrap-single') #post request, one target
    
app = Flask(__name__)
api = Api(app)
routes(api)
