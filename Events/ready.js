const mongoose = require('mongoose')
const {
    EmbedBuilder,
    ActivityType,
    PermissionsBitField,
} = require('discord.js')
const gamesSchema = require('../Models/gamesSchema')
const statsSchema = require('../Models/statsSchema')
const {
    AutoPoster
} = require('topgg-autoposter')
require('dotenv').config()

module.exports = {
    name: 'ready',
    description: 'on startup | expired games | autoposter',
    on: true,
    async execute(client) {
        console.log('Wrdl Bot online!')

        await mongoose.connect(process.env.MONGO_URI, {
            keepAlive: true
        }).then(() => {
            console.log('Connected to the database!')
        }).catch((err) => {
            console.log(err)
        })
        client.user.setActivity({
            name: 'wordle games',
            type: ActivityType.Competing,
        })
        client.user.setStatus('online')

        //Autoposter
        const ap = AutoPoster(process.env.TOPGG_TOKEN, client)
        ap.on('posted', (stats) => {
            console.log(`✅ Stats updated | ${stats.serverCount} servers`)
        })

        //Check for inactive games
        const check = async () => {
            try {
                let dt = new Date().toUTCString()
                const query = {
                    expires: { $lt: dt },
                }
                const results = await gamesSchema.find(query)
                for (let i = 0; i < results.length; ++i) {
                    let userIDUser = results[i].userID
                    await gamesSchema.deleteMany(query) //delete from games database
                    await expiredGameFound(userIDUser) //update the user in stats database
                    let guildID = results[i].guildID //get the guild id from database
                    let botID = '1011006137690239059'
                    let guild = client.guilds.cache.get(guildID) //cache the guild
                    if (guild) {
                        let ok = guild.members.cache.get(botID) //check if bot is in the guild
                        if (ok) { //if it is, then send a message, otherwise it will go to the next result
                            let channel = results[i].channelStarted
                            if (guild.members.me.permissionsIn(channel).has(PermissionsBitField.Flags.SendMessages)) { //if bot has permission to send message
                                await sendGameEndedMessage(results[i], channel, client)
                            }
                        }
                    }
                }
                setTimeout(check, 1000 * 10)
            } catch (err) {
                console.log(err)
                setTimeout(check, 1000 * 10)
            }
        }
        await check()
    }
}

async function expiredGameFound(userIDUser) {
    const query2 = {
        userID: userIDUser,
    }
    let schema = await statsSchema.findOne(query2)
    schema.gamesLost = schema.gamesLost + 1
    schema.winRate = Math.trunc(schema.gamesWon / schema.gamesTotal * 100)
    schema.currentStreak = 0
    await schema.save()
}

async function sendGameEndedMessage(result, channel, client) {
    const message = new EmbedBuilder()
        .setTitle('Wordle Game')
        .setColor('#ED4245')
        .setDescription(`<@${result.userID}>'s game has ended due to inactivity`)

    try {
        await client.channels.cache.get(channel).send({ embeds: [message] })
    } catch (err) {
        console.log(err)
    }
}