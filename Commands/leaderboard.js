const { EmbedBuilder } = require('discord.js')
const statsSchema = require('../Models/statsSchema')

module.exports = {
    name: 'leaderboard',
    description: 'Shows the top players',
    async execute(client, interaction) {
        await interaction.reply({ content: 'Fetching...' })

        //This will first cache all the results, sort descending based on gamesWon, and will limit the results to 10
        //So that it will not exceed the memory limit
        const sort = { gamesWon: -1 }
        const results = await statsSchema.find({ userID: { $ne: '333664530582208513' } }).sort(sort).limit(10)
        await getTop(client, interaction, results)
    }
}

async function getTop(client, interaction, results) {
    let top = ''
    let totalPlayers = await statsSchema.count()
    let count = 3
    for (let i = 0; i < results.length; ++i) {
        if (i === 10) {
            break
        }
        let id = results[i].userID
        const fetchUser = await client.users.fetch(id)
        if (i === 0) {
            top += `:first_place: ${fetchUser.username} | **${results[i].gamesWon} wins**\n`
            continue
        }
        if (i === 1) {
            top += `:second_place: ${fetchUser.username} | **${results[i].gamesWon} wins**\n`
            continue
        }
        if (i === 2) {
            top += `:third_place: ${fetchUser.username} | **${results[i].gamesWon} wins**\n`
            continue
        }
        count++
        top += `**${count}**. ${fetchUser.username} | **${results[i].gamesWon} wins**\n`
    }
    const message = new EmbedBuilder()
        .setTitle(`↗️ LEADERBOARD ↗️`)
        .setColor('#FF964D')
        .addFields({
            name: 'Top players',
            value: `${top}`,
        })
        .setFooter({
            text: `Top ${results.length} out of ${totalPlayers} players`
        })
    return await interaction.editReply({ content: '', embeds: [message] })
}