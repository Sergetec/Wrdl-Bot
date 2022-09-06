const { Client, CommandInteraction} = require('discord.js')
const { MessageEmbed } = require('discord.js')
const statsSchema = require('../Models/statsSchema')

module.exports = {
    name: 'stats',
    description: 'shows wordle stats of someone',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user of which to display stats',
            required: false,
        },
    ],
    async execute(client, interaction){
        const user = interaction.options.getUser('user') || interaction.user

        const userID = user.id
        const guildID = interaction.guild.id
        const query = {
            guildID: guildID,
            userID: userID,
        }
        let schema = await statsSchema.findOne(query)
        if (schema){
            const message = new MessageEmbed()
                .setTitle(`📊 WORDLE STATISTICS 📊`)
                .setColor('#ff7869')
                .addFields({
                    name: 'User',
                    value: `<@${user.id}>`,
                })
                .addFields({
                    name: `Games Played 🌍`,
                    value: `\`\`\`${schema.gamesTotal}\`\`\``,
                    inline: true,
                })
                .addFields({
                    name: `Games won 🎉`,
                    value: `\`\`\`${schema.gamesWon}\`\`\``,
                    inline: true,
                })
                .addFields({
                    name: `Games lost 📈`,
                    value: `\`\`\`${schema.gamesLost}\`\`\``,
                    inline: true,
                })
                .addFields({
                    name: `Win rate 📝`,
                    value: `\`\`\`${schema.winRate}%\`\`\``,
                    inline: true,
                })
            return await interaction.reply({ embeds: [message] })
        }
        else{
            const message = new MessageEmbed()
                .setTitle(`📊 WORDLE STATISTICS 📊`)
                .setColor('#ff7869')
                .setDescription(`❓ <@${user.id}> haven\'t played a game in this server`)

            return await interaction.reply({ embeds: [message] })
        }
    }
}