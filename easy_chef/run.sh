#!/bin/bash

echo "Activating virtual environment..."
source venv/bin/activate

echo "Starting Django server..."
python manage.py runserver &

echo "Starting the frontend..."
npm run start

