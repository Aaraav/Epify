import express from 'express';
const router = express.Router();
import auth from '../Middleware/auth.js';
import {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
    shareNote,
} from '../Controllers/notes.js';

router.post('/', auth, createNote);
router.get('/', auth, getNotes);
router.get('/:id', auth, getNoteById);
router.put('/:id', auth, updateNote);
router.delete('/:id', auth, deleteNote);
router.post('/:id/share', auth, shareNote);

export default router;
