//DISCORD
const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client({ intents: ["GUILDS"] });

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
['Commands', 'Events'].forEach(handler => {
    require(`./Handlers/${handler}`)(client, Discord);
})

client.login(process.env.TOKEN);