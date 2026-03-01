module.exports = {
  config: {
    name: "autoreact",
    version: "6.0.0",
    author: "MOHAMMAD AKASH",
    countDown: 0, // কোনো দেরি হবে না
    role: 0,
    category: "system",
    shortDescription: "Cat reaction to every message"
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    // ১. চেক করবে এটা কি কোনো মেসেজ কি না (সব ধরনের মেসেজ টাইপ এলাউড)
    if (event.body !== undefined || event.type === "message" || event.type === "message_reply") {
      
      const { messageID, senderID } = event;

      // ২. বট নিজের মেসেজে রিয়েক্ট করবে না (লুপ ঠেকানোর জন্য)
      if (senderID == api.getCurrentUserID()) return;

      try {
        const catReacts = ["😽", "😾", "😹", "😻", "😿", "🙀", "🤡", "👅", "☠️", "🫦", "🤍", "❤️‍🩹"];
        const randomReact = catReacts[Math.floor(Math.random() * catReacts.length)];

        // ৩. সরাসরি রিয়েক্ট কমান্ড
        api.setMessageReaction(randomReact, messageID, (err) => {
          if (err) {
            // যদি কোনো এরর আসে কনসোলে দেখাবে
            console.log("React Error: " + err.errorSummary);
          }
        }, true);

      } catch (e) {
        // কোনো এরর হলে সেটা কনসোলে প্রিন্ট হবে
        console.log("Autoreact Error: ", e);
      }
    }
  }
};
