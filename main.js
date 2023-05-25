//DISCORD
const { Client, GatewayIntentBits, Collection, Discord } = require('discord.js');
require('dotenv').config()
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
})

client.commands = new Collection()
client.events = new Collection();
['Commands', 'Events'].forEach(handler => {
    require(`./Handlers/${handler}`)(client, Discord)
})

//Error handling
const error = require('node:process')
const { check } = require('./Events/ready')

error.on('unhandledRejection', async (reason) => {
    console.log('Unhandled Rejection ', reason)
    if (reason.includes('ready.js')) {
        setTimeout(check, 1000 * 30)
    }
})

error.on('uncaughtException', (err) => {
    console.log('Uncaught Exception: ', err)
    if (err.includes('ready.js')) {
        setTimeout(check, 1000 * 30)
    }
})

error.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('Uncaught Exception Monitor: ', err, origin)
    if (origin.includes('ready.js') || err.includes('ready.js')) {
        setTimeout(check, 1000 * 30)
    }
})

client.login(process.env.TOKEN)