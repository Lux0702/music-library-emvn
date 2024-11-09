const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: true },
    genre: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    duration: { type: Number, required: true },
    mp3File: { type: String, required: true }
});
trackSchema.index({ title: 'text', artist: 'text', album: 'text', genre: 'text' });

module.exports = mongoose.model('Track', trackSchema);