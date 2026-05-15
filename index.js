import express, { json } from 'express';
import cors from 'cors';
import connectDB from './Connections.js';
import userRoutes from './Routes/userRoutes.js';
import notesRoutes from './Routes/noteRoutes.js';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

const openapiDocument = JSON.parse(fs.readFileSync('./openapi.json', 'utf-8'));

const app = express();
await connectDB();

app.use(json());

app.use(cors());

app.use('/', userRoutes);

app.use('/notes', notesRoutes);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

app.get('/openapi.json', (req, res) => {
    res.json(openapiDocument);
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
