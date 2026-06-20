require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');

// Import routes
const authRoutes = require('./routes/auth');
const contentRoutes = require('./routes/content');
const settingsRoutes = require('./routes/settings');

// Import models
const AdminUser = require('./models/AdminUser');
const SiteContent = require('./models/SiteContent');
const Setting = require('./models/Setting');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging (optional, helpful for debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/settings', settingsRoutes);

// Server-side RSS proxy endpoint (alternative to client-side CORS proxy)
// GET /api/videos/rss
// Fetches the YouTube RSS feed server-side and returns parsed JSON
app.get('/api/videos/rss', async (req, res) => {
  try {
    const channelId = 'UCo5Ve--aWuXA6QSLpGi5WUw';
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

    const response = await fetch(rssUrl);
    if (!response.ok) {
      return res.status(502).json({ message: 'Failed to fetch RSS from YouTube' });
    }

    const xmlText = await response.text();

    // Parse XML to extract video entries
    const entries = [];
    const entryRegex = /<entry[^>]*>[\s\S]*?<\/entry>/g;
    const entries_raw = xmlText.match(entryRegex) || [];

    for (const entryXml of entries_raw.slice(0, 6)) {
      // Extract video ID
      const idMatch = entryXml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const videoId = idMatch ? idMatch[1] : '';

      // Extract title
      const titleMatch = entryXml.match(/<media:title>([^<]+)<\/media:title>/);
      const title = titleMatch ? titleMatch[1] : 'Untitled';

      // Extract published date
      const pubMatch = entryXml.match(/<published>([^<]+)<\/published>/);
      const publishedAt = pubMatch
        ? new Date(pubMatch[1]).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })
        : '';

      // Extract link
      const linkMatch = entryXml.match(/<link[^>]+href="([^"]+)"/);
      const url = linkMatch ? linkMatch[1] : `https://youtube.com/watch?v=${videoId}`;

      if (videoId) {
        entries.push({
          id: videoId,
          title,
          thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          publishedAt,
          url,
        });
      }
    }

    res.json({ videos: entries });
  } catch (err) {
    console.error('RSS proxy error:', err);
    res.status(500).json({ message: 'Error fetching RSS feed.' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));

  // Handle React Router - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    // Check for required env vars
    if (!process.env.MONGODB_URI) {
      console.warn('WARNING: MONGODB_URI not set. Server will run without database.');
      console.warn('Set MONGODB_URI environment variable to connect to MongoDB.');
    }

    if (!process.env.JWT_SECRET) {
      console.warn('WARNING: JWT_SECRET not set. Using default (insecure for production).');
      process.env.JWT_SECRET = 'lemfimc-default-secret-change-me';
    }

    // Connect to MongoDB if URI is provided
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');

      // Seed default admin user if none exists
      await seedDefaultData();
    }

    app.listen(PORT, () => {
      console.log(`LemfiMC server running on port ${PORT}`);
      console.log(`API base URL: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

/**
 * Seed default admin user and site content if database is empty.
 * This runs once on server startup.
 */
async function seedDefaultData() {
  try {
    // Seed admin user
    const adminCount = await AdminUser.countDocuments();
    if (adminCount === 0) {
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

      // Hash password manually since pre-save hook may not trigger
      const passwordHash = await bcrypt.hash(adminPassword, 10);

      await AdminUser.create({
        username: adminUsername,
        passwordHash,
        role: 'admin',
      });

      console.log(`Default admin user created: ${adminUsername} / ${adminPassword}`);
      console.log('IMPORTANT: Change the default password in production!');
    }

    // Seed default site content
    const contentCount = await SiteContent.countDocuments();
    if (contentCount === 0) {
      const defaultContents = [
        { section: 'hero', key: 'tagline', value: 'Minecraft Adventures, Builds & More' },
        { section: 'community', key: 'wikiUrl', value: 'https://minecraft.wiki' },
        { section: 'community', key: 'redditUrl', value: 'https://reddit.com/r/Minecraft' },
        { section: 'community', key: 'discordUrl', value: 'https://discord.gg/minecraft' },
        { section: 'community', key: 'forumUrl', value: 'https://minecraftforum.net' },
        { section: 'footer', key: 'creditText', value: 'Made with love for the Minecraft community' },
      ];

      await SiteContent.insertMany(defaultContents);
      console.log('Default site content seeded.');
    }

    // Seed default settings
    const settingsCount = await Setting.countDocuments();
    if (settingsCount === 0) {
      await Setting.create({
        key: 'proxyUrl',
        value: 'https://api.allorigins.win/raw?url=',
      });
      console.log('Default settings seeded.');
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
}

startServer();
