const express = require('express');
const router = express.Router();
const yts = require('yt-search');
const apiKeyAuth = require('../../middleware/apiKeyAuth');

router.get('/', apiKeyAuth, async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) {
      return res.status(400).json({ status: false, creator: 'Alex', error: 'Falta el parámetro q' });
    }

    const result = await yts(q);
    const videos = result.videos.slice(0, 10).map((v) => ({
      title: v.title,
      url: v.url,
      duration: v.timestamp,
      views: v.views,
      author: v.author.name,
      thumbnail: v.thumbnail,
    }));

    res.json({ status: true, creator: 'Alex', results: videos });
  } catch (err) {
    res.status(500).json({ status: false, creator: 'Alex', error: err.message });
  }
});

module.exports = router;
