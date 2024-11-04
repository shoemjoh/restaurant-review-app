from config import db, app
from models import User, Restaurant, Review

# Clear all tables
with app.app_context():
    db.session.query(Review).delete()
    db.session.query(Restaurant).delete()
    db.session.query(User).delete()
    db.session.commit()

    # Create Users
    user1 = User(username="alice", email="alice@example.com")
    user1.password_hash = "password1"
    user2 = User(username="bob", email="bob@example.com")
    user2.password_hash = "password2"

    db.session.add_all([user1, user2])
    db.session.commit()

    # Create Restaurants
    restaurant1 = Restaurant(name="The Fancy Spoon", city="New York")
    restaurant2 = Restaurant(name="Burger Haven", city="Los Angeles")

    db.session.add_all([restaurant1, restaurant2])
    db.session.commit()

    # Create Reviews that link users and restaurants
    review1 = Review(content="Amazing food!", rating=5, user_id=user1.id, restaurant_id=restaurant1.id)
    review2 = Review(content="Decent place.", rating=3, user_id=user1.id, restaurant_id=restaurant2.id)
    review3 = Review(content="Loved the burgers!", rating=4, user_id=user2.id, restaurant_id=restaurant2.id)

    db.session.add_all([review1, review2, review3])
    db.session.commit()