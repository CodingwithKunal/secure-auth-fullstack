import express from 'express';
import { isAuthenticated } from '../middleware/userAuth.js';
import { profileDetails } from '../controller/userprofile.js';
const router = express.Router();

router.get('/profile', isAuthenticated,profileDetails);

export default router;