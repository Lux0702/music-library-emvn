const Track = require('../models/Track');
const Playlist = require('../models/Playlist');

exports.search = async (req, res) => {
    try {
        const query = req.query.q; // Truyền vào từ query string (ví dụ: ?q=rock)
        
        if (!query) {
            return res.status(400).json({ message: 'Search query is required' });
        }

        // Tìm kiếm Track sử dụng RegEx
        const tracks = await Track.find({
            $or: [
                { title: new RegExp(query, 'i') },
                { artist: new RegExp(query, 'i') },
                { album: new RegExp(query, 'i') },
                { genre: new RegExp(query, 'i') }
            ]
        });

        // Tìm kiếm Playlist sử dụng RegEx
        const playlists = await Playlist.find({
            $or: [
                { title: new RegExp(query, 'i') },
                { artist: new RegExp(query, 'i') },
                { album: new RegExp(query, 'i') },
                { genre: new RegExp(query, 'i') }
            ]
        });

        res.status(200).json({
            success: true,
            message: 'Search results',
            data: {
                tracks,
                playlists
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
