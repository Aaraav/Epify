import express, { json } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';

import connectInfrastructure from './Connections.js';
import userRoutes from './Routes/userRoutes.js';
import notesRoutes from './Routes/noteRoutes.js';
import searchRouter from './Routes/searchRoutes.js';
import aboutRoutes from './Routes/aboutRoute.js';

dotenv.config();

const openapiDocument = JSON.parse(fs.readFileSync('./openapi.json', 'utf-8'));

const app = express();
connectInfrastructure();

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
