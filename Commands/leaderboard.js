const { Client, CommandInteraction} = require('discord.js')
const { MessageEmbed } = require('discord.js')
const statsSchema = require('../Models/statsSchema')

module.exports = {
    name: 'leaderboard',
    description: 'shows the top players',
    async execute(client, interaction){
        const guildID = interaction.guild.id
        const query = {
            guildID: guildID,
        }
        const results = await statsSchema.find(query)
        if (results.length !== 0){
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
                top += `**${count}**. <@${results[i].userID}> | **${results[i].gamesWon} wins**\n`
                count++
            }
            const message = new MessageEmbed()
                .setTitle(`↗️ LEADERBOARD ↗️`)
                .setColor('#0080ff')
                .addFields({
                    name: 'Top players',
                    value: `${top}`,
                })
            return await interaction.reply({ embeds: [message] })
        }
        else{
            const message = new MessageEmbed()
                .setTitle(`↗️ LEADERBOARD ↗️`)
                .setColor('#0080ff')
                .setDescription('❓ **No one has played yet in this guild**')
            return await interaction.reply({ embeds: [message], ephemeral: true })
        }
    }
}