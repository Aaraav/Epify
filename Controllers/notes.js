import Note from '../Modals/notesModal.js';
import User from '../Modals/userModal.js';
import { sendMail } from '../Utils/sendMail.js';
export const createNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: 'Title and content required',
            });
        }

        const note = await Note.create({
            title,
            content,

            user: req.user.id,
        });

        res.status(201).json({
            message: 'Note created',
            note,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

export const getNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalNotes = await Note.countDocuments({
            $or: [{ user: userId }, { sharedWith: userId }],
        });

        const notes = await Note.find({
            $or: [{ user: userId }, { sharedWith: userId }],
        })
            .select('-user -sharedWith')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        if (notes.length === 0) {
            return res.status(404).json({
                message: 'No notes found',
            });
        }

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalNotes / limit),
            totalNotes,
            count: notes.length,
            data: notes,
        });
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

        const note = await Note.findOne({
            _id: noteId,

            $or: [{ user: userId }, { sharedWith: userId }],
        }).select('-user -sharedWith');

        if (!note) {
            return res.status(404).json({
                message: 'Note not found',
            });
        }

        res.status(200).json({
            data: note,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

export const updateNote = async (req, res) => {
    try {
        const noteId = req.params.id;

        const userId = req.user.id;

        const { title, content } = req.body;

        const note = await Note.findOneAndUpdate(
            {
                _id: noteId,
                user: userId,
            },

            {
                title,
                content,
            },

            {
                new: true,
            }
        ).select('-user');

        if (!note) {
            return res.status(404).json({
                message: 'Note not found',
            });
        }

        res.status(200).json({
            message: 'Note updated successfully',
            data: note,
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const noteId = req.params.id;

        const userId = req.user.id;

        const deletedNote = await Note.findOneAndDelete({
            _id: noteId,
            user: userId,
        });

        if (!deletedNote) {
            return res.status(404).json({
                message: 'Note not found',
            });
        }

        res.status(204).send();
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

export const shareNote = async (req, res) => {
    try {
        const noteId = req.params.id;

        const ownerId = req.user.id;

        const { share_with_email } = req.body;

        const targetUser = await User.findOne({
            email: share_with_email,
        });

        if (targetUser._id.toString() === ownerId) {
            return res.status(400).json({
                message: 'You already own this note',
            });
        }

        if (!targetUser) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const note = await Note.findOne({
            _id: noteId,
            user: ownerId,
        });

        if (!note) {
            return res.status(404).json({
                message: 'Note not found',
            });
        }

        const alreadyShared = note.sharedWith.includes(targetUser._id);

        if (alreadyShared) {
            return res.status(400).json({
                message: 'Note already shared',
            });
        }

        note.sharedWith.push(targetUser._id);

        await note.save();

        await sendMail(
            targetUser.email,
            'Note Shared With You',
            `A note titled "${note.title}" has been shared with you on Epify.`
        );

        res.status(200).json({
            message: 'Note shared successfully',
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};
