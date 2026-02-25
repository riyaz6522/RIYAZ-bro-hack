module.exports = {
  config: {
    name: "autoreact",
    version: "8.0.0",
    author: "MOHAMMAD AKASH",
    countDown: 0,
    role: 0,
    category: "system",
    shortDescription: "Admin vs Member auto react (Optimized)"
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    try {
      const { messageID, senderID, threadID, type } = event;
      if (type !== "message" && type !== "message_reply") return;
      if (senderID == api.getCurrentUserID()) return;

      // সরাসরি থ্রেড ইনফো নিয়ে অ্যাডমিন চেক
      api.getThreadInfo(threadID, (err, info) => {
        if (err) return;

        // অ্যাডমিনদের আইডি লিস্ট বের করা
        const adminIDs = info.adminIDs.map(i => i.id);
        
        let reactList;

        // ✅ যদি মেসেজ দাতা অ্যাডমিন হয়
        if (adminIDs.includes(senderID)) {
          reactList = ["🥰", "😻", "😽", "🫶"];
        } 
        // ❌ যদি সাধারণ মেম্বার হয়
        else {
          reactList = ["😹", "🐸", "🌚", "👿", "😂", "🤡"];
        }

        const randomReact = reactList[Math.floor(Math.random() * reactList.length)];

        // রিয়েক্ট পাঠানো
        api.setMessageReaction(randomReact, messageID, (err) => {}, true);
      });

    } catch (e) {
      console.error(e);
    }
  }
};
