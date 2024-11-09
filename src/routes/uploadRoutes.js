const express = require('express');
const multer = require('multer');
const cloudinary = require('../services/cloudinary'); // Đảm bảo cấu hình Cloudinary
const router = express.Router();

// Cấu hình multer để lưu trữ tạm thời file ảnh
const storage = multer.memoryStorage(); // Lưu ảnh vào bộ nhớ tạm thời
const upload = multer({ storage: storage });

// API upload ảnh
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const file = req.file; // Lấy file từ request
        
        // Upload ảnh lên Cloudinary
        const result = await cloudinary.uploader.upload(file.buffer, {
            folder: 'album_images',  // Tùy chọn: Lưu ảnh trong thư mục album_images
            resource_type: 'image',  // Đảm bảo tải ảnh
            public_id: file.originalname, // Tên file
            overwrite: true // Ghi đè nếu file đã tồn tại
        });

        // Trả về URL của ảnh đã upload
        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            data: result.secure_url // Trả về URL ảnh từ Cloudinary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error uploading image',
            error: error.message
        });
    }
});

module.exports = router;
