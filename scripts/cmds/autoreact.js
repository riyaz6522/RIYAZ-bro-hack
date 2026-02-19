module.exports = {
  config: {
    name: "autoreact",
    version: "4.6.0",
    author: "MOHAMMAD RIYAZ",
    role: 0,
    category: "system",
    shortDescription: "Random cat auto react",
    longDescription: "Reacts with random cat emojis to every message."
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    try {
      const { messageID, senderID, threadID } = event;
      if (!messageID) return;

      // ❌ নিজের বা বটের মেসেজে রিয়েক্ট করবে না
      if (senderID === api.getCurrentUserID()) return;

      // ❌ Cooldown (2.5s) যাতে ফেসবুক স্প্যাম হিসেবে না ধরে
      global.__autoReactCooldown ??= {};
      if (
        global.__autoReactCooldown[threadID] &&
        Date.now() - global.__autoReactCooldown[threadID] < 2500
      ) return;

      global.__autoReactCooldown[threadID] = Date.now();

      // ==========================
      // আপনার দেওয়া ৪টি ইমোজি লিস্ট
      // ==========================
      const catReacts = ["😽", "😾", "😹", "😻"];
      
      // এই লিস্ট থেকে রেন্ডমলি একটা সিলেক্ট করবে
      const randomReact = catReacts[Math.floor(Math.random() * catReacts.length)];

      // ⏱ Human-like delay (৮০০ মিলি-সেকেন্ড দেরি করবে)
      await new Promise(r => setTimeout(r, 800));

      // ✅ মেসেজে রিয়েক্ট পাঠানো
      api.setMessageReaction(randomReact, messageID, (err) => {}, true);

    } catch (e) {
      // কনসোলে এরর চেক করতে চাইলে নিচের লাইনটি ব্যবহার করতে পারেন
      // console.error(e);
    }
  }
};
