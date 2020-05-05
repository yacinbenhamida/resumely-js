from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
from flask_restful import Resource
from flask import Flask, jsonify, request, Response
import json , bcrypt,pymongo
def connect_to_db():
    client = pymongo.MongoClient("mongodb+srv://ybh:ybh@resumely-g5wzc.mongodb.net/resumely?retryWrites=true&w=majority")
    database = client["resumelydb"]
    return database['users']
# to enforce JWT on your routes just add @jwt_required before the get/post function name
# and pass that generated token as a request header for your future restful requests
class Login(Resource) : 
    user = None
    def post(self):
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400
        email = request.json.get('email', None)
        password = request.json.get('password', None)
        if not email:
            return Response(json.dumps({"msg" : "missing email"}),  mimetype='application/json',status=400)
        if not password:
            return Response(json.dumps({"msg" : "missing password"}),  mimetype='application/json',status=400)
        #finding the correct username / pw 
        hashed_input_password = bcrypt.hashpw(password.encode('UTF-8'),bcrypt.gensalt(rounds=12))
        for u in connect_to_db().find({"email" : email},{"_id":1,"email":1,"password":1}):
            user = u
        if user and bcrypt.checkpw(password.encode('utf-8'),hashed_input_password):
            access_token = create_access_token(identity=email)
            return Response(json.dumps({"access_token" : access_token}),  mimetype='application/json')
        else :
            return Response(json.dumps({"msg" : "Bad email or password"}),  mimetype='application/json',status=404)
#useful to check the current user connected to our flask app
class Protected(Resource):
    @jwt_required
    def get(self):
        current_user = get_jwt_identity()
        return Response(json.dumps({"user" : current_user}),  mimetype='application/json')