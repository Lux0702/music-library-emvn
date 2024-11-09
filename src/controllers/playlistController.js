const Playlist = require('../models/Playlist');
const cloudinary = require('../services/cloudinary');
// Tạo playlist
exports.createPlaylist = async (req, res) => {
    try {
        let albumCoverUrl = '';

        // Upload album cover to Cloudinary if a file is provided
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'album_images',
                resource_type: 'image',  // Ensures it's treated as an image
                public_id: req.file.originalname, // Name the file by its original name
                overwrite: true // Overwrite if the file with the same name exists
            });
            albumCoverUrl = result.secure_url; // Save the returned URL
        }

        // Create playlist document with albumCover URL and other data
        const playlist = new Playlist({
            ...req.body,
            albumCover: albumCoverUrl || req.file?.path
        });
        await playlist.save();

        res.status(201).json({
            success: true,
            message: 'Playlist created successfully',
            data: playlist
        });
    } catch (error) {
        console.error("Error creating playlist:", error);
        res.status(500).json({ message: error.message });
    }
};

// lấy danh sách playlists
exports.getPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.find().populate('tracks');

        // Trả về dữ liệu theo cấu trúc mong muốn
        res.status(200).json({
            success: true,
            message: 'Playlists fetched successfully',
            data: playlists
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// cập nhật playlist
exports.updatePlaylist = async (req, res) => {
    try {
        const updateData = { ...req.body };
        console.log(updateData);
        console.log(req.file);
        // Nếu là file mới, úp lên Cloudinary
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'album_images',
                resource_type: 'image',
                public_id: req.file.originalname,
                overwrite: true
            });
            updateData.albumCover = result.secure_url; // gán URL 
        }

        const playlist = await Playlist.findByIdAndUpdate(req.params.playlistId, updateData, { new: true });

        res.status(200).json({
            success: true,
            message: 'Playlist updated successfully',
            data: playlist
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Xóa playlist
exports.deletePlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findByIdAndDelete(req.params.playlistId);

        if (playlist && playlist.albumCover) {
            //Xóa album cover từ  Cloudinary
            const publicId = playlist.albumCover.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`album_images/${publicId}`);
        }

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm track vào  playlist
exports.addTrackToPlaylist = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.playlistId);

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        // Kiểm tra track có tồn tại
        const track = await Track.findById(req.params.trackId);
        if (!track) {
            return res.status(404).json({ message: 'Track not found' });
        }

        // Thêm track nếu nó  chưa được thêm
        if (!playlist.tracks.includes(track._id)) {
            playlist.tracks.push(track._id);
            await playlist.save();
        }

        res.status(200).json({
            success: true,
            message: 'Track added to playlist successfully',
            data: playlist
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


// Tạo file m3u từ playlist
// exports.getPlaylistM3U = async (req, res) => {
//     try {
//         const playlist = await Playlist.findById(req.params.playlistId).populate('tracks');
        
//         if (!playlist) {
//             return res.status(404).json({ message: 'Playlist not found' });
//         }

//         console.log(playlist); // Log the playlist to verify the data
//         let m3uContent = '#EXTM3U\n';

//         if (playlist.tracks && playlist.tracks.length > 0) {
//             playlist.tracks.forEach(track => {
//                 console.log(track); // Log each track to verify its data
//                 m3uContent += `#EXTINF:${track.duration},${track.artist} - ${track.title}\n`;
//                 m3uContent += `${track.mp3File}\n`;
//             });
//         } else {
//             return res.status(404).json({ message: 'No tracks found in the playlist' });
//         }

//         const filename = playlist.title || 'playlist';
//         res.setHeader('Content-Type', 'audio/x-mpegurl');
//         res.setHeader('Content-Disposition', `attachment; filename="${filename}.m3u"`);

//         // Send the M3U content
//         res.status(200).send(m3uContent);

//     } catch (error) {
//         console.error(error); // Log the error for debugging
//         res.status(500).json({ message: error.message });
//     }
// };

// tạo

//
exports.getPlaylistM3U = async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.playlistId).populate('tracks');

        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        let m3uContent = '#EXTM3U\n';

        // Kiểm tra xem các bản nhạc có được điền đầy đủ không
        if (playlist.tracks && playlist.tracks.length > 0) {
            playlist.tracks.forEach(track => {
                m3uContent += `#EXTINF:${track.duration},${track.artist} - ${track.title}\n`;
                m3uContent += `${track.mp3File}\n`;  // gán URL
            });
        } else {
            return res.status(404).json({ message: 'No tracks found in the playlist' });
        }

        // Đặt tiêu đề cho tệp M3U tải xuống
        const filename = playlist.title || 'playlist';
        res.setHeader('Content-Type', 'audio/x-mpegurl');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}.m3u"`);

        // Gửi M3U 
        res.status(200).send(m3uContent);

    } catch (error) {
        console.error("Error generating M3U file:", error);
        res.status(500).json({ message: error.message });
    }
};