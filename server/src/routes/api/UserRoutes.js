import { Router } from 'express';
import {
    getUsers,
    createUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser
} from '../../controllers/UserController.js';

const router = Router();

// /api/users
router.route('/').get(getUsers).post(createUser);

// /api/users/:id
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

// /api/users/Login
router.post('/login', loginUser);


export default router;