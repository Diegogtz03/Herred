import { Router } from 'express';
import { getExample } from '../controllers/example';

const router = Router();

router.get('/example', getExample);

export default router;