require('dotenv').config();
console.log("Key:", process.env.OPENAI_API_KEY ? "Loaded" : "Missing");
