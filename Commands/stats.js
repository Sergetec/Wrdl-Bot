const {
    EmbedBuilder,
    ApplicationCommandOptionType,
    AttachmentBuilder,
} = require('discord.js')
const { Canvas,
    registerFont,
} = require("canvas")

const GREEN = '#5c8d4d'
const GRAY = '#3a3a3c'
const LIGHT_GRAY = '#818384'
const WHITE = '#ffffff'
registerFont('./Fonts/micross.ttf', { family: 'Microsoft Sans Serif' })
// registerFont('./Fonts/ARLRDBD.ttf', { family: 'Arial Rounded MT Bold'} )
const FONT_FAMILY_ARIAL_ROUNDED = 'Microsoft Sans Serif'
const FONT_FAMILY_SANS_SERIF = 'Microsoft Sans Serif'

const canvas = new Canvas(600, 400)
const context = canvas.getContext("2d")

const statsSchema = require('../Models/statsSchema')

module.exports = {
    name: 'stats',
    description: 'Shows someone\'s Wordle stats',
    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'The user of which to display stats',
            required: false,
        },
    ],
    async execute(client, interaction) {
        const user = interaction.options.getUser('user') || interaction.user
        const userID = user.id

        let currentStreak = 0, maxStreak = 0
        let gamesTotal = 0, gamesWon = 0, gamesLost = 0, winRate = ""
        let oneGuess = 0, twoGuess = 0, threeGuess = 0, fourGuess = 0, fiveGuess = 0, sixGuess = 0
        const query = {
            userID: userID,
        }
        const results = await statsSchema.findOne(query)
        if (results !== null) {
            gamesTotal = results.gamesTotal
            gamesWon = results.gamesWon
            gamesLost = results.gamesLost
            oneGuess = results.oneGuess
            twoGuess = results.twoGuess
            threeGuess = results.threeGuess
            fourGuess = results.fourGuess
            fiveGuess = results.fiveGuess
            sixGuess = results.sixGuess
            maxStreak = Math.max(maxStreak, results.maxStreak)
            currentStreak = results.currentStreak
            winRate = results.winRate

            context.fillStyle = GRAY
            context.fillRect(0, 0, canvas.width, canvas.height)
            const statOffset = 250
            renderStat(gamesTotal, "Total Games\n", canvas.width / 2 - statOffset)
            renderStat(gamesWon, "Words Solved\n", canvas.width / 2 - (statOffset * 3) / 5)
            renderStat(gamesLost, "Words Unsolved\n", canvas.width / 2 - statOffset / 5)
            renderStat(winRate + "%", "Winning Rate\n", canvas.width / 2 + statOffset / 5)
            renderStat(currentStreak, "Current Streak\n", canvas.width / 2 + (statOffset * 3) / 5)
            renderStat(maxStreak, "Best Streak\n", canvas.width / 2 + statOffset)
            context.fillStyle = WHITE
            context.font = `26px ${FONT_FAMILY_ARIAL_ROUNDED}`
            context.fillText("GUESS DISTRIBUTION", canvas.width / 2, 195)

            // Distance from edge of bars to the vertical center.
            const barOffset = 250
            // Space reserved for the bar labels
            const labelSpace = 12
            const bars = [results.oneGuess, results.twoGuess, results.threeGuess, results.fourGuess, results.fiveGuess, results.sixGuess]
            const max = Math.max(...bars)
            const scale = (barOffset * 2 - labelSpace) / max

            for (let i = 0; i < bars.length; ++i) {
                const y = 250 + i * 23
                context.fillStyle = bars[i] === 0 ? LIGHT_GRAY : GREEN
                context.fillRect(
                    canvas.width / 2 - barOffset + labelSpace,
                    y,
                    Math.max(bars[i] * scale, 45),
                    18
                )

                context.fillStyle = WHITE
                context.textAlign = "left"
                context.font = `bold 16px ${FONT_FAMILY_SANS_SERIF}`
                context.fillText(`${i + 1}`, canvas.width / 2 - barOffset, y + 2)

                context.textAlign = "right"
                context.fillText(
                    `${bars[i]}`,
                    Math.max(
                        canvas.width / 2 - barOffset + labelSpace + bars[i] * scale - 8,
                        canvas.width / 2 - barOffset + labelSpace + 37
                    ),
                    y + 2
                )
            }

            const file = new AttachmentBuilder(await canvas.toBuffer(), { name: 'stats.png' })
            const embed = new EmbedBuilder()
                .setImage('attachment://stats.png')
                .setTitle(`${user.displayName}'s wordle stats`)
                .setColor(GREEN)
            return await interaction.reply({ embeds: [embed], files: [file] })
        } else {
            const message = new EmbedBuilder()
                .setTitle(`📊 WRDL STATISTICS 📊`)
                .setColor('#ED4245')
                .setThumbnail(user.avatarURL({ dynamic: true, size: 512 }))
                .setDescription(`❓ <@${user.id}> haven\'t played a game yet.`)

            return await interaction.reply({ embeds: [message] })
        }
    }
}

function renderStat(value, label, x) {
    context.textBaseline = "top"
    context.textAlign = "center"
    context.fillStyle = WHITE

    context.font = `bold 26px ${FONT_FAMILY_SANS_SERIF}`
    context.fillText(`${value}`, x, 26)

    context.font = `12px ${FONT_FAMILY_ARIAL_ROUNDED}`
    let y = 60
    for (const row of label.split("\n")) {
        context.fillText(row, x, y)
        y += 15
    }
}