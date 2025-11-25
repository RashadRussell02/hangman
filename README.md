# Hangman Game

## Overview
This is a React-based Hangman game where players guess letters to complete a word. Each wrong guess draws a new part of the hangman until the game is over.

## Features
- Random word selection
- Tracking of guesses and mistakes
- Visual hangman images for each wrong guess
- Win/loss detection

## How to Run
1. Clone the repo:
   git clone https://github.com/RashadRussell02/hangman.git
   cd hangman

2. Use Node 18 (required):
   nvm install 18
   nvm use 18

3. Install dependencies and start the app:
   npm ci
   npm start

## Running with Docker

1. Make sure Docker is installed and running

2. Start all services (React app, API server, DynamoDB):
   docker-compose up --build

3. Access the app:
   - React UI: http://localhost:3000
   - API Server: http://localhost:4000
   - DynamoDB Admin: http://localhost:8001

4. To stop:
   docker-compose down

## Running Tests

This project uses Jest and React Testing Library.

1. Install dependencies (if not already done):
   npm ci

2. Run all tests:
   npm test

## Test Run Video

Here is the required screen recording showing my unit tests running and passing:

https://drive.google.com/file/d/169z9sDCabQtWVEDP9rxIfRTv4iH3PJyD/view?usp=share_link
