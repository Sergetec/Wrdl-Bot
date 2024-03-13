const {
    EmbedBuilder,
    AttachmentBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
} = require('discord.js')
const { Canvas,
    registerFont,
    loadImage,
} = require("canvas")

const GREEN = '#5c8d4d'
const WHITE = '#ffffff'
registerFont('./Fonts/Signika-Bold.ttf', { family: 'Signika' })
const FONT_FAMILY_SIGNIKA = 'Signika'

const canvas = new Canvas(1920, 1097)
const context = canvas.getContext("2d")

const statsSchema = require('../Models/statsSchema')

module.exports = {
    name: 'leaderboard',
    description: 'Shows the top players',
    async execute(client, interaction) {
        const userID = interaction.user.id
        const leaderboards = [
            {
                label: 'Most wins',
                description: 'Top players based on wins',
                value: 'wins',
                emoji: '🏆',
            },
            {
                label: 'Best winstreak',
                description: 'Top players based on best winstreak',
                value: 'streakBest',
                emoji: '🔥',
            },
            {
                label: 'Current winstreak',
                description: 'Top players based on current winstreak',
                value: 'streakCurrent',
                emoji: '🔥',
            }
        ]
        const menu = new StringSelectMenuBuilder()
            .setCustomId('leaderboards')
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder('Select a category...')
            .addOptions(leaderboards.map((leaderboard) =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(leaderboard.label)
                        .setDescription(leaderboard.description)
                        .setValue(leaderboard.value)
                        .setEmoji(leaderboard.emoji)
                )
            )

        const actionRowEnabled = new ActionRowBuilder().addComponents(menu)

        // Default leaderboard will be wins

        let reply = await interaction.reply({ content: 'Fetching...' })
        // This will first cache all the results, sort descending based on gamesWon, and will limit the results to 10

        // So that it will not exceed the memory limit
        const sort = { gamesWon: -1 }
        const results = await statsSchema.find({ userID: { $ne: '333664530582208513' } }).sort(sort).limit(10)
        await getTopWins(client, interaction, results, canvas, context, actionRowEnabled)

        let winLeaderboard = false, streakBestLeaderboard = false, streakCurrentLeaderboard = false
        const filter = (interaction) => interaction.user.id === userID
        const time = 1000 * 60 * 5 // 5 minutes
        const collector = reply.createMessageComponentCollector({
            filter: filter,
            time: time
        })
        collector.on('collect', async (menuInt) => {
            await menuInt.deferUpdate()
            if (menuInt.values.includes('wins')) {
                winLeaderboard = true
            } else if (menuInt.values.includes('streakBest')) {
                streakBestLeaderboard = true
            }
            else if (menuInt.values.includes('streakCurrent')) {
                streakCurrentLeaderboard = true
            }
            if (winLeaderboard) {
                reply = await interaction.editReply({ content: 'Fetching...', embeds: [], files: [] })

                // This will first cache all the results, sort descending based on gamesWon, and will limit the results to 10
                // So that it will not exceed the memory limit
                const sort = { gamesWon: -1 }
                const results = await statsSchema.find({ userID: { $ne: '333664530582208513' } }).sort(sort).limit(10)
                await getTopWins(client, interaction, results, canvas, context, actionRowEnabled)
                winLeaderboard = false
            }
            if (streakBestLeaderboard) {
                reply = await interaction.editReply({ content: 'Fetching...', embeds: [], files: [] })

                // This will first cache all the results, sort descending based on maxStreak, and will limit the results to 10
                // So that it will not exceed the memory limit
                const sort = { maxStreak: -1 }
                const results = await statsSchema.find({ userID: { $ne: '333664530582208513' } }).sort(sort).limit(10)
                await getTopStreak(client, interaction, results, canvas, context, actionRowEnabled)
                streakBestLeaderboard = false
            }
            if (streakCurrentLeaderboard) {
                reply = await interaction.editReply({ content: 'Fetching...', embeds: [], files: [] })

                // This will first cache all the results, sort descending based on currentStreak, and will limit the results to 10
                // So that it will not exceed the memory limit
                const sort = { currentStreak: -1 }
                const results = await statsSchema.find({ userID: { $ne: '333664530582208513' } }).sort(sort).limit(10)
                await getTopStreak(client, interaction, results, canvas, context, actionRowEnabled)
                streakCurrentLeaderboard = false
            }
        })
        collector.on('end', async () => {
            return await interaction.editReply({ components: [] })
        })
    }
}

async function getTopWins(client, interaction, results, canvas, context, actionRow) {
    let background = await loadImage('./Images/background_leaderboard.png')
    context.drawImage(background, 0, 0, 1920, 1097)
    let trophy = await loadImage('./Images/trophy.png')
    context.drawImage(trophy, 34, 29, 110, 110)
    let totalPlayers = await statsSchema.count()
    let count = 3, x = 1920 / 2 - 600, y = 1097 / 2 + 90
    for (let i = 0; i < results.length; ++i) {
        context.fillStyle = WHITE
        context.textAlign = "center"
        context.font = `bold 65px ${FONT_FAMILY_SIGNIKA}`
        if (i === 10) {
            break
        }
        let id = results[i].userID
        const fetchUser = await client.users.fetch(id)
        if (i === 0) {
            context.fillText(`${fetchUser.username}`, canvas.width / 2, canvas.height / 2 - 480)
            let image = await loadImage('./Images/1st_place_medal.png')
            context.drawImage(image, canvas.width / 2 - 100, canvas.height / 2 - 450, 200, 200)
            continue
        }
        if (i === 1) {
            context.fillText(`${fetchUser.username}`, canvas.width / 2 - 500, canvas.height / 2 - 280)
            let image = await loadImage('./Images/2nd_place_medal.png')
            context.drawImage(image, canvas.width / 2 - 600, canvas.height / 2 - 250, 200, 200)
            continue
        }
        if (i === 2) {
            context.fillText(`${fetchUser.username}`, canvas.width / 2 + 500, canvas.height / 2 - 280)
            let image = await loadImage('./Images/3rd_place_medal.png')
            context.drawImage(image, canvas.width / 2 + 400, canvas.height / 2 - 250, 200, 200)
            continue
        }
        count++
        if (count === 10) {
            x += 600
        }
        context.font = `bold 50px ${FONT_FAMILY_SIGNIKA}`
        context.fillText(`${fetchUser.username}`, x, y)
        x += 600
        if (count % 3 == 0) { // decrease height
            y += 180
            x = 1920 / 2 - 600
        }
    }
    const file = new AttachmentBuilder(await canvas.toBuffer(), { name: 'leaderboard.png' })
    const embed = new EmbedBuilder()
        .setImage('attachment://leaderboard.png')
        .setColor(GREEN)
        .setTitle('LEADERBOARD')
        .setFooter({
            text: `Top ${results.length} out of ${totalPlayers} players`
        })
    return await interaction.editReply({ content: '', embeds: [embed], files: [file], components: [actionRow] })
}

async function getTopStreak(client, interaction, results, canvas, context, actionRow) {
    let background = await loadImage('./Images/background_leaderboard.png')
    context.drawImage(background, 0, 0, 1920, 1097)
    let fire = await loadImage('./Images/fire_color.png')
    context.drawImage(fire, 34, 29, 110, 110)
    let totalPlayers = await statsSchema.count()
    let count = 3, x = 1920 / 2 - 600, y = 1097 / 2 + 90
    for (let i = 0; i < results.length; ++i) {
        context.fillStyle = WHITE
        context.textAlign = "center"
        context.font = `bold 65px ${FONT_FAMILY_SIGNIKA}`
        if (i === 10) {
            break
        }
        let id = results[i].userID
        const fetchUser = await client.users.fetch(id)
        if (i === 0) {
            context.fillText(`${fetchUser.username}`, canvas.width / 2, canvas.height / 2 - 480)
            let image = await loadImage('./Images/1st_place_medal.png')
            context.drawImage(image, canvas.width / 2 - 100, canvas.height / 2 - 450, 200, 200)
            continue
        }
        if (i === 1) {
            context.fillText(`${fetchUser.username}`, canvas.width / 2 - 500, canvas.height / 2 - 280)
            let image = await loadImage('./Images/2nd_place_medal.png')
            context.drawImage(image, canvas.width / 2 - 600, canvas.height / 2 - 250, 200, 200)
            continue
        }
        if (i === 2) {
            context.fillText(`${fetchUser.username}`, canvas.width / 2 + 500, canvas.height / 2 - 280)
            let image = await loadImage('./Images/3rd_place_medal.png')
            context.drawImage(image, canvas.width / 2 + 400, canvas.height / 2 - 250, 200, 200)
            continue
        }
        count++
        if (count === 10) {
            x += 600
        }
        context.font = `bold 50px ${FONT_FAMILY_SIGNIKA}`
        context.fillText(`${fetchUser.username}`, x, y)
        x += 600
        if (count % 3 == 0) { // decrease height
            y += 180
            x = 1920 / 2 - 600
        }
    }
    const file = new AttachmentBuilder(await canvas.toBuffer(), { name: 'leaderboard.png' })
    const embed = new EmbedBuilder()
        .setImage('attachment://leaderboard.png')
        .setColor(GREEN)
        .setTitle('LEADERBOARD')
        .setFooter({
            text: `Top ${results.length} out of ${totalPlayers} players`
        })
    return await interaction.editReply({ content: '', embeds: [embed], files: [file], components: [actionRow] })
}