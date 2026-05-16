import express from 'express';
const router = express.Router();
import auth from '../Middleware/auth.js';
import { searchNotes } from '../Controllers/notes.js';

router.get('/search', auth, searchNotes);

export default router;
