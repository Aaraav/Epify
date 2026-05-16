# Epify - Smart Notes API

A scalable RESTful Notes Management API built with **Node.js, Express.js, MongoDB, Redis, and JWT Authentication**.

Epify allows users to create, manage, search, and share notes securely with support for caching, pagination, authentication, and rate limiting.

---

## Features

* 🔐 JWT Authentication
* 👤 User Registration & Login
* 📝 Create, Read, Update, Delete Notes
* 🤝 Share notes with other users
* 🔎 Full-text search across notes
* ⚡ Redis caching for paginated notes
* 📄 Pagination support
* 📧 Email notifications using Brevo SMTP
* 🛡️ Input validation
* 🚦 Rate limiting with Express Rate Limit
* 📚 Swagger/OpenAPI documentation

---

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Caching

* Redis

### Authentication

* JWT (JSON Web Token)

### Documentation

* Swagger UI
* OpenAPI Specification

### Email Service

* Brevo SMTP

---

## API Endpoints

### Authentication

| Method | Endpoint    | Description   |
| ------ | ----------- | ------------- |
| POST   | `/register` | Register user |
| POST   | `/login`    | Login user    |

### Notes

| Method | Endpoint           | Description                   |
| ------ | ------------------ | ----------------------------- |
| GET    | `/notes`           | Get all notes with pagination |
| POST   | `/notes`           | Create a note                 |
| GET    | `/notes/:id`       | Get note by ID                |
| PUT    | `/notes/:id`       | Update note                   |
| DELETE | `/notes/:id`       | Delete note                   |
| POST   | `/notes/:id/share` | Share note                    |

### Search

| Method | Endpoint            | Description  |
| ------ | ------------------- | ------------ |
| GET    | `/search?q=keyword` | Search notes |

### Other

| Method | Endpoint        | Description           |
| ------ | --------------- | --------------------- |
| GET    | `/health`       | Server health         |
| GET    | `/about`        | Project features      |
| GET    | `/openapi.json` | OpenAPI specification |
| GET    | `/docs`         | Swagger documentation |

---

## Installation

Clone repository:

```bash
git clone https://github.com/Aaraav/epify.git
```

Move into project:

```bash
cd epify
```

Install dependencies:

```bash
npm install
```

Create `.env`

```env
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
REDIS_URL=your_redis_url
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
```

Run development server:

```bash
npx nodemon
```

Run production:

```bash
npm start
```

---

## API Documentation

Swagger documentation:

```bash
http://localhost:3000/docs
```

Production:

```bash
https://epify-gf25.onrender.com/docs
```

---

## Redis Caching Strategy

Paginated notes are cached per user:

```js
notes:{userId}:page:{page}:limit:{limit}
```

Cache automatically invalidates when:

* Creating notes
* Updating notes
* Deleting notes
* Sharing notes

---

## Security Features

* JWT authentication
* Password hashing
* Request rate limiting
* Input validation
* Protected routes
* Error handling middleware

---

## Developer

**Aaraav Sehgal**

Email: [aaraav2810@gmail.com](mailto:aaraav2810@gmail.com)

---

## License

MIT License
