import express from 'express';
import cookieParser from 'cookie-parser';
import authController from './controllers/auth.js';
import postController from './controllers/posts.js';
import notFoundMiddleware from './middleware/not-found.js';
import errorMiddleware from './middleware/error.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(authController);
app.use('/api/v1/posts', postController);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
