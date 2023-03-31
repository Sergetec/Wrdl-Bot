//DISCORD
const { Client, GatewayIntentBits, Collection, Discord } = require('discord.js');
require('dotenv').config()
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ]
})

client.commands = new Collection()
client.events = new Collection();
['Commands', 'Events'].forEach(handler => {
    require(`./Handlers/${handler}`)(client, Discord)
})

client.login(process.env.TOKEN)