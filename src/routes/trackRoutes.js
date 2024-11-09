const express = require('express');
const multer = require('multer');
const trackController = require('../controllers/trackController');
// const upload = require('../middleware/upload');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('mp3File'), trackController.createTrack);
router.get('/', trackController.getTracks);
router.put('/:id', upload.single('mp3File'), trackController.updateTrack);
router.delete('/:id', trackController.deleteTrack);
router.get('/search', trackController.searchTracks);

module.exports = router;