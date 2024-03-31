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
const express = require('express')
const Topgg = require('@top-gg/sdk')
require('dotenv').config()

const RED = '#ED4245'

module.exports = {
    name: 'ready',
    description: 'on startup | expired games | autoposter',
    on: true,
    async execute(client) {
        console.log(`${client.user.username} online`)

        // mongoDB connection
        await mongoose.connect(process.env.MONGO_URI, {
            keepAlive: true
        }).then(() => {
            console.log('Connected to the database')
        }).catch((err) => {
            console.log(err)
        })
        client.user.setActivity({
            name: 'wordle games',
            type: ActivityType.Competing,
        })
        client.user.setStatus('online')

        // topgg - autoposter
        const ap = AutoPoster(process.env.TOPGG_TOKEN, client)
        ap.on('posted', (stats) => {
            console.log(`✅ Stats updated | ${stats.serverCount} servers`)
        })

        // topgg - voting logs
        const app = express()
        const webhook = new Topgg.Webhook(process.env.TOPGG_AUTHORIZATION)
        app.post(
            "/vote",
            webhook.listener(async (vote) => {
                console.log(vote.user, 'has voted the bot')
                const query = {
                    userID: vote.user,
                }
                let schema = await statsSchema.findOne(query)
                schema.voteCount = schema.voteCount + 1
                await schema.save()
            })
        )
        app.listen(process.env.PORT)

        // manual gc
        scheduleGc()

        // check for first day of the month
        const checkFirstDayOfTheMonth = async () => {
            const currentDate = new Date()
            const isFirstDayOfTheMonth = currentDate.getDate() === 1
            const nextMonth = new Date(Date.UTC(currentDate.getUTCFullYear(), currentDate.getUTCMonth() + 1, 1))
            const millisecondsUntilNextMonth = nextMonth - currentDate - (3 * 60 * 60 * 1000) // railway is GMT + 3 => -3h from time
            try {
                setTimeout(async () => {
                    if (isFirstDayOfTheMonth) {
                        const filter = {
                            currentStreak: { $ne: 0 } // Find documents where currentStreak is not equal to 0
                        }
                        const update = {
                            $set: { currentStreak: 0 } // Set currentStreak to 0 for matching documents
                        }
                        const result = await statsSchema.updateMany(filter, update)
                        console.log(`${result.modifiedCount} documents updated.`)
                    }
                }, millisecondsUntilNextMonth)
            } catch (err) {
                console.log(err)
                setTimeout(checkFirstDayOfTheMonth, millisecondsUntilNextMonth)
            }
        }
        await checkFirstDayOfTheMonth()

        // check for inactive games
        const check = async () => {
            try {
                let dt = new Date().toUTCString()
                const query = {
                    expires: { $lt: dt },
                }
                const results = await gamesSchema.find(query)
                for (let i = 0; i < results.length; ++i) {
                    let userIDUser = results[i].userID
                    await gamesSchema.deleteMany(query) // delete from games database
                    await expiredGameFound(userIDUser) // update the user in stats database
                    let guildID = results[i].guildID // get the guild id from database
                    let botID = '1011006137690239059'
                    let guild = client.guilds.cache.get(guildID) // cache the guild
                    if (guild) {
                        let ok = guild.members.cache.get(botID) // check if bot is in the guild
                        if (ok) { // if it is, then send a message, otherwise it will go to the next result
                            let channel = results[i].channelStarted
                            // if bot has permission to send message & view the channel
                            if (guild.members.me.permissionsIn(channel).has([PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ViewChannel])) {
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
        .setColor(RED)
        .setDescription(`❗ <@${result.userID}>'s game has ended due to inactivity`)

    try {
        await client.channels.cache.get(channel).send({ embeds: [message] })
    } catch (err) {
        console.log(err)
    }
}

function scheduleGc() {
    if (!global.gc) {
        return console.log('Garbage collection is not exposed')
    }

    // schedule next gc within a random interval (15-45 minutes)
    let nextMinutes = Math.random() * 30 + 15

    setTimeout(function () {
        global.gc()
        scheduleGc()
    }, nextMinutes * 60 * 1000)
}