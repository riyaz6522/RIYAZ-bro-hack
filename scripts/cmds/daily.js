const Database = require("better-sqlite3");
const path = require("path");

// === DATABASE SETUP ===
const dbPath = path.join(__dirname, "balance.db");
const db = new Database(dbPath);
db.prepare(`
  CREATE TABLE IF NOT EXISTS balances (
    userID TEXT PRIMARY KEY,
    balance INTEGER,
    lastDaily INTEGER
  )
`).run();

// === BALANCE FUNCTIONS ===
function getBalance(userID) {
  const row = db.prepare("SELECT balance FROM balances WHERE userID=?").get(userID);
  if (row) return row.balance || 100;
  return 100;
}

function setBalance(userID, balance) {
  const now = Date.now();
  db.prepare(`
    INSERT INTO balances (userID, balance, lastDaily)
    VALUES (?, ?, ?)
    ON CONFLICT(userID) DO UPDATE SET balance=excluded.balance
  `).run(userID, balance, now);
}

function getLastDaily(userID) {
  const row = db.prepare("SELECT lastDaily FROM balances WHERE userID=?").get(userID);
  return row?.lastDaily || 0;
}

function setLastDaily(userID) {
  const now = Date.now();
  db.prepare(`
    INSERT INTO balances (userID, balance, lastDaily)
    VALUES (?, ?, ?)
    ON CONFLICT(userID) DO UPDATE SET lastDaily=excluded.lastDaily
  `).run(userID, getBalance(userID), now);
}

function formatBalance(num) {
  if (num >= 1e12) return (num / 1e12).toFixed(2).replace(/\.00$/, '') + "T$";
  if (num >= 1e9) return (num / 1e9).toFixed(2).replace(/\.00$/, '') + "B$";
  if (num >= 1e6) return (num / 1e6).toFixed(2).replace(/\.00$/, '') + "M$";
  if (num >= 1e3) return (num / 1e3).toFixed(2).replace(/\.00$/, '') + "k$";
  return num + "$";
}

// === MODULE CONFIG ===
module.exports = {
  config: {
    name: "daily",
    aliases: ["claim"],
    version: "1.0",
    author: "MOHAMMAD AKASH",
    role: 0,
    shortDescription: "Claim your daily reward",
    category: "game",
    guide: { en: "{p}daily – Claim daily reward" }
  },

  onStart: async function({ api, event }) {
    const { senderID, threadID, messageID } = event;
    const now = Date.now();
    const lastClaim = getLastDaily(senderID);

    // 24 ঘণ্টা চেক
    if (now - lastClaim < 24 * 60 * 60 * 1000) {
      const remaining = 24 * 60 * 60 * 1000 - (now - lastClaim);
      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      return api.sendMessage(
        `⏳ 𝐃ᴀɪʟʏ 𝐑ᴇᴡᴀʀᴅ already claimed!\nNext claim in ${hours}h ${minutes}m.`,
        threadID, messageID
      );
    }

    // দৈনিক রিওয়ার্ড
    const reward = Math.floor(Math.random() * 501) + 500; // 500$–1000$
    const oldBalance = getBalance(senderID);
    const newBalance = oldBalance + reward;

    setBalance(senderID, newBalance);
    setLastDaily(senderID);

    const output = `🎉 𝐃ᴀɪʟʏ 𝐑ᴇᴡᴀʀᴅ 𝐂ʟᴀɪᴍᴇᴅ!
💰 𝐘ᴏᴜ 𝐑ᴇᴄᴇɪᴠᴇᴅ: ${formatBalance(reward)}
🏦 𝐍ᴇᴡ 𝐁ᴀʟᴀɴᴄᴇ: ${formatBalance(newBalance)}`;

    return api.sendMessage(output, threadID, messageID);
  }
};
