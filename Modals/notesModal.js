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

noteSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        ret.created_at = ret.createdAt;
        ret.updated_at = ret.updatedAt;
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return ret;
    },
});

const Note = mongoose.model('Note', noteSchema);

export default Note;
