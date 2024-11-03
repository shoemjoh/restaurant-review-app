#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, session
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User

# Views go here!
class Signup(Resource):
    def post(self):
        data = request.get_json()
        if 'username' not in data or 'password' not in data:
            return {"error": "Username and password required"}, 400
        user = User(
            username=data['username'],
            email=data.get('email',''),
        )
        user.password_hash = data['password']
        db.session.add(user)
        db.session.commit()
        session['user_id'] = user.id
        return user.to_dict(), 200


@app.route('/')
def index():
    return '<h1>Project Server</h1>'

api.add_resource(Signup, '/signup')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

