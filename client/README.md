Restaurant Review App

Restaurant Review App is a full-stack web application that allows users to sign up, log in, submit reviews for restaurants, and view a list of restaurants. Built with React for the frontend, Flask for the backend, and using SQLite as the database, this app demonstrates CRUD operations, user authentication, and data relationships.

Features
User Signup & Login: Users can sign up and log in to access their accounts.
Review Submission: Logged-in users can submit reviews for restaurants.
Restaurant List: Users can view a list of available restaurants.
User Authentication: User sessions are maintained, and access to certain routes is restricted to logged-in users.
Form Validation: Uses Formik and Yup for form handling and validation.

Project Structure
Backend (Flask)
The backend includes models for Users, Restaurants, and Reviews. The main API endpoints support user authentication, restaurant listing, and review submissions.

Models:
User: Stores user information.
Restaurant: Represents restaurants that users can review.
Review: Acts as an association between Users and Restaurants, storing review data.

API Resources:
Login: Authenticates users and creates a session.
Signup: Registers new users.
Logout: Ends the user session.
Review: Allows users to submit reviews for specific restaurants.
Restaurant: Provides a list of available restaurants.

Frontend (React)
The frontend is built with React, using React Router for navigation and Formik with Yup for form management and validation. The app includes components for login, signup, review submission, and restaurant listing.

Key Components:

LoginForm: Form for logging in, with validation handled by Formik and Yup.
SignupForm: Form for signing up new users.
ReviewForm: Allows logged-in users to submit reviews.
RestaurantList: Displays a list of restaurants.
Navigation: Uses React Router v6 for navigation, including conditional redirects based on user authentication status.

Installation
git clone https://github.com/your-username/restaurant-review-app.git
cd restaurant-review-app

pip install -r requirements.txt
flask db upgrade
flask seed # Assuming a seeding script is available
flask run

npm install
npm start


Usage
Sign Up: Register as a new user on the /signup page.
Log In: Log in with your credentials on the /login page.
View Restaurants: Navigate to /restaurants to view a list of restaurants.
Submit a Review: After logging in, go to /submit-review to add a review for a restaurant.

Dependencies
Backend
Flask: For building the backend server.
SQLite: For data storage.
Flask-Migrate: For database migrations.

Frontend
React: For building the user interface.
React Router: For navigation and routing.
Formik & Yup: For form handling and validation.
