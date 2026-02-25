module.exports = {
  config: {
    name: "autoreact",
    version: "9.0.0",
    author: "MOHAMMAD AKASH",
    countDown: 0,
    role: 0,
    category: "system"
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    const { threadID, messageID, senderID, type } = event;

    // মেসেজ না হলে বা নিজের মেসেজ হলে বাদ
    if (type !== "message" && type !== "message_reply") return;
    if (senderID == api.getCurrentUserID()) return;

    try {
      // থ্রেড ডাটা কালেকশন
      api.getThreadInfo(threadID, (err, threadInfo) => {
        if (err) {
          // ইনবক্স বা এরর হলে সাধারণ রিয়েক্ট দিবে
          const normalReacts = ["😹", "🐸", "🌚", "👿", "😂", "🤡"];
          const react = normalReacts[Math.floor(Math.random() * normalReacts.length)];
          return api.setMessageReaction(react, messageID, () => {}, true);
        }

        // অ্যাডমিন আইডি চেক
        const adminIDs = threadInfo.adminIDs.map(i => i.id);
        const isAdmin = adminIDs.includes(senderID);

        // ইমোজি লিস্ট সেট করা
        const adminReacts = ["🥰", "😻", "😽", "🫶"];
        const memberReacts = ["😹", "🐸", "🌚", "👿", "😂", "🤡"];

        const selectedReact = isAdmin 
          ? adminReacts[Math.floor(Math.random() * adminReacts.length)] 
          : memberReacts[Math.floor(Math.random() * memberReacts.length)];

        // ফাইনাল রিয়েক্ট
        api.setMessageReaction(selectedReact, messageID, (err) => {
          if (err) console.log(err);
        }, true);
      });
    } catch (e) {
      console.log("Error:", e);
    }
  }
};
