# Tic-Tac-Toe Game (Node.js, React, Docker, TypeScript)

This is a simple Tic-Tac-Toe game implemented with a backend in Node.js and a frontend in React. The backend serves the game logic and handles player moves, while the frontend allows players to interact with the game. The application is Dockerized to run seamlessly in any environment.

### Features:
- **Backend**: Node.js API handling game state and moves.
- **Frontend**: React app to play Tic-Tac-Toe in the browser.
- **Computer Opponent**: The computer can make random moves.
- **Dockerized**: Both frontend and backend are containerized using Docker for easy deployment.

### Prerequisites:
Before you can run this application, make sure you have the following installed:
- Docker
- Docker Compose

### Getting Started

#### Clone the repository:
```bash
git clone https://github.com/your-username/tic-tac-toe.git
cd tic-tac-toe
``` 


### Build and start the application with Docker Compose:

#### Build the Docker containers:
```bash
docker-compose build
```

#### Start the application:

```bash
docker-compose up
```
This will build both the backend and frontend containers and start them. The backend will be available at http://localhost:4000 and the frontend at http://localhost:3000.

#### Usage
Open a browser and navigate to http://localhost:3000 to start playing Tic-Tac-Toe.

The game board will appear. The first player plays as X and the second player plays as O. You can also play against the computer, which makes random moves.

Click on any cell to make a move. The game will automatically switch players after each move.

If a player wins or the game ends in a draw, a message will appear.

To start a new game, click the "Reset" button.

### File Structure
```
tic-tac-toe/
├── backend/
│   ├── Dockerfile            # Dockerfile for the Node.js backend
│   ├── index.ts              # Backend server code
│   ├── package.json          # Backend dependencies and scripts
│   ├── tsconfig.json         # TypeScript configuration for the backend
├── frontend/
│   ├── Dockerfile            # Dockerfile for the React frontend
│   ├── public/
│   │   ├── index.html        # The HTML template for the frontend
│   ├── src/
│   │   ├── App.tsx           # Main React component
│   │   ├── index.tsx         # React entry point
│   │   ├── App.css           # CSS for the frontend
│   ├── package.json          # Frontend dependencies and scripts
│   ├── tsconfig.json         # TypeScript configuration for the frontend
├── docker-compose.yml        # Docker Compose configuration to run both services
├── README.md                 # This README file
```

### License
This project is licensed under the MIT License