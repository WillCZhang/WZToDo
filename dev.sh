#!/bin/bash
# This script starts both react frontend & express.js backend server in two subshells

# Install dependencies...
npm install && cd ./client && npm install && cd ..

# Starting both processes in subshells
( nodemon start ) & ( cd ./client && npm start )