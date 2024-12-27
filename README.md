# Google Maps Scraper

A web application that allows users to search for local businesses on Google Maps, save their information, and manage interactions.

## Features

- Search for businesses using query string or Google Maps URL
- View and manage search history
- Track email interactions with businesses
- Bulk actions for managing business data
- User authentication and authorization

## Tech Stack

### Backend
- Django
- Django REST Framework
- PostgreSQL
- Celery
- Redis
- Docker

### Frontend
- React with TypeScript
- Vite
- TailwindCSS
- Redux Toolkit

## Project Structure

```
.
├── backend/
│   ├── accounts/          # User authentication app
│   ├── scraper/           # Main scraper application
│   ├── backend/           # Django project settings
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── store/        # Redux store
│   │   └── services/     # API services
│   └── package.json
├── docker-compose.yml
├── .env
└── README.md
```

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd google-maps-scraper
```

2. Create and configure the environment variables:
```bash
cp .env.example .env
# Edit .env with your configurations
```

3. Build and run the Docker containers:
```bash
docker-compose up --build
```

4. Create and apply database migrations:
```bash
docker-compose exec backend python manage.py migrate
```

5. Create a superuser (optional):
```bash
docker-compose exec backend python manage.py createsuperuser
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/api/docs/

## Development

### Backend Development
```bash
# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## API Documentation

The API documentation is available at `/api/docs/` when the server is running. It provides detailed information about all available endpoints, request/response formats, and authentication requirements.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 