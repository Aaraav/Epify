import express, { json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import https from 'https';
import swaggerUi from 'swagger-ui-express';

import connectInfrastructure from './Connections.js';
import userRoutes from './Routes/userRoutes.js';
import notesRoutes from './Routes/noteRoutes.js';
import searchRouter from './Routes/searchRoutes.js';
import aboutRoutes from './Routes/aboutRoute.js';
import { startReminderCron } from './Utils/reminder.js';

dotenv.config();

const openapiDocument = JSON.parse(fs.readFileSync('./openapi.json', 'utf-8'));

const app = express();
app.set('trust proxy', 1);

app.use(json());
app.use(cors());
app.use(morgan('dev'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { message: 'Too many requests, please try again later' },
});

app.use(limiter);

app.use('/', userRoutes);
app.use('/notes', notesRoutes);
app.use('/', searchRouter);
app.use('/', aboutRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

app.get('/', (req, res) => {
    res.json({ status: 'API Running' });
});

app.get('/openapi.json', (req, res) => {
    res.json(openapiDocument);
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        uptime: `${Math.floor(process.uptime())}s`,
        timestamp: new Date().toISOString(),
    });
});

app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

connectInfrastructure().then(() => {
    startReminderCron();

    setInterval(
        () => {
            https
                .get('https://epify-gf25.onrender.com/health', () => {})
                .on('error', () => {});
        },
        10 * 60 * 1000
    );

    app.listen(PORT, () => {
        console.log(`✅ Server running on port ${PORT}`);
    });
});
