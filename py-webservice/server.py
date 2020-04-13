from flask import Flask, jsonify, request
from flask_restful import Resource, Api, reqparse
from pathlib import Path
import sys
from threading import Thread
from tasks import threaded_task
# Paths
BASE_DIR = Path(__file__).resolve().parent
PREDICTION_DIR = BASE_DIR / 'prediction' / 'custom'

# Import Services
sys.path.append(str(PREDICTION_DIR))
from prediction import Predictor
from customscrapping import scrapdata
from tasks import threaded_task
class BackgroundThread(Resource):     
    def get(self,country,idop):
        thread = Thread(target=scrapdata.scrapper, args=(country,idop))
        thread.daemon = True
        thread.start()
        return jsonify({'thread_name': str(thread.name),
                        'started': True})
class SingleBgThread(Resource):
    def post(self):
        json_data = request.get_json(force=True)
        print(json_data)
        url = json_data['url']
        idop = json_data['idop']
        thread = Thread(target=scrapdata.scrap_one_profile, args=(url,idop))
        thread.daemon = True
        thread.start()
        return jsonify({'thread_name': str(thread.name),
                        'started': True})

# Route your service here
def routes(api):
    api.add_resource(Predictor, '/<string:fname>/<string:lname>')
    api.add_resource(BackgroundThread, '/scrap/<string:country>/<string:idop>') #get request, multiple profiles
    api.add_resource(SingleBgThread, '/scrap-single') #post request, one target
    
    
def main():
    app = Flask(__name__)
    api = Api(app)
    routes(api)
    
    app.run(debug=True, port=5555)

if __name__ == '__main__':
    main()