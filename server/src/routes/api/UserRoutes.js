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

// /api/users/login - MUST be before /:id to avoid matching "login" as an ID param
router.post('/login', loginUser);

// /api/users/:id
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);


export default router;