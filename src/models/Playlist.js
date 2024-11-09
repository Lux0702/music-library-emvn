const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    title: { type: String, required: true },
    albumCover: { type: String },
    tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }]
});
playlistSchema.index({ title: 'text', artist: 'text', album: 'text', genre: 'text' });
module.exports = mongoose.model('Playlist', playlistSchema);