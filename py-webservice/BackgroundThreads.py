from flask import Flask, jsonify, request, Response
from threading import Thread
from flask_restful import Resource, Api, reqparse
from customscrapping import scrapdata
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
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
