import express from 'express';
const router = express.Router();
import auth from '../Middleware/auth.js';
import validateObjectId from '../Middleware/validateObjectId.js';
import {
    createNote,
    getNotes,
    getNoteById,
    updateNote,
    deleteNote,
    shareNote,
    togglePin,
    setReminder,
    deleteReminder,
} from '../Controllers/notes.js';

router.post('/', auth, createNote);
router.get('/', auth, getNotes);
router.patch('/:id/reminder', auth, validateObjectId, setReminder);
router.delete('/:id/reminder', auth, validateObjectId, deleteReminder);
router.get('/:id', auth, validateObjectId, getNoteById);
router.put('/:id', auth, validateObjectId, updateNote);
router.delete('/:id', auth, validateObjectId, deleteNote);
router.post('/:id/share', auth, validateObjectId, shareNote);
router.patch('/:id/pin', auth, validateObjectId, togglePin);

export default router;
