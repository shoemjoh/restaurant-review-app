#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, jsonify, session
from flask_restful import Resource

# Local imports
from config import app, db, api
from models import User, Review, Restaurant, City, Hotel

# Signup and Login
class Signup(Resource):
    def post(self):
        data = request.get_json()
        if 'username' not in data or 'password' not in data:
            return {"error": "Username and password required"}, 400

        try:
            user = User(
                username=data['username'],
                email=data.get('email', '')
            )
            user.password_hash = data['password']
            db.session.add(user)
            db.session.commit()
            session['user_id'] = user.id
            return user.to_dict(), 200
        except Exception as e:
            print(f"Error during signup: {e}")
            db.session.rollback()
            return {"error": "Internal server error"}, 500


class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()

        if not user or not user.check_password(data['password']):
            return {"error": "Invalid username or password."}, 401

        session['user_id'] = user.id
        return user.to_dict(), 200


class Logout(Resource):
    def post(self):
        session.clear()
        return {"message": "Logged out successfully"}, 200


class ReviewCreate(Resource):
    def post(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "User not logged in"}, 401

        data = request.get_json()
        review_type = data.get('type')  # type indicates "restaurant" or "hotel"
        name = data.get('name')
        city_name = data.get('city')
        content = data.get('content')
        rating = data.get('rating')

        # Validate input
        if not (review_type and name and city_name and content and rating):
            return {"error": "Missing required fields (type, name, city, content, rating)"}, 400

        if review_type not in ['restaurant', 'hotel']:
            return {"error": "Invalid review type"}, 400

        try:
            # Ensure the city exists
            city = City.query.filter_by(name=city_name).first()
            if not city:
                city = City(name=city_name)
                db.session.add(city)
                db.session.commit()

            # Handle restaurant reviews
            if review_type == "restaurant":
                # Ensure the restaurant exists and references the correct city
                restaurant = Restaurant.query.filter_by(name=name, city_id=city.id).first()
                if not restaurant:
                    restaurant = Restaurant(name=name, city_id=city.id)
                    db.session.add(restaurant)
                    db.session.commit()

                review = Review(
                    content=content,
                    rating=rating,
                    user_id=user_id,
                    restaurant_id=restaurant.id
                )

            # Handle hotel reviews
            elif review_type == "hotel":
                # Ensure the hotel exists and references the correct city
                hotel = Hotel.query.filter_by(name=name, city_id=city.id).first()
                if not hotel:
                    hotel = Hotel(name=name, city_id=city.id)
                    db.session.add(hotel)
                    db.session.commit()

                review = Review(
                    content=content,
                    rating=rating,
                    user_id=user_id,
                    hotel_id=hotel.id
                )

            db.session.add(review)
            db.session.commit()
            return review.to_dict(), 201

        except Exception as e:
            print(f"Error creating review: {e}")
            db.session.rollback()
            return {"error": "Internal server error"}, 500



class ReviewList(Resource):
    def get(self):
        city = request.args.get('city')
        try:
            if city:
                reviews = Review.query.join(Restaurant).filter(Restaurant.city == city).all()
            else:
                reviews = Review.query.all()
            return jsonify([review.to_dict() for review in reviews])
        except Exception as e:
            print(f"Error fetching reviews: {e}")
            return {"error": "Failed to fetch reviews"}, 500


class RestaurantList(Resource):
    def get(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "User not logged in"}, 401

        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404
        
        # Get all restaurants the user has reviewed
        user_restaurants = Restaurant.query.join(Review).filter(Review.user_id == user_id).all()
        return jsonify([restaurant.to_dict() for restaurant in user_restaurants])

class HotelList(Resource):
    def get(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "User not logged in"}, 401

        user = User.query.get(user_id)
        if not user:
            return {"error": "User not found"}, 404

        # Get all hotels the user has reviewed
        user_hotels = Hotel.query.join(Review).filter(Review.user_id == user_id).all()
        return jsonify([hotel.to_dict() for hotel in user_hotels])

class CityList(Resource):
    def get(self):
        try:
            cities = City.query.all()
            return jsonify([city.to_dict() for city in cities])
        except Exception as e:
            print(f"Error fetching cities: {e}")
            return {"error": "Failed to fetch cities"}, 500


class UserCityList(Resource):
    def get(self):
        user_id = session.get("user_id")
        if not user_id:
            return {"error": "User not logged in"}, 401

        try:
            user_reviews = Review.query.filter_by(user_id=user_id).all()
            city_ids = {review.restaurant.city_id for review in user_reviews if review.restaurant}
            cities = City.query.filter(City.id.in_(city_ids)).all()
            return jsonify([city.to_dict() for city in cities])
        except Exception as e:
            print(f"Error fetching user cities: {e}")
            return {"error": "Failed to fetch user cities"}, 500


class ReviewUpdateDelete(Resource):
    def patch(self, review_id):
        try:
            review = Review.query.get_or_404(review_id)
            data = request.get_json()
            if 'content' in data:
                review.content = data['content']
            if 'rating' in data:
                review.rating = data['rating']
            db.session.commit()
            return review.to_dict(), 200
        except Exception as e:
            print(f"Error updating review: {e}")
            db.session.rollback()
            return {"error": "Failed to update review"}, 500

    def delete(self, review_id):
        try:
            review = Review.query.get_or_404(review_id)
            db.session.delete(review)
            db.session.commit()
            return '', 204
        except Exception as e:
            print(f"Error deleting review: {e}")
            db.session.rollback()
            return {"error": "Failed to delete review"}, 500


@app.route('/')
def index():
    return '<h1>Project Server</h1>'


@app.route('/me')
def me():
    user_id = session.get("user_id")
    if user_id:
        user = User.query.get(user_id)
        return jsonify(user.to_dict())
    return {"error": "Not logged in"}, 401


# Add resources to the API
api.add_resource(Signup, '/signup')
api.add_resource(Login, '/login')
api.add_resource(Logout, '/logout')
api.add_resource(ReviewCreate, '/reviews')
api.add_resource(ReviewList, '/reviews/list')
api.add_resource(ReviewUpdateDelete, '/reviews/<int:review_id>')
api.add_resource(RestaurantList, '/restaurants')
api.add_resource(CityList, '/cities')
api.add_resource(UserCityList, '/user/cities')
api.add_resource(HotelList, '/hotels')



if __name__ == '__main__':
    app.run(port=5555, debug=True)