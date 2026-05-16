import Note from '../Modals/notesModal.js';
import User from '../Modals/userModal.js';
import { sendMail } from '../Utils/sendMail.js';
import { redisClient } from '../Connections.js';

const CACHE_TTL = 3600;

const invalidateUserNotesCache = async (userId) => {
    const keys = await redisClient.keys(`notes:${userId}:page:*`);
    if (keys.length > 0) await redisClient.del(keys);
};

export const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title?.trim() || !content?.trim()) {
            return res.status(400).json({ message: 'Title and content required' });
        }

        const note = await Note.create({ title, content, user: req.user.id });

        await invalidateUserNotesCache(req.user.id);

        res.status(201).json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getNotes = async (req, res) => {
    try {
        const userId = req.user.id;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const cacheKey = `notes:${userId}:page:${page}:limit:${limit}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) return res.status(200).json(JSON.parse(cached));

        const filter = {
            $or: [{ user: userId }, { sharedWith: userId }],
        };

        const totalNotes = await Note.countDocuments(filter);

        const notes = await Note.find(filter)
            .select('-user -sharedWith')
            .skip(skip)
            .limit(limit)
            .sort({
                createdAt: -1,
            });

        if (notes.length === 0) {
            return res.status(404).json({
                message: 'No notes found',
            });
        }

        const response = {
            currentPage: page,
            totalPages: Math.ceil(totalNotes / limit),
            totalNotes,
            count: notes.length,
            data: notes,
        };

        await redisClient.set(cacheKey, JSON.stringify(response), {
            EX: CACHE_TTL,
        });

        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

export const getNoteById = async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.user.id;

        const cacheKey = `note:${noteId}:user:${userId}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) return res.status(200).json(JSON.parse(cached));

        const note = await Note.findOne({
            _id: noteId,
            $or: [{ user: userId }, { sharedWith: userId }],
        }).select('-user -sharedWith');

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        await redisClient.set(cacheKey, JSON.stringify(note), { EX: CACHE_TTL });

        res.status(200).json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const updateNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.user.id;
        const { title, content } = req.body;

        if (!title?.trim() && !content?.trim()) {
            return res.status(400).json({ message: 'Title or content required' });
        }

        const note = await Note.findOneAndUpdate(
            { _id: noteId, user: userId },
            { title, content },
            { returnDocument: 'after' }
        ).select('-user -sharedWith');

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        await redisClient.del(`note:${noteId}:user:${userId}`);
        await invalidateUserNotesCache(userId);

        res.status(200).json(note);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const userId = req.user.id;

        const deletedNote = await Note.findOneAndDelete({ _id: noteId, user: userId });

        if (!deletedNote) {
            return res.status(404).json({ message: 'Note not found' });
        }

        await redisClient.del(`note:${noteId}:user:${userId}`);
        await invalidateUserNotesCache(userId);

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const shareNote = async (req, res) => {
    try {
        const noteId = req.params.id;
        const ownerId = req.user.id;
        const { share_with_email } = req.body;

        // Validate share_with_email present
        if (!share_with_email?.trim()) {
            return res.status(400).json({ message: 'share_with_email is required' });
        }

        const targetUser = await User.findOne({ email: share_with_email });

        if (!targetUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (targetUser._id.toString() === ownerId) {
            return res
                .status(400)
                .json({ message: 'You cannot share a note with yourself' });
        }

        const note = await Note.findOne({ _id: noteId, user: ownerId });

        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }

        const alreadyShared = note.sharedWith.includes(targetUser._id);
        if (alreadyShared) {
            return res
                .status(400)
                .json({ message: 'Note already shared with this user' });
        }

        note.sharedWith.push(targetUser._id);
        await note.save();

        await redisClient.del(`note:${noteId}:user:${ownerId}`);
        await invalidateUserNotesCache(ownerId);
        await invalidateUserNotesCache(targetUser._id.toString());

        await sendMail(
            targetUser.email,
            'Note Shared With You',
            `A note titled "${note.title}" has been shared with you on Epify.`
        );

        res.status(200).json({ message: 'Note shared successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const searchNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const { q } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!q?.trim()) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const searchQuery = {
            $text: { $search: q },
            $or: [{ user: userId }, { sharedWith: userId }],
        };

        const totalNotes = await Note.countDocuments(searchQuery);

        const notes = await Note.find(searchQuery, { score: { $meta: 'textScore' } })
            .select('-user -sharedWith')
            .sort({ score: { $meta: 'textScore' } })
            .skip(skip)
            .limit(limit);

        if (notes.length === 0) {
            return res.status(404).json({ message: 'No notes found' });
        }

        res.status(200).json({
            query: q,
            currentPage: page,
            totalPages: Math.ceil(totalNotes / limit),
            totalNotes,
            count: notes.length,
            data: notes,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
