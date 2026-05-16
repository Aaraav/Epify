import cron from 'node-cron';
import Note from '../Modals/notesModal.js';
import User from '../Modals/userModal.js';
import { sendMail } from './sendMail.js';
import { redisClient } from '../Connections.js';

export const startReminderCron = () => {
   cron.schedule('* * * * *', async () => {
    try {
        const now = new Date();
        const dueNotes = await Note.find({
            remind_at: { $lte: now },
            reminded: false,
        });

        for (const note of dueNotes) {
            const lockKey = `reminder:lock:${note._id}`;
            const lock = await redisClient.set(lockKey, '1', { NX: true, EX: 60 });
            if (!lock) continue;

            const user = await User.findById(note.user);
            if (!user) continue;

            await sendMail(
                user.email,
                `⏰ Reminder: ${note.title}`,
                `Hi, this is your reminder for the note titled "<strong>${note.title}</strong>".<br><br>${note.content}`
            );

            note.reminded = true;
            note.remind_at = null;
            await note.save();

            const keys = await redisClient.keys(`notes:${user._id}:page:*`);
            if (keys.length > 0) await redisClient.del(keys);
            await redisClient.del(`note:${note._id}:user:${user._id}`);
        }
    } catch (err) {
        console.error(' Reminder cron error:', err.message);
    }
}, {
    scheduled: true,
    timezone: 'UTC'
});
};