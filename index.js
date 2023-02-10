// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");

const app = new App({
    token: "xoxb-4809256745328-4771527023447-vxD3PzIIa4RxbdnswHqBB7Wq",
    signingSecret: "e2b4ae6957d5ae66bc085544bae05bd5"
  });

// Find conversation ID using the conversations.list method
async function findConversation(name) {
    try {
      // Call the conversations.list method using the built-in WebClient
      const result = await app.client.conversations.list();
  
      for (const channel of result.channels) {
        if (channel.name === name) {
          conversationId = channel.id;
  
          // Print result
          console.log("Found conversation ID: " + conversationId);
          // Break from for loop
            await fetchMessage(conversationId);
          break;
        }
      }
    }
    catch (error) {
      console.error(error);
    }
  }

// Fetch conversation history using the ID and a TS from the last example
async function fetchMessage(id, ts) {
    try {
        const result = await app.client.conversations.history({
            channel: id
          });
        
          conversationHistory = result.messages
            .filter(message => message.subtype != "channel_join")
            .map(message => ({
                user: message.user,
                text: message.text,
                timestamp: message.ts
            }))

        // Print results
        console.log(conversationHistory.length + " messages found in " + id);
        console.log(conversationHistory);
    }
    catch (error) {
        console.error(error);
    }
}
  // Find conversation with a specified channel `name`
  findConversation("general");
  //fetchMessage("C04P3DFG04T")