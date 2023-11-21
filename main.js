//DISCORD
const { Client, GatewayIntentBits, Collection, Discord } = require('discord.js');
require('dotenv').config()
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
})

const express = require("express");
const Topgg = require("@top-gg/sdk");

const app = express(); // Your express app

const webhook = new Topgg.Webhook("parola123");

app.post(
    "/vote",
    webhook.listener((vote) => {
        // vote is your vote object
        console.log(vote.user);
    })
); // attach the middleware

app.listen(process.env.PORT); // your port

client.commands = new Collection()
client.events = new Collection();
['Commands', 'Events'].forEach(handler => {
    require(`./Handlers/${handler}`)(client, Discord)
})

//Error handling - not for ready.js
const error = require('node:process')

error.on('unhandledRejection', async (reason) => {
    console.log('Unhandled Rejection ', reason)
})

error.on('uncaughtException', (err) => {
    console.log('Uncaught Exception: ', err)
})

error.on('uncaughtExceptionMonitor', (err) => {
    console.log('Uncaught Exception Monitor: ', err)
})

client.login(process.env.TOKEN)