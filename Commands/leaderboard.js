const { EmbedBuilder } = require('discord.js')
const statsSchema = require('../Models/statsSchema')

module.exports = {
    name: 'leaderboard',
    description: 'Shows the top players',
    async execute(client, interaction) {
        try {
            await interaction.reply({ content: 'Fetching...' })
            const results = await statsSchema.find()
            await getTop(client, interaction, results)
        } catch (err) {
            console.log(err)
        }
    }
}

async function getTop(client, interaction, results) {
    if (results.length !== 0) {
        for (let i = 0; i < results.length; ++i) {
            for (let j = 0; j < results.length; ++j) {
                if (results[i].gamesWon > results[j].gamesWon) {
                    [results[i], results[j]] = [results[j], results[i]]
                }
            }
        }
        let top = ''
        let count = 1
        for (let i = 0; i < results.length; ++i) {
            if (i === 10) {
                break
            }
            let id = results[i].userID
            const fetchUser = await client.users.fetch(id)
            if (i === 0) {
                top += `:first_place: ${fetchUser.username} | **${results[i].gamesWon} wins**\n`
                count++;
                continue
            }
            if (i === 1) {
                top += `:second_place: ${fetchUser.username} | **${results[i].gamesWon} wins**\n`
                count++;
                continue
            }
            if (i === 2) {
                top += `:third_place: ${fetchUser.username} | **${results[i].gamesWon} wins**\n`
                count++;
                continue
            }
            top += `**${count}**. ${fetchUser.username} | **${results[i].gamesWon} wins**\n`
            count++
        }
        count-- //at the end of the loop count will be + 1 than the actual number of people on the leaderboard
        const message = new EmbedBuilder()
            .setTitle(`↗️ LEADERBOARD ↗️`)
            .setColor('#0080FF')
            .addFields({
                name: 'Top players',
                value: `${top}`,
            })
            .setFooter({
                text: `Top ${count} out of ${results.length} ${results.length > 1 ? 'players' : 'player'}`
            })
        return await interaction.editReply({ content: '', embeds: [message] })
    } else {
        const message = new EmbedBuilder()
            .setTitle(`↗️ LEADERBOARD ↗️`)
            .setColor('#0080FF')
            .setDescription('❓ **No one has played yet**')
        return await interaction.editReply({ content: '', embeds: [message], ephemeral: true })
    }
}