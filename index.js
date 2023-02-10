// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");

const app = new App({
    token: "xoxb-4809256745328-4771527023447-ViyLfkbreR0WCOKaRv9djJ7W",
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
          break;
        }
      }

    console.log("teste");

    }
    catch (error) {
      console.error(error);
    }
  }
  
  // Find conversation with a specified channel `name`
  findConversation("general");