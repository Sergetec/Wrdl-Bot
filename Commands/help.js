const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require('discord.js')

const GREEN = '#5c8d4d'

module.exports = {
    name: 'help',
    description: 'Display information about the commands',
    async execute(client, interaction) {
        const embeds = []
        let page

        embeds.push(new EmbedBuilder()
            .setTitle('General Information')
            .setDescription('**Wrdl** is a bot that allows you to play the famous game wordle on any server you like.')
            .setColor(GREEN)
            .setThumbnail(client.user.avatarURL({ dynamic: true, size: 512 }))
            .addFields({
                name: '❓ \`/help\`',
                value: 'Displays information about Wrdl Bot and the commands available',
                inline: true,
            })
            .addFields({
                name: '📃 \`/info\`',
                value: 'Displays information about the game, rules and how to play it',
                inline: true,
            })
        )

        embeds.push(new EmbedBuilder()
            .setTitle('Commands Information')
            .setDescription('A new game will end automatically after **5 minutes** of inactivity or by command. **Either way is a loss for the player.**')
            .setColor(GREEN)
            .setThumbnail(client.user.avatarURL({ dynamic: true, size: 512 }))
            .addFields({
                name: '🚩 \`/start\`',
                value: 'Start your own Wordle game, you will have to choose the preferred language every time',
                inline: true,
            })
            .addFields({
                name: '💬 \`/guess\`',
                value: 'Make a new guess in your current game',
                inline: true,
            })
            .addFields({
                name: '❗ \`/quit\`',
                value: 'Quit your current game, you will be given the choice of quitting the game or continuing',
                inline: true,
            })
        )

        embeds.push(new EmbedBuilder()
            .setTitle('Stats Information')
            .setDescription('With **Wrdl** you can view your stats or someone else\'s, as well as the leaderboard.')
            .setColor(GREEN)
            .setThumbnail(client.user.avatarURL({ dynamic: true, size: 512 }))
            .addFields({
                name: '❓ \`/stats\`',
                value: 'Displays either your or someone else\'s game statistics',
                inline: true,
            })
            .addFields({
                name: '📜 \`/leaderboard\`',
                value: 'Displays the current leaderboard',
                inline: true,
            })
        )

        const getRow = () => {
            const row = new ActionRowBuilder()

            row.addComponents(
                new ButtonBuilder()
                    .setCustomId('page1')
                    .setStyle(ButtonStyle.Success)
                    .setLabel('Page 1')
                    .setDisabled(page === 0)
            )

            row.addComponents(
                new ButtonBuilder()
                    .setCustomId('page2')
                    .setStyle(ButtonStyle.Success)
                    .setLabel('Page 2')
                    .setDisabled(page === 1)
            )

            row.addComponents(
                new ButtonBuilder()
                    .setCustomId('page3')
                    .setStyle(ButtonStyle.Success)
                    .setLabel('Page 3')
                    .setDisabled(page === 2)
            )
            return row
        }

        const deadRow = new ActionRowBuilder()

        deadRow.addComponents(
            new ButtonBuilder()
                .setCustomId('page1_disabled')
                .setStyle(ButtonStyle.Secondary)
                .setLabel('Page 1')
                .setDisabled(true)
        )

        deadRow.addComponents(
            new ButtonBuilder()
                .setCustomId('page2_disabled')
                .setStyle(ButtonStyle.Secondary)
                .setLabel('Page 2')
                .setDisabled(true)
        )

        deadRow.addComponents(
            new ButtonBuilder()
                .setCustomId('page3_disabled')
                .setStyle(ButtonStyle.Secondary)
                .setLabel('Page 3')
                .setDisabled(true)
        )

        const id = interaction.user.id
        page = 0
        const filter = (interaction) => interaction.user.id === id
        const time = 1000 * 60 * 5
        await interaction.reply({ embeds: [embeds[page]], components: [getRow()] })
        const collector = interaction.channel.createMessageComponentCollector({ filter, time })
        collector.on('collect', async (btnInt) => {
            if (!btnInt) {
                return
            }
            if (btnInt.customId !== 'page1' && btnInt.customId !== 'page2' && btnInt.customId !== 'page3') {
                return
            }
            await btnInt.deferUpdate()
            switch (btnInt.customId) {
                case 'page1':
                    page = 0
                    break
                case 'page2':
                    page = 1
                    break
                case 'page3':
                    page = 2
                    break
            }
            await interaction.editReply({ embeds: [embeds[page]], components: [getRow()] })
        })
        collector.on('end', async () => {
            await interaction.editReply({ embeds: [embeds[page]], components: [deadRow] })
        })
    }
}