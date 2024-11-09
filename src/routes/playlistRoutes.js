const express = require('express');
const playlistController = require('../controllers/playlistController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/',upload.single('albumCover'), playlistController.createPlaylist);
router.get('/', playlistController.getPlaylists);
router.put('/:playlistId',upload.single('albumCover'), playlistController.updatePlaylist);
router.delete('/:playlistId', playlistController.deletePlaylist);
router.post('/:playlistId/tracks/:trackId', playlistController.addTrackToPlaylist);
router.get('/:playlistId/m3u', playlistController.getPlaylistM3U);

module.exports = router;