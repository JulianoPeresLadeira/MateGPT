// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");

const app = new App({
    token: "xoxb-4809256745328-4771527023447-t2FCdGChAigO8SU6Cp7H8Umr",
    signingSecret: "e2b4ae6957d5ae66bc085544bae05bd5"
});

async function main() {
    publicChannelIds = (await findAllPublicChannels())
        .map(a => a.id);
    await enterChannels(publicChannelIds);
    await getMessagesFromChannels(publicChannelIds);
}

async function enterChannels(channelIds) {
    botId = await getBotId();
    console.log("Bot ID: " + botId);
    console.log("Channels IDs: " + channelIds);
    await Promise.all(channelIds.map(channel => app.client.conversations.join({ channel: channel})))
}

async function getBotId() {
    console.log("Getting botId...");
    return (await app.client.auth.test()).bot_id;
}

async function findAllPublicChannels() {
    console.log("Getting all public conversations...");
    return (await app.client.conversations.list()).channels
        .filter(channel => channel.is_private == false)
        .map(channel => ({
            "name": channel.name,
            "id": channel.id
        }))
        .map(printAndReturn);
}

async function getMessagesFromChannels(channelIds) {
    return channelIds
        .map(id => getMessagesFromChannel(id))
}

async function getMessagesFromChannel(channelId) {
    conversationHistory = (await recurseOverChannelHistory(channelId))
        .filter(message => message.subtype != "channel_join")
        .map(message => ({
            user: message.user,
            text: message.text,
            timestamp: message.ts
        }))
    console.log(conversationHistory);
}

async function recurseOverChannelHistory(channelId, state = { result: [] }) {
    if (state.lastMessageTimestamp) {
        apiCallOptions.latest = state.lastMessageTimestamp;
    }
    const response = await app.client.conversations.history({ channel: channelId });
    state.result = state.result.concat(response.messages);
    state.lastMessageTimestamp = state.result[state.result.length - 1].ts;
    if (response.has_more) {
        return recurseOverChannelHistory(channelId, state);
    }
    return state.result.reverse();
}

function printAndReturn(obj) {
    console.log(obj)
    return obj;
}

main();