import { Router } from 'express'
import { User } from '../model/user.model.js';
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const authRouter = Router();