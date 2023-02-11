require('dotenv').config()
const axios = require('axios');
const { App } = require("@slack/bolt");

const token = process.env.SLACK_BOT_TOKEN;
const signingSecret = process.env.SLACK_SIGNING_SECRET;

if (!token || !signingSecret) {
    console.error (`Token or signingSecret not set in process.env`)
    return -1;
}

const app = new App({ token: token, signingSecret: signingSecret});

async function main() {
    const publicChannels = await findAllPublicChannels();
    const publicChannelIds = publicChannels.map(a => a.id);
    const users = await getUsers();
    await enterChannels(publicChannelIds);
    const channelMessages = await getMessagesFromChannels(publicChannelIds);
    // console.log(users)
    
    /*return {
        users: users,
        channelMessages: channelMessages
    };*/

    for (message of channelMessages) {
        const sentiment = await getSentiment(message.text);
        message.user = users.get(message.user).realName;
        message.sentiment = sentiment;
    }

    console.log(channelMessages)
}

///////////////////////////
//      SLACK STUFF      //
///////////////////////////

async function getUsers() {
    const usersMap = new Map();
    const users = (await app.client.users.list()).members
        .filter(member => !member.is_bot && member.id !== "USLACKBOT")
        .map(member => (usersMap.set(member.id, {
            name: member.name,
            realName: member.real_name
        })));
        return usersMap;
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
        .filter(channel => channel.is_archived == false)
        .map(channel => ({
            "name": channel.name,
            "id": channel.id
        }))
        .map(printAndReturn);
}

async function getMessagesFromChannels(channelIds) {
    const messages = [];
    for (channelId of channelIds) {
        const messagesInChannel = await getMessagesFromChannel(channelId);
        messages.push(messagesInChannel);
    }
    return messages.flatMap(arr => arr);
}

async function getMessagesFromChannel(channelId) {
    return (await recurseOverChannelHistory(channelId))
        .filter(message => message.subtype != "channel_join")
        .map(message => ({
            user: message.user,
            text: message.text,
            timestamp: message.ts,
            channelId
        }))
        .map(printAndReturn);
}

async function recurseOverChannelHistory(channelId, state = { result: [] }) {
    if (state.lastMessageTimestamp) {
        apiCallOptions.latest = state.lastMessageTimestamp;
    }
    const response = await app.client.conversations.history({ channel: channelId });
    state.result = state.result.concat(response.messages);
    state.lastMessageTimestamp = state.result[state.result.length - 1].ts;
    if (response.has_more) {
        return await recurseOverChannelHistory(channelId, state);
    }
    return state.result.reverse();
}

function printAndReturn(obj) {
    console.debug(obj)
    return obj;
}

///////////////////////////
//      AXIOS STUFF      //
///////////////////////////

async function getSentiment(message) {
    const response = await axios({
        method: 'POST',
        url: 'http://localhost:5000/',
        data: {
            text: message
        }
    })
    return response.data
}

main();