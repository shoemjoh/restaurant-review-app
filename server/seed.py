from config import db, app
from models import User, Restaurant, Hotel, Experience, Review, City

def seed_data():
    with app.app_context():
        # Clear all tables
        print("Clearing data...")
        db.session.query(Review).delete()
        db.session.query(Restaurant).delete()
        db.session.query(Hotel).delete()
        db.session.query(Experience).delete()  # Clear the Experience table
        db.session.query(City).delete()
        db.session.query(User).delete()
        db.session.commit()
        print("All data cleared.")

        # Create Cities
        print("Creating cities...")
        city1 = City(name="New York")
        city2 = City(name="London")
        city3 = City(name="Paris")
        city4 = City(name="Tokyo")
        db.session.add_all([city1, city2, city3, city4])
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

        # Create Hotels
        print("Creating hotels...")
        hotel1 = Hotel(name="Grand Hotel", city_id=city3.id)
        hotel2 = Hotel(name="Luxury Inn", city_id=city1.id)
        db.session.add_all([hotel1, hotel2])
        db.session.commit()
        print("Hotels created.")

        # Create Experiences
        print("Creating experiences...")
        experience1 = Experience(name="City Walking Tour", city_id=city1.id)
        experience2 = Experience(name="Wine Tasting", city_id=city4.id)
        experience3 = Experience(name="Museum Pass", city_id=city3.id)
        db.session.add_all([experience1, experience2, experience3])
        db.session.commit()
        print("Experiences created.")

        # Create Reviews
        print("Creating reviews...")
        review1 = Review(content="Amazing food!", rating=5, user_id=user1.id, restaurant_id=restaurant1.id)
        review2 = Review(content="Okay burgers.", rating=3, user_id=user2.id, restaurant_id=restaurant2.id)
        review3 = Review(content="Fantastic hotel!", rating=5, user_id=user1.id, hotel_id=hotel1.id)
        review4 = Review(content="Decent stay.", rating=4, user_id=user2.id, hotel_id=hotel2.id)
        review5 = Review(content="Great walking tour!", rating=5, user_id=user1.id, experience_id=experience1.id)
        review6 = Review(content="Lovely wine tasting!", rating=4, user_id=user2.id, experience_id=experience2.id)
        db.session.add_all([review1, review2, review3, review4, review5, review6])
        db.session.commit()
        print("Reviews created.")

if __name__ == "__main__":
    seed_data()
