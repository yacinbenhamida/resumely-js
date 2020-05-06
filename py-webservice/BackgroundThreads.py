from flask import Flask, jsonify, request, Response
from threading import Thread
from flask_restful import Resource, Api, reqparse
import sys
from pathlib import Path
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
BASE_DIR = Path(__file__).resolve().parent
SCRAP_DIR = BASE_DIR / 'customscrapping'
sys.path.append(str(SCRAP_DIR))
from customscrapping import scrapdata

class BackgroundThread(Resource):  
    @jwt_required   
    def get(self,country,idop):
        thread = Thread(target=scrapdata.scrapper, args=(country,idop))
        thread.daemon = True
        thread.start()
        return jsonify({'thread_name': str(thread.name),
                        'started': True})
class SingleBgThread(Resource):
    @jwt_required
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
