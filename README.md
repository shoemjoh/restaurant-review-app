# Restaurant Review App

Welcome to the **Travel Review App**, a dynamic web application for users to share reviews of their favorite restaurants, hotels, and experiences. Users can also view city-specific reviews, manage their own reviews, and interact with reviews by liking them.

This project demonstrates the implementation of a full-stack web application, complete with CRUD functionality, RESTful API design, and user authentication.

---

## Features

- **User Authentication**: Sign up, log in, and manage sessions securely.
- **Review Management**: Users can create, update, and delete reviews for restaurants, hotels, and experiences.
- **City-Specific Reviews**: View reviews grouped by city, separated into restaurants, hotels, and experiences.
- **Map Integration**: Leverages the Google Maps API to display locations of reviewed places.
- **Many-to-Many Relationship**: Users can "like" reviews, demonstrating advanced relational database concepts.
- **Thematic UI**: Toggle between light and dark themes for a customizable user experience.

---

## Technologies Used

### Backend
- **Flask** (Python): Backend framework for API creation.
- **SQLAlchemy**: ORM for database interactions.
- **SQLite**: Database for development and testing.
- **Flask-RESTful**: Simplified API creation.

### Frontend
- **React**: JavaScript library for building user interfaces.
- **Google Maps API**: For interactive map integration.
- **Formik & Yup**: For form management and validation.
- **CSS**: Custom styles for a professional look.

---

## Installation and Setup

### Prerequisites
Ensure you have the following installed on your system:
- Python 3.8+
- Node.js and npm
- Git

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/shoemjoh/travel-review-app.git
   cd travel-review-app/server

2. Set up a virtual environment:
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate
pip install -r requirements.txt

3. Set up the database
flask db upgrade
python seed.py

4. Run the server
flask run

### Frontend Setup
1. Navigate to client folder
cd ../client
2. Install dependencies
npm install
3. Start the development server
npm start

## Contributing
Contributions are welcome! 
1. Fork the repository.
2. Create a new branch for your feature/bug fix.
3. Commit your changes and submit a pull request.
