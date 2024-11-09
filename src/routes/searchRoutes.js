const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');


// Route tìm kiếm chung cho Track và Playlist
router.get('/search', searchController.search )
module.exports = router;
