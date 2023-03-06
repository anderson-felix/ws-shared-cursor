import 'reflect-metadata';
import 'dotenv/config';
import 'express-async-errors';

import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

import { logger } from '@shared/utils';
import { getClientLanguage } from './middlewares/getClientLanguage';
import { appErrorHandler } from './middlewares/appErrorHandler';
import Socket from './connections';

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || '3000';
const env = process.env.NODE_ENV || 'development';

const socket = new Socket(
  new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.disable('x-powered-by');

app.use(cors());
app.use(getClientLanguage);
app.use(appErrorHandler);

socket.start();

server.listen(port, () => {
  logger.info(`Server is listening on port ${port}`);
  logger.info(`Environment: ${env}`);
});
