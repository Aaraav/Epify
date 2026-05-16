import express from 'express';
const router = express.Router();

router.get('/about', (req, res) => {
    res.status(200).json({
        name: 'Aaraav Sehgal',
        email: 'aaraav2810@gmail.com',
        'my features': {
            'Redis Caching':
                'Caches paginated notes per user to reduce MongoDB load and improve response speed. Cache is automatically invalidated on create, update, delete and share.',
            'Email Notification':
                'Sends an email via Brevo SMTP when a note is shared with another user, keeping recipients informed in real time.',
            'Full-text Search':
                'MongoDB text index search across note title and content, results ranked by relevance score using textScore metadata.',
            'Pagination':
                'GET /notes supports page and limit query params to paginate results, preventing large data dumps on the client.',
            'Input Validation':
                'All endpoints validate required fields, empty strings, email format, password strength, and return appropriate 400/401/404/409 status codes.',
            'Rate Limiting':
                'Implemented global API rate limiting using express-rate-limit to prevent abuse, spam, and excessive requests by restricting the number of requests per IP within a fixed time window.',
            'Pinned Notes':
                'Users can pin or unpin important notes for quick access. Pinned notes are prioritized and displayed at the top of the notes list for better organization and usability.',
            'Note Reminders':
                'Users can set a time-based reminder on any note via PATCH /notes/:id/reminder. A cron job checks every minute for due reminders and sends a personalised email via Brevo SMTP. Redis locks prevent duplicate sends if the cron job overlaps.',
        },
    });
});

export default router;