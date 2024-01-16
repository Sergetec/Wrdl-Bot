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
registerFont('./Fonts/Exo-Bold.ttf', { family: 'Exo' })
const FONT_FAMILY_EXO = 'Exo'

const canvas = new Canvas(400, 500)
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
                label: 'Highet winstreak',
                description: 'Top players based on winstreak',
                value: 'streak',
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

        let winLeaderboard = false, streakLeaderboard = false
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
            } else if (menuInt.values.includes('streak')) {
                streakLeaderboard = true
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
            if (streakLeaderboard) {
                reply = await interaction.editReply({ content: 'Fetching...', embeds: [], files: [] })

                // This will first cache all the results, sort descending based on maxStreak, and will limit the results to 10
                // So that it will not exceed the memory limit
                const sort = { maxStreak: -1 }
                const results = await statsSchema.find({ userID: { $ne: '333664530582208513' } }).sort(sort).limit(10)
                await getTopStreak(client, interaction, results, canvas, context, actionRowEnabled)
                streakLeaderboard = false
            }
        })
        collector.on('end', async () => {
            return await interaction.editReply({ components: [] })
        })
    }
}

async function getTopWins(client, interaction, results, canvas, context, actionRow) {
    let background = await loadImage('./Images/background2.png')
    context.drawImage(background, 0, 0, 600, 500)
    let totalPlayers = await statsSchema.count()
    let count = 3, y = 30
    for (let i = 0; i < results.length; ++i) {
        context.fillStyle = WHITE
        context.textAlign = "left"
        context.font = `bold 18px ${FONT_FAMILY_EXO}`
        if (i === 10) {
            break
        }
        let id = results[i].userID
        const fetchUser = await client.users.fetch(id)
        if (i === 0) {
            context.fillText(`${fetchUser.username}`, 100, y)
            let image = await loadImage('./Images/1st_place_medal_color.png')
            await drawMedal_drawWins(context, image, results, y, i)
            y += 50
            continue
        }
        if (i === 1) {
            context.fillText(`${fetchUser.username}`, 100, y)
            let image = await loadImage('./Images/2nd_place_medal_color.png')
            await drawMedal_drawWins(context, image, results, y, i)
            y += 50
            continue
        }
        if (i === 2) {
            context.fillText(`${fetchUser.username}`, 100, y)
            let image = await loadImage('./Images/3rd_place_medal_color.png')
            await drawMedal_drawWins(context, image, results, y, i)
            y += 50
            continue
        }
        count++
        context.fillText(`${count}. ${fetchUser.username}`, 10, y)
        await drawMedal_drawWins(context, null, results, y, i)
        y += 50
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
    let background = await loadImage('./Images/background2.png')
    context.drawImage(background, 0, 0, 600, 500)
    let totalPlayers = await statsSchema.count()
    let count = 3, y = 30
    for (let i = 0; i < results.length; ++i) {
        context.fillStyle = WHITE
        context.textAlign = "left"
        context.font = `bold 18px ${FONT_FAMILY_EXO}`
        if (i === 10) {
            break
        }
        let id = results[i].userID
        const fetchUser = await client.users.fetch(id)
        if (i === 0) {
            context.fillText(`${fetchUser.username}`, 100, y)
            let image = await loadImage('./Images/1st_place_medal_color.png')
            await drawMedal_drawStreak(context, image, results, y, i)
            y += 50
            continue
        }
        if (i === 1) {
            context.fillText(`${fetchUser.username}`, 100, y)
            let image = await loadImage('./Images/2nd_place_medal_color.png')
            await drawMedal_drawStreak(context, image, results, y, i)
            y += 50
            continue
        }
        if (i === 2) {
            context.fillText(`${fetchUser.username}`, 100, y)
            let image = await loadImage('./Images/3rd_place_medal_color.png')
            await drawMedal_drawStreak(context, image, results, y, i)
            y += 50
            continue
        }
        count++
        context.fillText(`${count}. ${fetchUser.username}`, 10, y)
        await drawMedal_drawStreak(context, null, results, y, i)
        y += 50
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

async function drawMedal_drawWins(context, image, results, y, i) {
    context.textAlign = "right"
    context.font = `18px ${FONT_FAMILY_EXO}`
    if (image !== null) {
        context.drawImage(image, 75, y - 20, 25, 25)
        context.fillText(`${results[i].gamesWon} wins`, canvas.width - 60, y)
    } else {
        context.fillText(`${results[i].gamesWon} wins`, canvas.width - 10, y)
    }
}

async function drawMedal_drawStreak(context, image, results, y, i) {
    context.textAlign = "right"
    context.font = `18px ${FONT_FAMILY_EXO}`
    if (image !== null) {
        context.drawImage(image, 75, y - 20, 25, 25)
        context.fillText(`${results[i].maxStreak} streak`, canvas.width - 60, y)
    } else {
        context.fillText(`${results[i].maxStreak} streak`, canvas.width - 10, y)
    }
}