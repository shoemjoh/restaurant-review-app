from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from config import db, bcrypt

# Association table to connect User and Restaurant through Review
user_restaurant_reviews = db.Table(
    'user_restaurant_reviews',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('restaurant_id', db.Integer, db.ForeignKey('restaurants.id'), primary_key=True)
)

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    serialize_rules = ('-reviews.user', '-restaurants')  # Avoid circular references

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String, nullable=False)

    reviews = db.relationship('Review', backref='user')
    restaurants = association_proxy('reviews', 'restaurant')

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

class Restaurant(db.Model, SerializerMixin):
    __tablename__ = 'restaurants'
    serialize_rules = ('-reviews.restaurant', '-users')  # Exclude recursive relationships

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    city = db.Column(db.String, nullable=False)

    reviews = db.relationship('Review', backref='restaurant')
    users = association_proxy('reviews', 'user')

    @validates('name', 'city')
    def validate_non_empty(self, key, value):
        if not value.strip():
            raise ValueError(f"{key.capitalize()} cannot be empty")
        return value

class Review(db.Model, SerializerMixin):
    __tablename__ = 'reviews'
    serialize_rules = ('-user.reviews', '-restaurant.reviews')  # Avoid recursive serialization

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.String, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    restaurant_id = db.Column(db.Integer, db.ForeignKey('restaurants.id'))

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
