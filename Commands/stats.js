const {
    EmbedBuilder,
    ApplicationCommandOptionType,
    AttachmentBuilder,
} = require('discord.js')
const { Canvas,
    registerFont,
    loadImage,
} = require('canvas')

const GREEN = '#5c8d4d'
const DARK_GRAY = '#313030'
const WHITE = '#ffffff'
registerFont('./Fonts/Exo-Bold.ttf', { family: 'Exo' })
registerFont('./Fonts/ARLRDBD.ttf', { family: 'Arial Rounded MT Bold' })
const FONT_FAMILY_EXO = 'Exo'
const FONT_FAMILY_ARIAL_ROUNDED = 'Arial Rounded MT Bold'

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

            let background = await loadImage('./Images/background1.png')
            context.drawImage(background, 0, 0, 600, 400)
            const statOffset = 250
            let image = await loadImage('./Images/globe_showing_americas_color.png')
            renderStat(gamesTotal, "Total\nGames", canvas.width / 2 - statOffset, image, 40)
            image = await loadImage('./Images/party_popper_color.png')
            renderStat(gamesWon, "Words\nSolved", canvas.width / 2 - (statOffset * 3) / 5, image, 140)
            image = await loadImage('./Images/chart_decreasing_color.png')
            renderStat(gamesLost, "Words\nUnsolved", canvas.width / 2 - statOffset / 5, image, 240)
            image = await loadImage('./Images/memo_color.png')
            renderStat(winRate + "%", "Winning\nRate", canvas.width / 2 + statOffset / 5, image, 340)
            image = await loadImage('./Images/fire_color.png')
            renderStat(currentStreak, "Current\nStreak", canvas.width / 2 + (statOffset * 3) / 5, image, 440)
            image = await loadImage('./Images/fire_color.png')
            renderStat(maxStreak, "Best\nStreak", canvas.width / 2 + statOffset, image, 540)
            image = await loadImage('./Images/sparkles_color.png')
            context.drawImage(image, 555, 95, 15, 15)
            context.fillStyle = WHITE
            context.font = `bold 26px ${FONT_FAMILY_EXO}`
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
                if (bars[i] !== 0) {
                    context.fillStyle = GREEN
                    context.fillRect(
                        canvas.width / 2 - barOffset + labelSpace,
                        y,
                        bars[i] * scale,
                        18
                    )
                } else {
                    context.fillStyle = DARK_GRAY
                    context.fillRect(
                        canvas.width / 2 - barOffset + labelSpace,
                        y,
                        45,
                        18
                    )
                }

                context.fillStyle = WHITE
                context.textAlign = "left"
                context.font = `bold 16px ${FONT_FAMILY_ARIAL_ROUNDED}`
                context.fillText(`${i + 1}`, canvas.width / 2 - barOffset - 1, y - 1)

                if (bars[i] !== 0) {
                    context.fillStyle = WHITE
                    context.textAlign = "right"
                    context.fillText(
                        `${bars[i]}`,
                        Math.max(
                            canvas.width / 2 - barOffset + labelSpace + bars[i] * scale - 8,
                            canvas.width / 2 - barOffset + labelSpace + 37
                        ),
                        y - 1
                    )
                } else {
                    context.fillStyle = WHITE
                    context.textAlign = "right"
                    context.fillText(
                        `${bars[i]}`,
                        canvas.width / 2 - barOffset + labelSpace + 37,
                        y - 1
                    )
                }
            }

            const file = new AttachmentBuilder(await canvas.toBuffer(), { name: 'stats.png' })
            const embed = new EmbedBuilder()
                .setImage('attachment://stats.png')
                .setColor(GREEN)
                .setAuthor({ name: `${user.displayName}'s wordle stats`, iconURL: `${user.displayAvatarURL({ dynamic: true })}` })
            return await interaction.reply({ embeds: [embed], files: [file] })
        } else {
            const message = new EmbedBuilder()
                .setColor('#ED4245')
                .setAuthor({ name: `${user.displayName}'s wordle stats`, iconURL: `${user.displayAvatarURL({ dynamic: true })}` })
                .setDescription(`❓ ${user.displayName} hasn\'t played a game yet`)

            return await interaction.reply({ embeds: [message] })
        }
    }
}

function renderStat(value, label, x, i, ix) {
    context.drawImage(i, ix, 101, 20, 20)
    context.textBaseline = "top"
    context.textAlign = "center"
    context.fillStyle = WHITE

    context.font = `bold 26px ${FONT_FAMILY_EXO}`
    context.fillText(`${value}`, x, 26)

    context.font = `bold 14px ${FONT_FAMILY_EXO}`
    let y = 60
    for (const row of label.split("\n")) {
        context.fillText(row, x, y)
        y += 15
    }
}