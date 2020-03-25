from flask import Flask, jsonify
from flask_restful import Resource, Api
from pathlib import Path
import sys
from threading import Thread
from tasks import threaded_task
# Paths
BASE_DIR = Path(__file__).resolve().parent
PREDICTION_DIR = BASE_DIR / 'prediction'

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
# Route your service here
def routes(api):
    api.add_resource(Predictor, '/<string:fname>/<string:lname>')
    api.add_resource(BackgroundThread, '/scrap/<string:country>/<string:idop>')
def main():
    app = Flask(__name__)
    api = Api(app)
    routes(api)
    
    app.run(debug=True, port=5555)

if __name__ == '__main__':
    main()