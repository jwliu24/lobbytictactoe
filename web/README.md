Real-Time Tic-Tac-Toe Game

This is a real-time, multi-player Tic-Tac-Toe application built with React, Node.js, and Socket.io. It features a game lobby system where users can create or join games, a live-updating leaderboard, and a real-time game board.

Features

User Authentication: Simple username-based sign-in.

Game Lobbies: Create new game "events" or see a list of available events to join.

3-Panel Dashboard: A clean UI showing game creation, the events list, and the leaderboard all on one screen.

Real-Time Waiting Room: A two-player lobby where players must "Ready Up" (with a blue-to-green button) to start the game.

Live Gameplay: Tic-Tac-Toe board state is synced instantly between both players using Socket.io.

Leaderboard: Automatically tracks player wins and updates in real-time. (Note: This implementation uses localStorage, so scores are local to each browser).

Tech Stack

Frontend:

React (with Vite)

React Router: For page navigation.

Socket.io-client: To connect to the real-time server.

Backend:

Node.js

Express: For the web server.

Socket.io: For handling all real-time WebSocket communication.

Styling:

Plain CSS with Flexbox and Grid.

Getting Started

This project is split into two parts: the server (backend) and the web (frontend). You must run both for the app to work.

Prerequisites

Node.js (v18 or later)

npm

1. Backend (Server) Setup

First, navigate to your server directory (e.g., backend/ or server/).

# 1. Go into the server directory
cd server/

# 2. Install dependencies
npm install

# 3. Start the server
npm start
# Your backend should now be running on http://localhost:3000


2. Frontend (Web) Setup

In a new terminal, navigate to the web directory.

# 1. Go into the web directory
cd web/

# 2. Install dependencies
npm install

# 3. Start the Vite development server
npm run dev
# Your frontend should now be running on http://localhost:5173


How to Test (Two-Player Local Game)

To test the multi-player features, you need to connect a second device (like your phone or another laptop) to your server.

1. Start the Server

Follow the backend setup steps. Your server must be running.

2. Start the Frontend with --host

This is the most important step. Run the dev command with the --host flag to expose your app to other devices on your Wi-Fi network.

# In your web/ directory:
npm run dev -- --host


3. Find Your Network URL

The terminal will output a "Network" URL. It will look something like this:
> Network: http://192.168.1.13:5173/

4. Connect Your Devices

Player 1: Open http://localhost:5173/ on your computer.

Player 2: Open the Network URL (e.g., http://192.168.1.13:5173/) on your second device.

You can now sign in as two different players, join the same game room, and play against each other!