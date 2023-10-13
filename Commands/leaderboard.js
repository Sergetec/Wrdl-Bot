const {
    EmbedBuilder,
    AttachmentBuilder,
} = require('discord.js')
const { Canvas,
    registerFont,
    loadImage,
} = require("canvas")

const GREEN = '#5c8d4d'
const GRAY = '#3a3a3c'
const YELLOW = '#fae92d'
const WHITE = '#ffffff'
registerFont('./Fonts/ARLRDBD.ttf', { family: 'Arial Rounded MT Bold' })
const FONT_FAMILY_ARIAL_ROUNDED = 'Arial Rounded MT Bold'

const canvas = new Canvas(400, 500)
const context = canvas.getContext("2d")

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
        await getTop(client, interaction, results, canvas, context)
    }
}

async function getTop(client, interaction, results, canvas, context) {
    context.fillStyle = GRAY
    context.fillRect(0, 0, canvas.width, canvas.height)
    let top = ''
    let totalPlayers = await statsSchema.count()
    let count = 3, y = 30
    for (let i = 0; i < results.length; ++i) {
        context.fillStyle = WHITE
        context.textAlign = "left"
        context.font = `bold 18px ${FONT_FAMILY_ARIAL_ROUNDED}`
        if (i === 10) {
            break
        }
        let id = results[i].userID
        const fetchUser = await client.users.fetch(id)
        if (i === 0) {
            // top += `:first_place: ${fetchUser.username} | **${results[i].gamesWon} wins**\n`
            context.fillText(`${fetchUser.username}`, 35, y)
            let image = await loadImage('./Images/1st_place_medal_color.png')
            context.fillStyle = GREEN
            await drawMedal_drawWins(context, image, results, y, i)
            y += 50
            continue
        }
        if (i === 1) {
            // top += `:second_place: ${fetchUser.username} | **${results[i].gamesWon} wins**\n`
            context.fillText(`${fetchUser.username}`, 35, y)
            let image = await loadImage('./Images/2nd_place_medal_color.png')
            context.fillStyle = GREEN
            await drawMedal_drawWins(context, image, results, y, i)
            y += 50
            continue
        }
        if (i === 2) {
            // top += `:third_place: ${fetchUser.username} | **${results[i].gamesWon} wins**\n`
            context.fillText(`${fetchUser.username}`, 35, y)
            let image = await loadImage('./Images/3rd_place_medal_color.png')
            context.fillStyle = GREEN
            await drawMedal_drawWins(context, image, results, y, i)
            y += 50
            continue
        }
        count++
        // top += `**${count}**. ${fetchUser.username} | **${results[i].gamesWon} wins**\n`
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
    return await interaction.editReply({ content: '', embeds: [embed], files: [file] })
    // const message = new EmbedBuilder()
    //     .setTitle(`↗️ LEADERBOARD ↗️`)
    //     .setColor('#57F287')
    //     .addFields({
    //         name: 'Top players',
    //         value: `${top}`,
    //     })
    //     .setFooter({
    //         text: `Top ${results.length} out of ${totalPlayers} players`
    //     })
    // return await interaction.editReply({ content: '', embeds: [message] })
}

async function drawMedal_drawWins(context, image, results, y, i) {
    if (image !== null) {
        context.drawImage(image, 10, y - 20, 25, 25)
    }
    context.textAlign = "right"
    context.font = `18px ${FONT_FAMILY_ARIAL_ROUNDED}`
    context.fillText(`${results[i].gamesWon} wins`, canvas.width - 10, y)
}