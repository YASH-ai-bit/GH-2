import { getJson } from "serpapi";
import dotenv from "dotenv";
import { pool } from "./config/db.js"; 

dotenv.config();

const SERP_API = process.env.SERP_API;

const words = [
  "OnlyFans", "Etsy", "Walgreens", "Pizza", "Starbucks",
  "McDonald’s", "Bitcoin", "Apple", "Chipotle", "Sarkari Result",
  "IPL", "Proxy", "Real Madrid", "Indeed", "duckduckgo",
  "Airbnb", "Diddy", "Breaking Bad", "APT", "House of the Dragon",
  "Dune", "Connections", "Mango Pickle", "Wallerman", "Liam Payne",
  "Ratan Tata", "CrowdStrike", "Mike Tyson", "Israel", "Dress",
  "Hurricane", "Beauty"
];

async function fetchSearchCount(word) {
  return new Promise((resolve, reject) => {
    getJson({ engine: "google", q: word, api_key: SERP_API }, (json) => {
      const searchCount = json?.search_information?.total_results;
      searchCount !== undefined ? resolve(searchCount) : reject(`Failed: ${word}`);
    });
  });
}

async function fetchImageUrl(word) {
  return new Promise((resolve, reject) => {
    getJson({ engine: "google_images", q: word, api_key: SERP_API }, (json) => {
      const imageUrl = json?.images_results[0]?.original;
      imageUrl ? resolve(imageUrl) : reject(`Failed: ${word}`);
    });
  });
}

async function saveWordToPostgreSQL(word, searchCount, imageUrl) {
  try {
    const result = await pool.query(
      "INSERT INTO words (word, search_count, image_url) VALUES ($1, $2, $3) RETURNING *",
      [word, searchCount, imageUrl]
    );
    console.log(`Saved: ${word} --> ${searchCount}, ${imageUrl}`);
  } catch (error) {
    console.error(`Error saving ${word}:`, error.message);
  }
}

async function fetchAndSaveAllWords() {
  for (const word of words) {
    try {
      const [searchCount, imageUrl] = await Promise.all([
        fetchSearchCount(word),
        fetchImageUrl(word)
      ]);
      await saveWordToPostgreSQL(word, searchCount, imageUrl);
    } catch (error) {
      console.error(`Skipping ${word}:`, error);
    }
  }
  console.log("All words processed!");
  pool.end(); 
}

fetchAndSaveAllWords();
