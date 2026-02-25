module.exports = {
  config: {
    name: "autoreact",
    version: "7.0.0",
    author: "MOHAMMAD AKASH",
    countDown: 0,
    role: 0,
    category: "system",
    shortDescription: "Admin vs Member auto react",
    longDescription: "Reacts differently to admins and members."
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    try {
      const { messageID, senderID, threadID, type } = event;
      if (type !== "message" && type !== "message_reply") return;

      // নিজের মেসেজে রিয়েক্ট করবে না
      if (senderID == api.getCurrentUserID()) return;

      // গ্রুপের তথ্য আনা (অ্যাডমিন চেক করার জন্য)
      const threadInfo = await api.getThreadInfo(threadID);
      const adminIDs = threadInfo.adminIDs.map(admin => admin.id);

      let reactList;

      // ১. চেক: মেসেজ দাতা কি অ্যাডমিন?
      if (adminIDs.includes(senderID)) {
        // অ্যাডমিনদের জন্য রিয়েক্ট (🥰, 😻, 😽, 🫶)
        reactList = ["🥰", "😻", "😽", "🫶"];
      } else {
        // সাধারণ মেম্বারদের জন্য রিয়েক্ট (😹, 🐸, 🌚, 👿, 😂, 🤡)
        reactList = ["😹", "🐸", "🌚", "👿", "😂", "🤡"];
      }

      // রেন্ডমলি একটি রিয়েক্ট সিলেক্ট করা
      const randomReact = reactList[Math.floor(Math.random() * reactList.length)];

      // রিয়েক্ট পাঠানো
      api.setMessageReaction(randomReact, messageID, (err) => {
        if (err) console.error("Reaction Error:", err);
      }, true);

    } catch (e) {
      // ব্যক্তিগত চ্যাটে (Inbox) threadInfo তে এরর আসতে পারে, তাই ট্রাই-ক্যাচ রাখা হয়েছে
      console.log("Autoreact Error:", e.message);
    }
  }
};
