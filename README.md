# Epify - Smart Notes API

A scalable RESTful Notes Management API built with **Node.js, Express.js, MongoDB, Redis, and JWT Authentication**.

Epify allows users to create, manage, search, share, and organize notes securely with support for caching, pagination, authentication, pinned notes, time-based reminders, and rate limiting. Humans create hundreds of notes and then need systems to remember where they put them. Software politely cleans up the situation.

---

## Features

- 🔐 JWT Authentication
- 👤 User Registration & Login
- 📝 Create, Read, Update, Delete Notes
- 📌 Pin / Unpin Notes
- ⏰ Time-based Note Reminders with Email Notification
- 🤝 Share notes with other users
- 🔎 Full-text search across notes
- ⚡ Redis caching for paginated notes
- 📄 Pagination support
- 📧 Email notifications using Brevo SMTP
- 🛡️ Input validation & error handling
- 🚦 Rate limiting with Express Rate Limit
- 📚 Swagger/OpenAPI documentation
- 🧪 Automated E2E Regression Test Suite
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

| Method | Endpoint                  | Description                   |
| ------ | ------------------------- | ----------------------------- |
| GET    | `/notes`                  | Get all notes with pagination |
| POST   | `/notes`                  | Create a note                 |
| GET    | `/notes/:id`              | Get note by ID                |
| PUT    | `/notes/:id`              | Update note                   |
| DELETE | `/notes/:id`              | Delete note                   |
| POST   | `/notes/:id/share`        | Share note with another user  |
| PATCH  | `/notes/:id/pin`          | Pin / Unpin note              |
| PATCH  | `/notes/:id/reminder`     | Set a reminder on a note      |
| DELETE | `/notes/:id/reminder`     | Delete reminder from a note   |

---

### Search

| Method | Endpoint            | Description               |
| ------ | ------------------- | ------------------------- |
| GET    | `/search?q=keyword` | Full-text search in notes |

---

### Other

| Method | Endpoint        | Description           |
| ------ | --------------- | --------------------- |
| GET    | `/health`       | Server health check   |
| GET    | `/about`        | Project & features    |
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

Create `.env`:

```env
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
REDIS_URL=your_redis_url
BREVO_HOST=smtp-relay.brevo.com
BREVO_PORT=2525
BREVO_USER=your_brevo_email
BREVO_PASS=your_brevo_smtp_key
SENDER_EMAIL=your_sender_email
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

## Test
```
node test.js
```



## API Documentation

Swagger documentation:

Local:
```
http://localhost:3000/docs
```

Production:
```
https://epify-gf25.onrender.com/docs
```

---

## Live Deployment

Production API: https://epify-gf25.onrender.com

Swagger: https://epify-gf25.onrender.com/docs

---

## Note Reminders

Users can set a time-based reminder on any note:

```
PATCH /notes/:id/reminder
{ "remind_at": "2026-06-01T10:00:00Z" }
```

- Reminder stored as ISO 8601 UTC datetime on the note
- A cron job runs every minute checking for due reminders
- When due, an email is sent via Brevo SMTP to the note owner
- Redis lock prevents duplicate emails if the cron job overlaps
- Reminder is cleared after the email is sent

```
DELETE /notes/:id/reminder  →  cancel a reminder
```

---

## Redis Caching Strategy

Paginated notes are cached per user:

```
notes:{userId}:page:{page}:limit:{limit}
```

Cache automatically invalidates when:
- Creating notes
- Updating notes
- Deleting notes
- Sharing notes
- Setting or deleting reminders

---

## Performance Optimizations

- Redis caching reduces repeated MongoDB queries
- Pagination prevents large response payloads
- MongoDB text indexes improve search performance
- Automatic cache invalidation ensures fresh data
- Rate limiting prevents excessive API requests

---

## Security Features

- JWT authentication with 7-day expiry
- Bcrypt password hashing
- Protected routes via auth middleware
- Request rate limiting (100 req / 15 min globally, 20 req / 15 min on auth routes)
- Input validation on all endpoints
- trust proxy enabled for accurate IP detection on Render
- Global error handling middleware

---

## Project Structure

```
Epify/
│
├── Controllers/
│   └── notes.js
│   └── auth.js
├── Middleware/
│   └── auth.js
│   └── validateObjectId.js
├── Modals/
│   └── notesModal.js
│   └── userModal.js
├── Routes/
│   └── noteRoutes.js
│   └── userRoutes.js
│   └── searchRoutes.js
│   └── aboutRoute.js
├── Utils/
│   └── sendMail.js
│   └── reminder.js
├── openapi.json
├── Connections.js
├── server.js
├── package.json
|-- test.js
```

---

## Future Improvements

- Real-time collaboration using WebSockets
- AI-powered note summarization
- Tags and categories
- Soft delete with restore
- File attachments
- Mobile app frontend

---

## Developer

### Aaraav Sehgal

Backend Developer | Full Stack Developer

Email: [aaraav2810@gmail.com](mailto:aaraav2810@gmail.com)
phone no: 8920390010

GitHub: https://github.com/Aaraav

---

## License

MIT License
