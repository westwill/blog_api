import express from 'express';
import { getUsers, login, register, validateUser } from '../controllers/userController.js';
import { checkAndRenewToken } from '../middleware/validate-token.js';

const router = express.Router();

router.post('/create', register);
router.post('/login', login);
router.get('/all-users', checkAndRenewToken, getUsers);
router.get("/single-user/:id", checkAndRenewToken, getUsers );
router.get('/validate-user', checkAndRenewToken, validateUser);

export default router;
