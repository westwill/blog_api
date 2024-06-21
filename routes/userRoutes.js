import express from 'express';
import { getUsers, login, register } from '../controllers/userController.js';

const router = express.Router();

router.post('/create', register);
router.post('/login', login);
router.get('/all-users', getUsers);


export default router;