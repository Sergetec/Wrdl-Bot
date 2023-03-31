const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    name: 'help',
    description: 'Display information about the commands',
    async execute(client, interaction) {
        try {
            const embeds = []
            const pages = {}

            embeds.push(new EmbedBuilder()
                .setTitle('General Information')
                .setDescription('**Wrdl** is a bot that allows you to play the famous game wordle on any server you like.')
                .setColor('#FF964D')
                .setThumbnail(client.user.avatarURL({dynamic: true, size: 512}))
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
                .setFooter({
                    text: 'Support Contact: Sergetec#6803'
                })
            )

            embeds.push(new EmbedBuilder()
                .setTitle('Commands Information')
                .setDescription('A new game will end automatically after 3 minutes of inactivity or by command. **Either way is a loss for the player.**')
                .setColor('#FF964D')
                .setThumbnail(client.user.avatarURL({dynamic: true, size: 512}))
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
                .setFooter({
                    text: 'Support Contact: Sergetec#6803'
                })
            )

            embeds.push(new EmbedBuilder()
                .setTitle('Stats Information')
                .setDescription('With **Wrdl** you can view your stats or someone else\'s, as well as the leaderboard on the current server.')
                .setColor('#FF964D')
                .setThumbnail(client.user.avatarURL({dynamic: true, size: 512}))
                .addFields({
                    name: '❓ \`/stats\`',
                    value: 'Displays either your or someone else\'s game statistics, either globally or from that specific server',
                    inline: true,
                })
                .addFields({
                    name: '📜 \`/leaderboard\`',
                    value: 'Displays the current leaderboard on the server',
                    inline: true,
                })
                .setFooter({
                    text: 'Support Contact: Sergetec#6803'
                })
            )

            const getRow = (id) => {
                const row = new ActionRowBuilder()

                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId('page1')
                        .setStyle(ButtonStyle.Success)
                        .setLabel('Page 1')
                        .setDisabled(pages[id] === 0)
                )

                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId('page2')
                        .setStyle(ButtonStyle.Success)
                        .setLabel('Page 2')
                        .setDisabled(pages[id] === 1)
                )

                row.addComponents(
                    new ButtonBuilder()
                        .setCustomId('page3')
                        .setStyle(ButtonStyle.Success)
                        .setLabel('Page 3')
                        .setDisabled(pages[id] === 2)
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
            pages[id] = pages[id] || 0
            const embed = embeds[pages[id]]
            let collector
            const filter = (interaction) => interaction.user.id === id
            const time = 1000 * 60 * 5
            await interaction.reply({ embeds: [embed], components: [getRow(id)] })
            collector = interaction.channel.createMessageComponentCollector({ filter, time })
            collector.on('collect', async (btnInt) => {
                if (!btnInt) {
                    return;
                }
                // interaction.deferReply()
                if (btnInt.customId !== 'page1' && btnInt.customId !== 'page2' && btnInt.customId !== 'page3') {
                    return;
                }
                await btnInt.deferUpdate()
                switch (btnInt.customId) {
                    case 'page1':
                        pages[id] = 0
                        break;
                    case 'page2':
                        pages[id] = 1
                        break;
                    case 'page3':
                        pages[id] = 2
                        break;
                }
                await interaction.editReply({ embeds: [embeds[pages[id]]], components: [getRow(id)] })
            })
            collector.on('end', async () => {
                await interaction.editReply({ embeds: [embeds[pages[id]]], components: [deadRow] })
            })
        } catch(err) {
            console.log("User ran 2 times the help command")
        }
    }
}