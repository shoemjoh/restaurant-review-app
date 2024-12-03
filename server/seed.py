from config import db, app
from models import User, Restaurant, Hotel, Experience, Review, City, liked_reviews

def seed_data():
    with app.app_context():
        # Clear all tables
        print("Clearing data...")
        db.session.execute(liked_reviews.delete())  # Clear liked reviews since it's dependent on reviews
        db.session.query(Review).delete()
        db.session.query(Restaurant).delete()
        db.session.query(Hotel).delete()
        db.session.query(Experience).delete()
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
        restaurant1 = Restaurant(
            name="The Fancy Spoon",
            city_id=city1.id,
            address="123 Main St, New York, NY",
            latitude=40.7128,
            longitude=-74.0060
        )
        restaurant2 = Restaurant(
            name="Burger Haven",
            city_id=city2.id,
            address="456 High St, London, UK",
            latitude=51.5074,
            longitude=-0.1278
        )
        db.session.add_all([restaurant1, restaurant2])
        db.session.commit()
        print("Restaurants created.")

        # Create Hotels
        print("Creating hotels...")
        hotel1 = Hotel(
            name="Grand Hotel",
            city_id=city3.id,
            address="789 Champs-Élysées, Paris",
            latitude=48.8566,
            longitude=2.3522
        )
        hotel2 = Hotel(
            name="Luxury Inn",
            city_id=city1.id,
            address="456 Park Ave, New York, NY",
            latitude=40.7306,
            longitude=-73.9352
        )
        db.session.add_all([hotel1, hotel2])
        db.session.commit()
        print("Hotels created.")

        # Create Experiences
        print("Creating experiences...")
        experience1 = Experience(
            name="City Walking Tour",
            city_id=city1.id,
            address="789 Broadway, New York, NY",
            latitude=40.7306,
            longitude=-73.9352
        )
        experience2 = Experience(
            name="Wine Tasting",
            city_id=city4.id,
            address="123 Sake St, Tokyo, Japan",
            latitude=35.6895,
            longitude=139.6917
        )
        experience3 = Experience(
            name="Museum Pass",
            city_id=city3.id,
            address="101 Art Blvd, Paris, France",
            latitude=48.8606,
            longitude=2.3376
        )
        db.session.add_all([experience1, experience2, experience3])
        db.session.commit()
        print("Experiences created.")

        # Updated Reviews Section
        print("Creating reviews...")
        review1 = Review(content="Amazing food!", must_do=True, user_id=user1.id, restaurant_id=restaurant1.id)
        review2 = Review(content="Okay burgers.", must_do=False, user_id=user2.id, restaurant_id=restaurant2.id)
        review3 = Review(content="Fantastic hotel!", must_do=True, user_id=user1.id, hotel_id=hotel1.id)
        review4 = Review(content="Decent stay.", must_do=False, user_id=user2.id, hotel_id=hotel2.id)
        review5 = Review(content="Great walking tour!", must_do=True, user_id=user1.id, experience_id=experience1.id)
        review6 = Review(content="Lovely wine tasting!", must_do=False, user_id=user2.id, experience_id=experience2.id)
        db.session.add_all([review1, review2, review3, review4, review5, review6])
        db.session.commit()
        print("Reviews created.")

        # Create Liked Reviews
        print("Creating liked reviews...")
        user1.liked_reviews.append(review2)  # Alice likes Bob's burger review
        user1.liked_reviews.append(review4)  # Alice likes Bob's hotel review
        user2.liked_reviews.append(review1)  # Bob likes Alice's food review
        db.session.commit()
        print("Liked reviews created.")

if __name__ == "__main__":
    seed_data()
