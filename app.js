const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const trackRoutes = require('./src/routes/trackRoutes');
const playlistRoutes = require('./src/routes/playlistRoutes');
const errorHandler = require('./src/middleware/errorHandler');
const searchRoutes = require('./src/routes/searchRoutes');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/tracks', trackRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/',searchRoutes)
app.use(errorHandler);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch(err => console.error(err));