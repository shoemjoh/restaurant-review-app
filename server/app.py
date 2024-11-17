#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, jsonify, session, make_response
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import User, Review, Restaurant, City

# Signup and Login
class Signup(Resource):
    def post(self):
        data = request.get_json()
        if 'username' not in data or 'password' not in data:
            return {"error": "Username and password required"}, 400
        user = User(
            username=data['username'],
            email=data.get('email', '')
        )
        user.password_hash = data['password']
        print("Password hash:", user._password_hash)
        db.session.add(user)
        db.session.commit()
        session['user_id'] = user.id
        return user.to_dict(), 200

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter(User.username == data['username']).first()

        if not user:
            print("User not found")
            return {"error": "Invalid username or password."}, 401

        if not user.check_password(data['password']):
            print("Password check failed")
            return {"error": "Invalid username or password."}, 401

        session['user_id'] = user.id
        print("Login successful")
        return user.to_dict(), 200

## Review creation

class ReviewCreate(Resource):
    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "User not logged in"}, 401
        
        data = request.get_json()
        name = data['name']
        city_name = data['city']

        # check if city exists or create it
        city = City.query.filter_by(name=city_name).first()
        if not city:
            city = City(name=city_name)
            db.session.add()
            db.session.commit()
        
        # check if restaurant exists in the city or create it
        restaurant = Restaurant.query.filter_by(name=name, city_id=city.id).first()
        if not restaurant:
            restaurant = Restaurant(
                name=name,
                city_id=city.id
            )
            db.session.add(restaurant)
            db.session.commit()

        review = Review(
            content=data['content'],
            rating=data['rating'],
            user_id=user_id,
            restaurant_id=restaurant.id
        )
        db.session.add(review)
        db.session.commit()
        return review.to_dict(), 201


# Hitting the list of reviews and cities

class ReviewList(Resource):
    def get(self):
        city = request.args.get('city')
        if city:
            reviews = Review.query.join(Restaurant).filter(Restaurant.city == city).all()
        else:
            reviews = Review.query.all()
        return jsonify([review.to_dict() for review in reviews])


class RestaurantList(Resource):
    def get(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "Not authorized"}, 401

        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        # Get all restaurants the user has reviewed
        user_restaurants = user.restaurants

        # Serialize using the built-in SerializerMixin
        return jsonify([restaurant.to_dict() for restaurant in user_restaurants])
    
class CityList(Resource):
    def get(self):
        # Return all cities as JSON
        cities = City.query.all()
        return jsonify([city.to_dict() for city in cities])
    
class UserCityList(Resource):
    def get(self):
        # Check if the user is logged in
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "User not logged in"}, 401

        # Fetch all cities where the user has reviewed a restaurant
        user_reviews = Review.query.filter_by(user_id=user_id).all()
        city_ids = {review.restaurant.city_id for review in user_reviews}
        cities = City.query.filter(City.id.in_(city_ids)).all()
        return jsonify([city.to_dict() for city in cities])

class ReviewUpdateDelete(Resource):
    def patch(self, review_id):
        review = Review.query.get_or_404(review_id)
        data = request.get_json()
        if 'content' in data:
            review.content = data['content']
        if 'rating' in data:
            review.rating = data['rating']
        db.session.commit()
        return review.to_dict()

    def delete(self, review_id):
        review = Review.query.get_or_404(review_id)
        db.session.delete(review)
        db.session.commit()
        return '', 204


    
class Logout(Resource):
    def post(self):
        session.clear()  # Clear all session data
        return {"message": "Logged out successfully"}, 200

@app.route('/')
def index():
    return '<h1>Project Server</h1>'
   

@app.route('/me')
def me():
    user_id = session.get("user_id")
    if user_id:
        user = User.query.get(user_id)
        return jsonify(user.to_dict())
    return jsonify({"error": "Not logged in"}), 401

# Get a specific user's reviews that are above a certain rating:
# @app.route('/search', methods=['GET'])
# def search():
#     data = request.get_json()
#     rating = data.get('rating')
#     user_id = data.get('id')
#     reviews = Review.query.join(User).filter(Review.rating >= rating).all()
#     print(reviews)
#     review_list = []
#     for review in reviews:
#         if review.id == user_id:
#             print(review)
#             review_list.append(review.to_dict())

#     return make_response(review_list, 200)

api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(ReviewCreate, '/reviews')
api.add_resource(CityList, '/cities')
api.add_resource(UserCityList, '/user/cities')
api.add_resource(ReviewList, '/reviews/list')
api.add_resource(ReviewUpdateDelete, '/reviews/<int:review_id>')
api.add_resource(RestaurantList, '/restaurants')
api.add_resource(Logout, '/logout')

if __name__ == '__main__':
    app.run(port=5555, debug=True)



