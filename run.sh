#!/bin/bash
# This script starts both react frontend & express.js backend server in two subshells

( npm start ) & ( cd ./client && npm start )
