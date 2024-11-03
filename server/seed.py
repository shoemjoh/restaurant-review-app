#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, User

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")

        # Clear existing data
        print("Clearing existing user data...")
        User.query.delete()

        # Create users
        print("Creating users...")
        user1 = User(username="alice", email="alice@example.com")
        user1.password_hash = "password123"  # bcrypt will handle hashing
        user2 = User(username="bob", email="bob@example.com")
        user2.password_hash = "password456"

        # Add users to the session and commit
        db.session.add_all([user1, user2])
        db.session.commit()

        print("User seeding complete!")