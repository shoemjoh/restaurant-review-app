#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User, Restaurant, Review

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Clear existing data
        print("Clearing existing data...")
        User.query.delete()
        Restaurant.query.delete()
        Review.query.delete()

        # Create users
        print("Creating users...")
        user1 = User(username="alice", email="alice@example.com")
        user1.password_hash = "password123"
        user2 = User(username="bob", email="bob@example.com")
        user2.password_hash = "password456"

        # Add users to the session
        db.session.add_all([user1, user2])
        db.session.commit()

        # Create restaurants
        print("Creating restaurants...")
        restaurants = [
            Restaurant(name="Chez Pierre", city="Paris"),
            Restaurant(name="Sushi World", city="Tokyo"),
            Restaurant(name="Pizza Palace", city="New York"),
            Restaurant(name="Curry House", city="Delhi"),
            Restaurant(name="Pasta Place", city="Rome")
        ]

        # Add restaurants to the session
        db.session.add_all(restaurants)
        db.session.commit()

        # Create reviews
        print("Creating reviews...")
        reviews = []
        for _ in range(10):  # Creating 10 random reviews
            review = Review(
                content=fake.paragraph(),
                rating=randint(1, 5),  # Random rating between 1 and 5
                user_id=rc([user1.id, user2.id]),  # Randomly assign user
                restaurant_id=rc([restaurant.id for restaurant in restaurants])  # Randomly assign restaurant
            )
            reviews.append(review)

        # Add reviews to the session
        db.session.add_all(reviews)
        db.session.commit()

        print("Seeding complete!")