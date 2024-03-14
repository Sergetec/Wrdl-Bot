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

const canvas = new Canvas(500, 700)
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
                await getTopStreakBest(client, interaction, results, canvas, context, actionRowEnabled)
                streakBestLeaderboard = false
            }
            if (streakCurrentLeaderboard) {
                reply = await interaction.editReply({ content: 'Fetching...', embeds: [], files: [] })

                // This will first cache all the results, sort descending based on currentStreak, and will limit the results to 10
                // So that it will not exceed the memory limit
                const sort = { currentStreak: -1 }
                const results = await statsSchema.find({ userID: { $ne: '333664530582208513' } }).sort(sort).limit(10)
                await getTopStreakCurrent(client, interaction, results, canvas, context, actionRowEnabled)
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
    context.drawImage(background, -400, 0, 900, 700) // x = -400 offset
    // emoji
    let trophy = await loadImage('./Images/trophy.png')
    context.drawImage(trophy, canvas.width / 2 + 95, canvas.height / 2 - 335, 40, 40)
    context.drawImage(trophy, canvas.width / 2 - 130, canvas.height / 2 - 335, 40, 40)
    // title
    context.fillStyle = WHITE
    context.textAlign = "center"
    context.font = `bold 35px ${FONT_FAMILY_SIGNIKA}`
    context.fillText('TOP WINS', canvas.width / 2, canvas.height / 2 - 305)
    // top players
    let totalPlayers = await statsSchema.count()
    let x = canvas.width / 2 - 190, y = canvas.height / 2 - 20
    for (let i = 0; i < results.length; ++i) {
        context.textAlign = "left"
        context.font = `bold 35px ${FONT_FAMILY_SIGNIKA}`
        if (i === 10) {
            break
        }
        let id = results[i].userID
        const fetchUser = await client.users.fetch(id)
        if (i === 0) {
            // username
            context.fillText(`${fetchUser.username}`, canvas.width / 2 - 120, canvas.height / 2 - 220)
            // games won
            context.font = `bold 25px ${FONT_FAMILY_SIGNIKA}`
            context.textAlign = "right"
            context.fillText(`${results[i].gamesWon} wins`, canvas.width - 30, canvas.height / 2 - 220)
            // medal
            let image = await loadImage('./Images/1st_place_medal.png')
            context.drawImage(image, canvas.width / 2 - 180, canvas.height / 2 - 255, 50, 50)
            continue
        }
        if (i === 1) {
            // username
            context.fillText(`${fetchUser.username}`, canvas.width / 2 - 120, canvas.height / 2 - 170)
            // games won
            context.font = `bold 25px ${FONT_FAMILY_SIGNIKA}`
            context.textAlign = "right"
            context.fillText(`${results[i].gamesWon} wins`, canvas.width - 30, canvas.height / 2 - 170)
            // medal
            let image = await loadImage('./Images/2nd_place_medal.png')
            context.drawImage(image, canvas.width / 2 - 180, canvas.height / 2 - 205, 50, 50)
            continue
        }
        if (i === 2) {
            // username
            context.fillText(`${fetchUser.username}`, canvas.width / 2 - 120, canvas.height / 2 - 120)
            // games won
            context.font = `bold 25px ${FONT_FAMILY_SIGNIKA}`
            context.textAlign = "right"
            context.fillText(`${results[i].gamesWon} wins`, canvas.width - 30, canvas.height / 2 - 120)
            // medal
            let image = await loadImage('./Images/3rd_place_medal.png')
            context.drawImage(image, canvas.width / 2 - 180, canvas.height / 2 - 155, 50, 50)
            continue
        }
        context.font = `bold 27px ${FONT_FAMILY_SIGNIKA}` // for top 4...10
        // username
        context.fillText(`${fetchUser.username}`, x, y)
        if (i == 9) {
            context.fillText(`${i + 1}.`, 10, y)
        } else {
            context.fillText(`${i + 1}.`, 25, y)
        }
        // games won
        context.font = `bold 25px ${FONT_FAMILY_SIGNIKA}`
        context.textAlign = "right"
        context.fillText(`${results[i].gamesWon} wins`, canvas.width - 30, y)
        y += 55
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

async function getTopStreakBest(client, interaction, results, canvas, context, actionRow) {
    let background = await loadImage('./Images/background_leaderboard.png')
    context.drawImage(background, -400, 0, 900, 700) // x = -400 offset
    // emoji
    let fire = await loadImage('./Images/fire_color.png')
    let sparkles = await loadImage('./Images/sparkles_color.png')
    context.drawImage(fire, canvas.width / 2 + 140, canvas.height / 2 - 335, 40, 40)
    context.drawImage(fire, canvas.width / 2 - 175, canvas.height / 2 - 335, 40, 40)
    context.drawImage(sparkles, canvas.width / 2 - 147, canvas.height / 2 - 340, 20, 20)
    context.drawImage(sparkles, canvas.width / 2 + 168, canvas.height / 2 - 340, 20, 20)
    // title
    context.fillStyle = WHITE
    context.textAlign = "center"
    context.font = `bold 33px ${FONT_FAMILY_SIGNIKA}`
    context.fillText('TOP BEST STREAK', canvas.width / 2, canvas.height / 2 - 305)
    // top players
    let totalPlayers = await statsSchema.count()
    let x = canvas.width / 2 - 190, y = canvas.height / 2 - 20
    for (let i = 0; i < results.length; ++i) {
        context.textAlign = "left"
        context.font = `bold 35px ${FONT_FAMILY_SIGNIKA}`
        if (i === 10) {
            break
        }
        let id = results[i].userID
        const fetchUser = await client.users.fetch(id)
        if (i === 0) {
            // username
            context.fillText(`${fetchUser.username}`, canvas.width / 2 - 120, canvas.height / 2 - 220)
            // max streak
            context.font = `bold 25px ${FONT_FAMILY_SIGNIKA}`
            context.textAlign = "right"
            context.fillText(`${results[i].maxStreak} streak`, canvas.width - 30, canvas.height / 2 - 220)
            // medal
            let image = await loadImage('./Images/1st_place_medal.png')
            context.drawImage(image, canvas.width / 2 - 180, canvas.height / 2 - 255, 50, 50)
            continue
        }
        if (i === 1) {
            // username
            context.fillText(`${fetchUser.username}`, canvas.width / 2 - 120, canvas.height / 2 - 170)
            // max streak
            context.font = `bold 25px ${FONT_FAMILY_SIGNIKA}`
            context.textAlign = "right"
            context.fillText(`${results[i].maxStreak} streak`, canvas.width - 30, canvas.height / 2 - 170)
            // medal
            let image = await loadImage('./Images/2nd_place_medal.png')
            context.drawImage(image, canvas.width / 2 - 180, canvas.height / 2 - 205, 50, 50)
            continue
        }
        if (i === 2) {
            // username
            context.fillText(`${fetchUser.username}`, canvas.width / 2 - 120, canvas.height / 2 - 120)
            // max streak
            context.font = `bold 25px ${FONT_FAMILY_SIGNIKA}`
            context.textAlign = "right"
            context.fillText(`${results[i].maxStreak} streak`, canvas.width - 30, canvas.height / 2 - 120)
            // medal
            let image = await loadImage('./Images/3rd_place_medal.png')
            context.drawImage(image, canvas.width / 2 - 180, canvas.height / 2 - 155, 50, 50)
            continue
        }
        context.font = `bold 27px ${FONT_FAMILY_SIGNIKA}` // for top 4...10
        // username
        context.fillText(`${fetchUser.username}`, x, y)
        if (i == 9) {
            context.fillText(`${i + 1}.`, 10, y)
        } else {
            context.fillText(`${i + 1}.`, 25, y)
        }
        // max streak
        context.font = `bold 25px ${FONT_FAMILY_SIGNIKA}` // for top 4...10
        context.textAlign = "right"
        context.fillText(`${results[i].maxStreak} streak`, canvas.width - 30, y)
        y += 55
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

async function getTopStreakCurrent(client, interaction, results, canvas, context, actionRow) {
    let background = await loadImage('./Images/background_leaderboard.png')
    context.drawImage(background, -400, 0, 900, 700) // x = -400 offset
    // emoji
    let fire = await loadImage('./Images/fire_color.png')
    context.drawImage(fire, canvas.width / 2 + 170, canvas.height / 2 - 335, 40, 40)
    context.drawImage(fire, canvas.width / 2 - 205, canvas.height / 2 - 335, 40, 40)
    // title
    context.fillStyle = WHITE
    context.textAlign = "center"
    context.font = `bold 33px ${FONT_FAMILY_SIGNIKA}`
    context.fillText('TOP CURRENT STREAK', canvas.width / 2, canvas.height / 2 - 305)
    // top players
    let totalPlayers = await statsSchema.count()
    let x = canvas.width / 2 - 190, y = canvas.height / 2 - 20
    for (let i = 0; i < results.length; ++i) {
        context.textAlign = "left"
        context.font = `bold 35px ${FONT_FAMILY_SIGNIKA}`
        if (i === 10) {
            break
        }
        let id = results[i].userID
        const fetchUser = await client.users.fetch(id)
        if (i === 0) {
            // username
            context.fillText(`${fetchUser.username}`, canvas.width / 2 - 120, canvas.height / 2 - 220)
            // current streak
            context.font = `bold 25px ${FONT_FAMILY_SIGNIKA}`
            context.textAlign = "right"
            context.fillText(`${results[i].currentStreak} streak`, canvas.width - 30, canvas.height / 2 - 220)
            // medal
            let image = await loadImage('./Images/1st_place_medal.png')
            context.drawImage(image, canvas.width / 2 - 180, canvas.height / 2 - 255, 50, 50)
            continue
        }
        if (i === 1) {
            // username
            context.fillText(`${fetchUser.username}`, canvas.width / 2 - 120, canvas.height / 2 - 170)
            // current streak
            context.font = `bold 25px ${FONT_FAMILY_SIGNIKA}`
            context.textAlign = "right"
            context.fillText(`${results[i].currentStreak} streak`, canvas.width - 30, canvas.height / 2 - 170)
            // medal
            let image = await loadImage('./Images/2nd_place_medal.png')
            context.drawImage(image, canvas.width / 2 - 180, canvas.height / 2 - 205, 50, 50)
            continue
        }
        if (i === 2) {
            // username
            context.fillText(`${fetchUser.username}`, canvas.width / 2 - 120, canvas.height / 2 - 120)
            // current streak
            context.font = `bold 25px ${FONT_FAMILY_SIGNIKA}`
            context.textAlign = "right"
            context.fillText(`${results[i].currentStreak} streak`, canvas.width - 30, canvas.height / 2 - 120)
            // medal
            let image = await loadImage('./Images/3rd_place_medal.png')
            context.drawImage(image, canvas.width / 2 - 180, canvas.height / 2 - 155, 50, 50)
            continue
        }
        context.font = `bold 27px ${FONT_FAMILY_SIGNIKA}` // for top 4...10
        // username
        context.fillText(`${fetchUser.username}`, x, y)
        if (i == 9) {
            context.fillText(`${i + 1}.`, 10, y)
        } else {
            context.fillText(`${i + 1}.`, 25, y)
        }
        // current streak
        context.font = `bold 25px ${FONT_FAMILY_SIGNIKA}` // for top 4...10
        context.textAlign = "right"
        context.fillText(`${results[i].currentStreak} streak`, canvas.width - 30, y)
        y += 55
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