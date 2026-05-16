import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        content: {
            type: String,
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        sharedWith: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        isPinned: {
            type: Boolean,
            default: false,
        },
         remind_at: {
            type: Date,
            default: null,
        },
        reminded: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);
noteSchema.index({ title: 'text', content: 'text' });

const Note = mongoose.model('Note', noteSchema);

export default Note;
