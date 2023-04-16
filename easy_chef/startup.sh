#!/bin/bash

cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m virtualenv --python=`which python3.10` venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing required Python packages..."
pip install -r requirements.txt

echo "Running/Making migrations..."
python manage.py makemigrations
python manage.py migrate

cd ../

echo "Installing required Node packages..."
npm install --legacy-peer-deps

