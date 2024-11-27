from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = ('-reviews.user', '-restaurants', '-hotels')  # Avoid circular references

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)

    reviews = db.relationship('Review', backref='user', lazy=True)
    restaurants = association_proxy('reviews', 'restaurant')
    hotels = association_proxy('reviews', 'hotel')

    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password is not accessible!")

    @password_hash.setter
    def password_hash(self, password):
        self._password_hash = bcrypt.generate_password_hash(password.encode('utf-8')).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    @validates('email')
    def validate_email(self, key, email):
        if '@' not in email:
            raise ValueError("Email must contain '@'")
        return email

    @validates('username')
    def validate_username(self, key, username):
        if not username.strip():
            raise ValueError("Username cannot be empty")
        return username


class City(db.Model, SerializerMixin):
    __tablename__ = 'cities'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

    restaurants = db.relationship('Restaurant', backref='city', lazy=True)
    hotels = db.relationship('Hotel', backref='city', lazy=True)

    @validates('name')
    def validate_name(self, key, name):
        if not name.strip():
            raise ValueError("City name cannot be empty")
        return name

    def __repr__(self):
        return f"<City {self.name}>"


class Restaurant(db.Model, SerializerMixin):
    __tablename__ = 'restaurants'
    serialize_rules = ('-reviews.restaurant', '-city.restaurants', '-users')  # Exclude recursive relationships

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    city_id = db.Column(db.Integer, db.ForeignKey('cities.id'), nullable=False)

    reviews = db.relationship('Review', backref='restaurant', lazy=True) 
    users = association_proxy('reviews', 'user')

    @validates('name')
    def validate_non_empty(self, key, value):
        if not value.strip():
            raise ValueError(f"Name cannot be empty")
        return value


class Hotel(db.Model, SerializerMixin):
    __tablename__ = 'hotels'
    serialize_rules = ('-reviews.hotel', '-city.hotels', '-users')  # Exclude recursive relationships

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    city_id = db.Column(db.Integer, db.ForeignKey('cities.id'), nullable=False)

    reviews = db.relationship('Review', backref='hotel', lazy=True)

    @validates('name')
    def validate_non_empty(self, key, value):
        if not value.strip():
            raise ValueError("Name cannot be empty")
        return value


class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    serialize_rules = ('-user.reviews', '-restaurant.reviews', '-hotel.reviews')  # Avoid circular serialization

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'), nullable=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey('hotels.id'), nullable=True)

    @validates('rating')
    def validate_rating(self, key, rating):
        if not (1 <= rating <= 5):
            raise ValueError("Rating must be between 1 and 5")
        return rating

    @validates('content')
    def validate_content(self, key, content):
        if not content.strip():
            raise ValueError("Content cannot be empty")
        return content

    @validates('restaurant_id', 'hotel_id')
    def validate_one_reference(self, key, value):
        """
        Ensures that a review is linked to only one entity: either a restaurant or a hotel.
        """
        if key == 'restaurant_id' and value and self.hotel_id:
            raise ValueError("A review cannot be linked to both a restaurant and a hotel.")
        if key == 'hotel_id' and value and self.restaurant_id:
            raise ValueError("A review cannot be linked to both a restaurant and a hotel.")
        return value
