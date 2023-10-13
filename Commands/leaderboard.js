const {
    EmbedBuilder,
    AttachmentBuilder,
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
        await interaction.reply({ content: 'Fetching...' })

        //This will first cache all the results, sort descending based on gamesWon, and will limit the results to 10
        //So that it will not exceed the memory limit
        const sort = { gamesWon: -1 }
        const results = await statsSchema.find({ userID: { $ne: '333664530582208513' } }).sort(sort).limit(10)
        await getTop(client, interaction, results, canvas, context)
    }
}

async function getTop(client, interaction, results, canvas, context) {
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
    return await interaction.editReply({ content: '', embeds: [embed], files: [file] })
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