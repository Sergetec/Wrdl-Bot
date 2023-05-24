const { ButtonStyle } = require('discord.js');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const gamesSchema = require('../Models/gamesSchema')
const statsSchema = require('../Models/statsSchema')

module.exports = {
    name: 'quit',
    description: 'Quit your current game',
    async execute(client, interaction) {
        const userID = interaction.user.id
        const guildID = interaction.guild.id
        const query = {
            guildID: guildID,
            userID: userID,
        }
        const result = await gamesSchema.findOne(query)
        if (!result) {
            const message = new EmbedBuilder()
                .setTitle('Wordle Game')
                .setColor('#ED4245')
                .setDescription('❗ **You have not started a game yet**')
            return await interaction.reply({ embeds: [message], ephemeral: true })
        }
        const row = new ActionRowBuilder()
        row.addComponents(
            new ButtonBuilder()
                .setCustomId('quit_game')
                .setStyle(ButtonStyle.Danger)
                .setLabel('Quit')
        )

        row.addComponents(
            new ButtonBuilder()
                .setCustomId('continue_game')
                .setStyle(ButtonStyle.Success)
                .setLabel('Continue')
        )

        const deadRow = new ActionRowBuilder()
        deadRow.addComponents(
            new ButtonBuilder()
                .setCustomId('quit_game_disabled')
                .setStyle(ButtonStyle.Danger)
                .setLabel('Quit')
                .setDisabled(true)
        )
        deadRow.addComponents(
            new ButtonBuilder()
                .setCustomId('continue_game_disabled')
                .setStyle(ButtonStyle.Success)
                .setLabel('Continue')
                .setDisabled(true)
        )

        let collector
        const filter = (interaction) => interaction.user.id === userID
        const time = 1000 * 30

        const message = new EmbedBuilder()
            .setTitle('Wordle Game')
            .setColor('#ED4245')
            .setDescription('❗ Are you sure that you want to **quit this game**? This will **__count as a loss__** on your account. You can still continue if you wish to.')
        await interaction.reply({ embeds: [message], components: [row] })

        const quitMessage = new EmbedBuilder()
            .setTitle('Wordle Game')
            .setColor('#ED4245')
            .setDescription('❗ Game quited')

        const continueMessage = new EmbedBuilder()
            .setTitle('Wordle Game')
            .setColor('#57F287')
            .setDescription('✅ Game continued')

        let continueGame = false
        let quitGame = false

        collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time })
        collector.on('collect', async (btnInt) => {
            if (!btnInt) {
                return
            }
            if (btnInt.customId !== 'quit_game' && btnInt.customId !== 'continue_game') {
                return
            }
            await btnInt.deferUpdate()
            switch (btnInt.customId) {
                case 'quit_game':
                    quitGame = true
                    await gamesSchema.deleteMany(query)
                    let schema = await statsSchema.findOne(query)
                    schema.gamesLost = schema.gamesLost + 1
                    schema.winRate = Math.trunc(schema.gamesWon / schema.gamesTotal * 100)
                    schema.currentStreak = 0
                    await schema.save()

                    break
                case 'continue_game':
                    continueGame = true

                    //Update inactive time
                    const expires1 = new Date()
                    expires1.setMinutes(expires1.getMinutes() + 1)

                    let schema2 = await gamesSchema.findOne(query)
                    schema2.expires = expires1
                    await schema2.save()

                    break
            }
            collector.on('end', async () => {
                const messageExpired = new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor('#ED4245')
                    .setDescription('❗ Time has expired')
                return await interaction.editReply({ embeds: [messageExpired], components: [deadRow] })
            })
            if (quitGame) {
                return await interaction.editReply({ embeds: [quitMessage], components: [deadRow] })
            }
            if (continueGame) {
                await interaction.editReply({ embeds: [continueMessage], components: [deadRow] })
                let channel = result.channelStarted
                let replyMessage = result.replyMessage
                if (replyMessage === '\n') {
                    return
                }
                let count = result.guesses
                const messageToSendContinue = new EmbedBuilder()
                    .setTitle(`Wordle Game`)
                    .setColor('#FF964D')
                    .addFields({
                        name: '\u200b',
                        value: `${replyMessage}`,
                    })
                    .setFooter({
                        text: `${count} / 6`
                    })
                return await client.channels.cache.get(channel).send({ embeds: [messageToSendContinue] })
            }
        })
    }
}