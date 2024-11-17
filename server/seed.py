from config import db, app
from models import User, Restaurant, Review, City

# Seed data function
def seed_data():
    with app.app_context():
        # Clear all tables
        print("Clearing data...")
        db.session.query(Review).delete()
        db.session.query(Restaurant).delete()
        db.session.query(City).delete()  # Assuming you have a City model
        db.session.query(User).delete()
        db.session.commit()
        print("All data cleared.")

        # Create Cities
        print("Creating cities...")
        city1 = City(name="New York")
        city2 = City(name="Los Angeles")
        db.session.add_all([city1, city2])
        db.session.commit()
        print("Cities created.")

        # Create Users
        print("Creating users...")
        user1 = User(username="alice", email="alice@example.com")
        user1.password_hash = "password1"
        user2 = User(username="bob", email="bob@example.com")
        user2.password_hash = "password2"
        db.session.add_all([user1, user2])
        db.session.commit()
        print("Users created.")

        # Create Restaurants
        print("Creating restaurants...")
        restaurant1 = Restaurant(name="The Fancy Spoon", city_id=city1.id)
        restaurant2 = Restaurant(name="Burger Haven", city_id=city2.id)
        db.session.add_all([restaurant1, restaurant2])
        db.session.commit()
        print("Restaurants created.")

        # Create Reviews
        print("Creating reviews...")
        review1 = Review(content="Amazing food!", rating=5, user_id=user1.id, restaurant_id=restaurant1.id)
        review2 = Review(content="Decent place.", rating=3, user_id=user1.id, restaurant_id=restaurant2.id)
        review3 = Review(content="Loved the burgers!", rating=4, user_id=user2.id, restaurant_id=restaurant2.id)
        db.session.add_all([review1, review2, review3])
        db.session.commit()
        print("Reviews created.")

if __name__ == "__main__":
    seed_data()