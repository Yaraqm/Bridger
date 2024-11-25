
# Bridger: Accessibility Navigation and Networking App

## Introduction

**Bridger** is an innovative web application designed to empower individuals with disabilities in the Durham region of Ontario, Canada. By combining navigation, accessibility data, and a social networking platform, Bridger addresses the lack of modern, practical applications catering to disabled individuals. 

With **AODA-compliant** UI, geolocation data integration, venue accessibility ratings, and incentives through a points-based rewards system, Bridger is designed to be a comprehensive resource for disabled individuals.

## Features

- **User Authentication**: Secure user registration and login with bcrypt and JWT.
- **Venue Accessibility Ratings**: Search and review venues for accessibility.
- **Social Features**: Add friends, share locations, and send/accept friend requests.
- **Rewards System**: Earn and redeem points for specific tasks like leaving feedback or submitting locations.
- **Geolocation Integration**: Automatically fetch city and ZIP code during registration using the IP-API.
- **Admin Features**: Admins can approve submitted venues and analyze user data.
- **Dynamic UI**: Designed with high-contrast settings for visually impaired users.

## Architecture

Bridger utilizes a **3-tier architecture**:
1. **Presentation Layer**: Frontend components built with React.js.
2. **Business Logic Layer**: Backend services in Node.js and Express.js.
3. **Data Layer**: MySQL database managed via Sequelize ORM.

---

## Installation

### Prerequisites

Ensure the following are installed on your system:
- **Node.js** (v14 or above)
- **MySQL** (v8.0 or above)
- **npm** (Node Package Manager)
- **Git**

### Clone the Repository

```bash
git clone https://github.com/Yaraqm/Bridger.git
cd Bridger
```

### Setup the Backend

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Configure the `.env` file:
   - Create a `.env` file in the `server` directory and add:
     ```plaintext
     DB_NAME=your_database_name
     DB_USER=your_database_user
     DB_PASSWORD=your_database_password
     DB_HOST=localhost
     DB_PORT=3306
     JWT_SECRET=your_jwt_secret
     ```

4. Run database migrations and seeders:
   ```bash
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   ```

5. Start the backend server:
   ```bash
   npm start
   ```

### Setup the Frontend

1. Navigate to the `client` directory:
   ```bash
   cd ../client
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

4. Open the application in your browser:
   ```
   http://localhost:3000
   ```

---

## Usage

### User Features
1. Register an account:
   - City and ZIP code will be automatically added via IP-based geolocation.
2. Search for accessible venues:
   - View, review, and rate venues for their accessibility.
3. Send and accept friend requests:
   - Share starred locations with friends.

### Admin Features
- Approve/reject venue submissions.
- View and analyze user data, including location details.

---

## Folder Structure

### Client
- **Components**: Contains React components for user interface (e.g., `Login.js`, `Register.js`).
- **Pages**: Contains React pages representing different application views.

### Server
- **Config**: Database configuration.
- **Models**: Sequelize models representing database tables.
- **Routes**: API endpoints for user interactions (e.g., `userRoutes.js`).

---

## Technologies Used

### Frontend
- **React.js**: Frontend library for building dynamic user interfaces.
- **CSS**: Styling for UI components.

### Backend
- **Node.js**: Backend runtime.
- **Express.js**: Framework for REST API.
- **Sequelize**: ORM for MySQL database management.
- **bcrypt**: Secure password hashing.
- **JWT**: Authentication via JSON Web Tokens.

### Database
- **MySQL**: Relational database for storing user, venue, and rewards data.

---

## API Integration

### IP Geolocation API
Used to fetch user location data (city and ZIP code) during registration. Integrated via `http://ip-api.com/json`.

---

## Contribution Guide

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Create a pull request.

---

## Future Enhancements

1. **Mobile App**: Transition to a mobile app architecture for on-the-go navigation.
2. **Voice Features**: Add voice-to-text and text-to-speech for visually impaired users.
3. **Advanced Geolocation**: Integrate real-time GPS for better navigation.

---
