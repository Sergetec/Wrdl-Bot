const mongoose = require("mongoose")
const mongoPath = process.env.MONGO_URI
const { EmbedBuilder, ActivityType } = require('discord.js')
const gamesSchema = require('../Models/gamesSchema')
const statsSchema = require('../Models/statsSchema')

module.exports = {
    name: 'ready',
    description: 'on startup | expired games',
    on: true,
    async execute(client) {
        console.log('Wrdl Bot online!')

        await mongoose.connect(mongoPath, {
            keepAlive: true
        }).then(() => {
            console.log('Connected to the database!')
        }).catch((err) => {
            console.log(err)
        });
        client.user.setActivity({
            name: `wordle games | /help`,
            type: ActivityType.Watching,
        })
        client.user.setStatus('online')

        //Check for inactive games
        const check = async () => {

            try {
                /*

                Check for expired inside of guild

                */
                let Guilds = client.guilds.cache.map(guild => guild.id)
                for (let guild of Guilds) {
                    guild = await client.guilds.cache.get(guild)

                    //Guild check
                    let guildId = guild.id
                    let botID = "1011006137690239059"
                    let ok = guild.members.cache.get(botID)
                    if (ok) {
                        let expires1 = new Date()
                        let dt = new Date(expires1.getTime()).toUTCString()
                        const query = {
                            guildID: guildId,
                            expires: { $lt: dt },
                        }
                        const results = await gamesSchema.find(query)
                        if (!isIterable(results)) {
                            let guildIDUser = results.guildID, userIDUser = results.userID
                            await gamesSchema.deleteMany(query)
                            await expiredGameFound(guildIDUser, userIDUser) //in guild
                            let channel = results.channelStarted
                            const message = new EmbedBuilder()
                                .setTitle('Wordle Game')
                                .setColor('#ED4245')
                                .setDescription(`<@${results.userID}>'s game has ended due to inactivity`)

                            await client.channels.cache.get(channel).send({ embeds: [message] })
                        } else {
                            for (const result of results) {
                                let guildIDUser = result.guildID, userIDUser = result.userID
                                await gamesSchema.deleteMany(query)
                                await expiredGameFound(guildIDUser, userIDUser) //in guild
                                let channel = result.channelStarted
                                const message = new EmbedBuilder()
                                    .setTitle('Wordle Game')
                                    .setColor('#ED4245')
                                    .setDescription(`<@${result.userID}>'s game has ended due to inactivity`)

                                await client.channels.cache.get(channel).send({ embeds: [message] })
                            }
                        }
                    }
                }

                /*

                Check for expired outside of guild

                */
                let expires1 = new Date()
                let dt = new Date(expires1.getTime() + 120 * 60 * 1000)
                const query = {
                    expires: { $lt: dt },
                }
                const results = await gamesSchema.find(query)
                if (!isIterable(results)) {
                    let guildIDUser = results.guildID, userIDUser = results.userID
                    await gamesSchema.deleteMany(query)
                    await expiredGameFound(guildIDUser, userIDUser) //not in guild
                } else {
                    for (const result of results) {
                        let guildIDUser = result.guildID, userIDUser = result.userID
                        await gamesSchema.deleteMany(query)
                        await expiredGameFound(guildIDUser, userIDUser) //not in guild
                    }
                }
                setTimeout(check, 1000 * 30)
            } catch (err) {
                console.log(err)
                setTimeout(check, 1000 * 30)
            }
        }
        await check()
    }
}

function isIterable(obj) {
    //checks for null and undefined
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

async function expiredGameFound(guildIDUser, userIDUser) {
    const query2 = {
        guildID: guildIDUser,
        userID: userIDUser,
    }
    let schema = await statsSchema.findOne(query2)
    schema.gamesLost = schema.gamesLost + 1
    schema.winRate = Math.trunc(schema.gamesWon / schema.gamesTotal * 100)
    schema.currentStreak = 0
    await schema.save()
}