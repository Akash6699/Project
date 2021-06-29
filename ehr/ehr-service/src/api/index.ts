import { Router } from 'express';
import api from './routes/api';

// guaranteed to get dependencies
export default () => {
    const app = Router();
    api(app);
    return app;
};
