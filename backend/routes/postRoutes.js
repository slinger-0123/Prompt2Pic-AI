import express from 'express';
import dotenv from 'dotenv';
import { v2 as cloudinary} from 'cloudinary';
import PostModel from '../models/PostModel.js';

dotenv.config({path: '../.env'});
const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.get('/', async (req, res) => {
    try {
        const posts = await PostModel.find({});
        res.status(200).json({ success: true, data: posts});
    } catch (error) {
        res.status(500).json({ success: false, message: error});
    }
});
router.post('/', async (req, res) => {
    try {
        const { name, prompt, photo} = req.body;
        const photoUrl = await cloudinary.uploader.upload(photo);
        const newPost = await PostModel.create({
            name,
            prompt,
            photo: photoUrl.secure_url,
        })
        res.status(201).json({ success: true, data: newPost});
    } catch (error) {
        res.status(500).json({ success: false, message: error});
    }
})

export default router;