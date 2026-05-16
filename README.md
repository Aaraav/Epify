# Epify - Smart Notes API

A scalable RESTful Notes Management API built with **Node.js, Express.js, MongoDB, Redis, and JWT Authentication**.

Epify allows users to create, manage, search, share, and organize notes securely with support for caching, pagination, authentication, pinned notes, and rate limiting. Humans create hundreds of notes and then need systems to remember where they put them. Software politely cleans up the situation.

---

## Features

- 🔐 JWT Authentication
- 👤 User Registration & Login
- 📝 Create, Read, Update, Delete Notes
- 📌 Pin / Unpin Notes
- 🤝 Share notes with other users
- 🔎 Full-text search across notes
- ⚡ Redis caching for paginated notes
- 📄 Pagination support
- 📧 Email notifications using Brevo SMTP
- 🛡️ Input validation
- 🚦 Rate limiting with Express Rate Limit
- 📚 Swagger/OpenAPI documentation
- 🧪 API testing with edge cases

---

## Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Caching

- Redis

### Authentication

- JWT (JSON Web Token)

### Documentation

- Swagger UI
- OpenAPI Specification

### Email Service

- Brevo SMTP

---

## API Endpoints

### Authentication

| Method | Endpoint    | Description   |
| ------ | ----------- | ------------- |
| POST   | `/register` | Register user |
| POST   | `/login`    | Login user    |

---

### Notes

| Method | Endpoint           | Description                   |
| ------ | ------------------ | ----------------------------- |
| GET    | `/notes`           | Get all notes with pagination |
| POST   | `/notes`           | Create a note                 |
| GET    | `/notes/:id`       | Get note by ID                |
| PUT    | `/notes/:id`       | Update note                   |
| DELETE | `/notes/:id`       | Delete note                   |
| POST   | `/notes/:id/share` | Share note                    |
| PATCH  | `/notes/:id/pin`   | Pin / Unpin note              |

---

### Search

| Method | Endpoint            | Description  |
| ------ | ------------------- | ------------ |
| GET    | `/search?q=keyword` | Search notes |

---

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

Local:

```bash
http://localhost:3000/docs
```

Production:

```bash
https://epify-gf25.onrender.com/docs
```

---

## Live Deployment

Production API:

https://epify-gf25.onrender.com

Swagger:

https://epify-gf25.onrender.com/docs

---

## Redis Caching Strategy

Paginated notes are cached per user:

```js
notes:{userId}:page:{page}:limit:{limit}
```

Cache automatically invalidates when:

- Creating notes
- Updating notes
- Deleting notes
- Sharing notes

---

## Performance Optimizations

- Redis caching reduces repeated MongoDB queries
- Pagination prevents large response payloads
- MongoDB text indexes improve search performance
- Automatic cache invalidation ensures fresh data
- Rate limiting prevents excessive API requests

---

## Security Features

- JWT authentication
- Password hashing
- Protected routes
- Request rate limiting
- Input validation
- Error handling middleware

---

## Project Structure

```bash
Epify/
│
├── Controllers/
├── Middleware/
├── Models/
├── Routes/
├── Utils/
├── openapi.json
├── server.js
├── package.json
└── test.js
```

---

## Testing

Run tests:

```bash
node test.js
```

Current tests cover:

- Authentication
- CRUD operations
- Search
- Sharing
- Pagination
- Authorization
- Rate limiting
- OpenAPI endpoints
- Edge cases

---

## Future Improvements

- Real-time collaboration using WebSockets
- AI-powered note summarization
- Tags and categories
- Soft delete with restore
- Reminder notifications
- File attachments

---

## Developer

### Aaraav Sehgal

Backend Developer | Full Stack Developer

**Tech Stack**

- Node.js
- Express.js
- MongoDB
- Redis
- JWT
- Docker
- React
- Next.js

Email: [aaraav2810@gmail.com](mailto:aaraav2810@gmail.com)

GitHub: https://github.com/Aaraav

---

## License

MIT License
