const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const routes = require('./routes/review');
const db = require('./models');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "2mb" }));

app.get('/', (req, res) => res.json({ msg: 'AI Code Review Backend (Node) alive' }));

app.use('/review', routes);

const PORT = process.env.PORT || 8000;

async function start() {
  try {
    // Validate OpenAI API key presence and format
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.startsWith('sk-3A1b')) {
      console.warn('WARNING: OPENAI_API_KEY is missing or looks invalid. Please check your .env file.');
      // Uncomment next line to stop server if key is invalid
      // process.exit(1);
    }

    await db.sequelize.authenticate();
    console.log('DB connected');

    // Sync models and create tables if they don't exist
    await db.sequelize.sync({ alter: true }); // update tables to match models

    app.listen(PORT, () => console.log('Server running on port', PORT));
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
}

start();
