require('dotenv').config();

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const db = require('../models');

// Gemini setup
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

// --- Utility: Run Linter ---
function runLinter(code, language) {
  let lintReport = '';
  const ext = language === 'python' ? '.py' : '.js';
  const tempFileName = path.join(__dirname, `temp_code_${Date.now()}${ext}`);

  try {
    fs.writeFileSync(tempFileName, code, 'utf8');

    if (language === 'javascript' || language === 'js') {
      lintReport = execSync(
        `npx eslint --no-eslintrc --rule "no-unused-vars:warn" ${tempFileName} || true`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
    } else if (language === 'python') {
      lintReport = execSync(
        `python -m pylint ${tempFileName} --disable=all --enable=E,W,R || true`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
    } else {
      lintReport = 'No linter configured for this language.';
    }

    // Clean up common noise in linter output
    lintReport = lintReport.replace(/Your code has been rated.*\n?/g, '').trim();

  } catch (lintErr) {
    lintReport = lintErr.stdout?.toString() || lintErr.message;
  } finally {
    if (fs.existsSync(tempFileName)) fs.unlinkSync(tempFileName);
  }

  return lintReport || 'No linting issues found.';
}

// --- Utility: AI Review with Gemini ---
async function getAISuggestions(code, language) {
  if (!process.env.GEMINI_API_KEY) {
    return 'Gemini API key not configured.';
  }

  try {
    const prompt = `You are a senior code reviewer. 
Review the following ${language || 'unknown'} code for:
1. Bugs or potential runtime errors
2. Security vulnerabilities
3. Refactoring opportunities
4. Best practice violations

Return your review in bullet points, like a PR comment.

Code:
${code}`;

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent(prompt);

    // More reliable extraction of text
    const aiText = result?.response?.candidates?.[0]?.content?.parts
      ?.map(p => p.text)
      .join('\n')
      || result?.response?.text()
      || 'No suggestions returned.';

    return aiText.trim();

  } catch (aiErr) {
    console.error('[Gemini Error]', aiErr.message);
    return 'AI review error: ' + aiErr.message;
  }
}

// --- POST /analyze ---
router.post('/analyze', async (req, res) => {
  try {
    const { code, language } = req.body || {};
    if (!code) {
      return res.status(400).json({ error: 'Code is required.' });
    }

    // Step 1: Run linter
    const lintReport = runLinter(code, language);

    // Step 2: Get AI review
    const aiSuggestions = await getAISuggestions(code, language);

    // Step 3: Save to DB
    const review = await db.CodeReview.create({
      language: language || 'unknown',
      code,
      aiSuggestions,
      lintReport
    });

    // Step 4: Respond with results
    res.json({
      success: true,
      message: 'Code analyzed successfully.',
      data: {
        reviewId: review.id,
        lintReport,
        aiSuggestions
      }
    });

  } catch (err) {
    console.error('[Analyze Route Error]', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

// --- GET /history ---
router.get('/history', async (req, res) => {
  try {
    const rows = await db.CodeReview.findAll({
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error('[History Route Error]', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
