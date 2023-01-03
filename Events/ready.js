const mongoose = require("mongoose");
const mongoPath = process.env.MONGO_URI;
const { MessageEmbed } = require('discord.js')
const gamesSchema = require('../Models/gamesSchema')
const statsSchema = require('../Models/statsSchema')

module.exports = {
    name: 'ready',
    description: 'on startup | expired punishments',
    on: true,
    async execute (client){
        console.log('Wrdl Bot online!');

        await mongoose.connect(mongoPath, {
            keepAlive: true
        }).then(() => {
            console.log('Connected to the database!')
        }).catch((err) => {
            console.log(err);
        });
        client.user.setActivity({
            name: `wordle games | /info`,
            type: 'WATCHING'
        })
        client.user.setStatus('online')

        //Check for inactive games
        try {
            let Guilds = client.guilds.cache.map(guild => guild.id)
            for (let guild of Guilds) {
                guild = client.guilds.cache.get(guild)
                const check = async () => {
                    const query = {
                        guildID: guild.id,
                        expires: {$lt: new Date()},
                    }
                    const results = await gamesSchema.find(query)

                    const query2 = {
                        guildID: guild.id,
                    }

                    if (!isIterable(results)) {
                        let channel = results.channelStarted

                        const message = new MessageEmbed()
                            .setTitle('Wordle Game')
                            .setColor('RED')
                            .setDescription(`<@${results.userID}>'s game has ended due to inactivity`)
                        await client.channels.cache.get(channel).send({embeds: [message]})
                        await gamesSchema.deleteMany(query)

                        let schema = await statsSchema.findOne(query2)
                        schema.gamesLost = schema.gamesLost + 1
                        schema.winRate = Math.trunc(schema.gamesWon / schema.gamesTotal * 100)
                        await schema.save()
                    } else {
                        for (const result of results) {
                            let channel = result.channelStarted

                            const message2 = new MessageEmbed()
                                .setTitle('Wordle Game')
                                .setColor('RED')
                                .setDescription(`<@${result.userID}>' game has ended due to inactivity`)
                            await client.channels.cache.get(channel).send({embeds: [message2]})
                            await gamesSchema.deleteMany(query)

                            let schema2 = await statsSchema.findOne(query2)
                            schema2.gamesLost = schema2.gamesLost + 1
                            schema2.winRate = Math.trunc(schema2.gamesWon / schema2.gamesTotal * 100)
                            await schema2.save()
                        }
                    }
                    setTimeout(check, 1000 * 30)
                }
                await check()
            }
        } catch (err) {
            console.log(err)
        }
    }
}

function isIterable(obj) {
    //checks for null and undefined
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}