import { Router } from 'express';
import { getUsers, getUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import authorize, { isAdmin } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get('/', authorize, isAdmin, getUsers);   // admin-only: list everyone
userRouter.get('/:id', authorize, getUser);           // own id, or admin bypass
userRouter.put('/:id', authorize, updateUser);        // own id, or admin bypass
userRouter.delete('/:id', authorize, deleteUser);     // own id, or admin bypass

export default userRouter;