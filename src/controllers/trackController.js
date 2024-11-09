const Track = require('../models/Track');

const cloudinary = require('../services/cloudinary');
//Tạo tracks
exports.createTrack = async (req, res) => {
    try {
        let mp3FileUrl = '';
        
        // Kiểm tra các trường trong req.body có hợp lệ không (title, artist, album)
        const { title, artist, album, genre, releaseYear, duration } = req.body;
        if (!title || !artist || !album || !genre || !releaseYear || !duration) {
            return res.status(400).json({
                success: false,
                message: 'Title, artist, album, genre, releaseYear, and duration are required fields.',
                data: null
            });
        }

        // Kiểm tra xem mp3 file có được gửi lên không
        if (req.file) {
            // Kiểm tra định dạng file
            if (!req.file.mimetype.startsWith('audio/')) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid file format. Please upload an audio file.',
                    data: null
                });
            }
            
            // Upload mp3 file lên Cloudinary nếu file hợp lệ
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'tracks',
                resource_type: 'audio',
                public_id: req.file.originalname,
                overwrite: true
            });
            mp3FileUrl = result.secure_url;
        } else {
            return res.status(400).json({
                success: false,
                message: 'MP3 file is required.',
                data: null
            });
        }

        
        // Tạo track mới
        const track = new Track({ ...req.body, mp3File: mp3FileUrl });
        await track.save();

        res.status(201).json({
            success: true,
            message: 'Track created successfully.',
            data: track
        });
    } catch (error) {
        console.error("Error creating track:", error);
        res.status(500).json({
            success: false,
            message: 'Failed to create track. Please try again later.',
            data: null
        });
    }
};


// lấy danh sách tracks
exports.getTracks = async (req, res) => {
    try {
        const tracks = await Track.find();
        res.json({
            success: true,
            message: 'Tracks retrieved successfully.',
            data: tracks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: []
        });
    }
};

// Update a track
exports.updateTrack = async (req, res) => {
    try {
        // Kiểm tra xem có file mp3 mới không
        const updateData = { ...req.body };

        // Nếu có file mp3 mới, cập nhật đường dẫn của file mp3
        if (req.file) {
            // Kiểm tra file mp3
            if (!req.file.mimetype.startsWith('audio/')) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid file format. Please upload an audio file.',
                    data: null
                });
            }
            updateData.mp3File = req.file.path;  // Nếu có, cập nhật mp3File mới
        }

        // Tìm và cập nhật track
        const track = await Track.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!track) {
            return res.status(404).json({
                success: false,
                message: 'Track not found.',
                data: null
            });
        }

        res.json({
            success: true,
            message: 'Track updated successfully.',
            data: track
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
            data: null
        });
    }
};


// Xóa track
exports.deleteTrack = async (req, res) => {
    try {
        const track = await Track.findByIdAndDelete(req.params.id);
        if (!track) {
            return res.status(404).json({
                success: false,
                message: 'Track not found.',
                data: null
            });
        }
        res.status(204).json({
            success: true,
            message: 'Track deleted successfully.',
            data: null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: null
        });
    }
};

// Tìm kiếm tracks
exports.searchTracks = async (req, res) => {
    const { query } = req.query;
    if (!query || query.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Search query is required.',
            data: null
        });
    }

    try {
        const tracks = await Track.find({
            $or: [
                { title: new RegExp(query, 'i') },
                { artist: new RegExp(query, 'i') },
                { album: new RegExp(query, 'i') },
                { genre: new RegExp(query, 'i') }
            ]
        });

        // Kiểm tra nếu không tìm thấy kết quả
        if (tracks.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No tracks found for your search query.',
                data: []
            });
        }

        res.json({
            success: true,
            message: 'Tracks found successfully.',
            data: tracks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            data: []
        });
    }
};

