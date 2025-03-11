const {
    EmbedBuilder,
    ApplicationCommandOptionType,
    AttachmentBuilder,
} = require('discord.js')
const gamesSchema = require('../Models/gamesSchema')
const statsSchema = require('../Models/statsSchema')
const fs = require('node:fs')
const {
    Canvas,
    registerFont,
} = require('canvas')

const GREEN = '#5c8d4d'
const DARKER_GRAY = '#262626'
const DARKER_GRAY_KEYBOARD = '#363434'
const GRAY = '#5d5a5a'
const WHITE = '#ffffff'
const YELLOW = '#dabd00'
const RED = '#ED4245'
registerFont('./Fonts/Exo-Bold.ttf', { family: 'Exo' })
registerFont('./Fonts/ARLRDBD.ttf', { family: 'Arial Rounded MT Bold' })
const FONT_FAMILY_ARIAL_ROUNDED = 'Arial Rounded MT Bold'

module.exports = {
    name: 'guess',
    description: 'Make your guess',
    options: [
        {
            name: 'word',
            type: ApplicationCommandOptionType.String,
            description: 'Your guess',
            required: true,
        },
    ],
    async execute(client, interaction) {
        const userID = interaction.user.id
        const guildID = interaction.guild.id
        const query = {
            userID: userID,
        }
        const result = await gamesSchema.findOne(query)
        if (!result) {
            const message = new EmbedBuilder()
                .setTitle('Wordle Game')
                .setColor(RED)
                .setDescription('❗ **You have not started a game yet**')
            return await interaction.reply({ embeds: [message], ephemeral: true })
        } else {
            let replyMessage = result.replyMessage
            const guessedWord = interaction.options.getString('word').toLowerCase()
            if (hasWhiteSpaces(guessedWord)) {
                const message = new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor(RED)
                    .setDescription('❗Your guess must **not contain spaces**')
                return await interaction.reply({ embeds: [message], ephemeral: true })
            }
            if (guessedWord.length !== 5) {
                const message = new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor(RED)
                    .setDescription('❗Your guess must be a **5 character word**')
                return await interaction.reply({ embeds: [message], ephemeral: true })
            }
            if (hasNumbers(guessedWord)) {
                const message = new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor(RED)
                    .setDescription('❗You **cannot use numbers**')
                return await interaction.reply({ embeds: [message], ephemeral: true })
            }
            let count = result.guesses
            const wordToGuess = result.word
            const alphabetCurr = result.alphabet.split(' ')
            const wordList = new Set(fs.readFileSync(`Words/valid_${result.language}.txt`, 'utf-8').split(/\r?\n/))
            
            // Check if guessed word is valid
            if (!wordList.has(guessedWord.trim())) {
                const message = new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor(RED)
                    .setDescription(`❗**${guessedWord}** is not in the words list`)
                return await interaction.reply({ embeds: [message], ephemeral: true })
            }

            count++;

            // Track letter occurrences in wordToGuess
            const letterCount = {}
            for (const char of wordToGuess) {
                letterCount[char] = (letterCount[char] || 0) + 1
            }

            // Initialize reply with all gray
            let reply = Array(5).fill(null)
            const qwerty = "qwertyuiopasdfghjklzxcvbnm"

            // Identify green letters
            const greenFound = Array(5).fill(false)
            for (let i = 0; i < 5; i++) {
                if (guessedWord[i] === wordToGuess[i]) {
                    reply[i] = `${guessedWord[i].toUpperCase()}_green `
                    greenFound[i] = true
                    letterCount[guessedWord[i]]--
                    alphabetCurr[qwerty.indexOf(guessedWord[i])] = `${guessedWord[i].toUpperCase()}_green`
                }
            }

            // Identify yellow and gray letters
            for (let i = 0; i < 5; i++) {
                if (!greenFound[i]) {
                    if (wordToGuess.includes(guessedWord[i]) && letterCount[guessedWord[i]] > 0) {
                        reply[i] = `${guessedWord[i].toUpperCase()}_yellow `
                        letterCount[guessedWord[i]]--
                        const index = qwerty.indexOf(guessedWord[i])
                        if (!alphabetCurr[index].includes('_green')) {
                            alphabetCurr[index] = `${guessedWord[i].toUpperCase()}_yellow`
                        }
                    } else {
                        reply[i] = `${guessedWord[i].toUpperCase()}_gray `
                        const index = qwerty.indexOf(guessedWord[i])
                        if (!alphabetCurr[index].includes('_green') && !alphabetCurr[index].includes('_yellow')) {
                            alphabetCurr[index] = `${guessedWord[i].toUpperCase()}_darker_gray`
                        }
                    }
                }
            }

            // Check for perfect match
            let perfectMatch = guessedWord === wordToGuess

            let canvas = new Canvas(400, 600)
            let context = canvas.getContext("2d")
            context.fillStyle = DARKER_GRAY
            context.fillRect(0, 0, canvas.width, canvas.height)
            context.strokeStyle = GRAY
            context.lineWidth = 2

            // squares
            context.fillStyle = GRAY
            for (let i = 1; i <= 6; ++i) {
                for (let j = 1; j <= 5; ++j) {
                    context.strokeRect(j * 67 - 30, i * 67 - 30, 59, 59)
                }
            }

            // rendering guesses
            for (let i = 0; i < 5; ++i) {
                replyMessage += reply[i]
            }
            replyMessage += '\n'
            context.font = `40px ${FONT_FAMILY_ARIAL_ROUNDED}`
            context.textAlign = "center"
            let replyMessage_aux = replyMessage // don't mess up the original replyMessage
            for (let i = 1; i <= count; ++i) {
                let position = replyMessage_aux.indexOf('\n') // index where '\n' is found
                let row = replyMessage_aux.substring(0, position - 1) // don't add the '\n'
                row = row.split(' ')
                if (i === 1) { // remove the space at the start that it comes with the initialization
                    row.shift()
                }
                for (let j = 1; j <= 5; ++j) {
                    let letter = row[j - 1].slice(0, 1)
                    let color = row[j - 1].slice(2)
                    switch (color) {
                        case 'gray':
                            context.fillStyle = GRAY
                            context.fillRect(j * 67 - 30, i * 67 - 30, 59, 59)
                            break
                        case 'yellow':
                            context.fillStyle = YELLOW
                            context.fillRect(j * 67 - 30, i * 67 - 30, 59, 59)
                            break
                        case 'green':
                            context.fillStyle = GREEN
                            context.fillRect(j * 67 - 30, i * 67 - 30, 59, 59)
                            break
                    }
                    context.fillStyle = WHITE
                    context.fillText(
                        letter,
                        j * 67,
                        i * 67 + 15,
                    )
                }
                replyMessage_aux = replyMessage_aux.slice(position + 1) // also slice the '\n'
            }
            const query2 = {
                guildID: guildID,
                userID: userID,
            }

            // rendering keyboard
            const keys1 = [
                "q", "w", "e", "r", "t", "y", "u", "i", "o", "p"
            ]
            const keys2 = [
                "a", "s", "d", "f", "g", "h", "j", "k", "l"
            ]
            const keys3 = [
                "z", "x", "c", "v", "b", "n", "m"
            ]
            context.font = `20px ${FONT_FAMILY_ARIAL_ROUNDED}`
            let startX = 35, startY = 450, ind = 0, indLetters = 0
            for (let j = 0; j <= 2; ++j) {
                if (j === 0) {
                    for (let i = 0; i <= 9; ++i) {
                        if (i === 0) {
                            alphabetNew = alphabetCurr[indLetters] + ' '
                        } else {
                            if (alphabetCurr[indLetters] === '') {
                                continue
                            }
                            alphabetNew += alphabetCurr[indLetters] + ' '
                        }
                        let color = alphabetCurr[indLetters].slice(2)
                        indLetters++
                        switch (color) {
                            case 'gray':
                                context.fillStyle = GRAY
                                break
                            case 'darker_gray':
                                context.fillStyle = DARKER_GRAY_KEYBOARD
                                break
                            case 'yellow':
                                context.fillStyle = YELLOW
                                break
                            case 'green':
                                context.fillStyle = GREEN
                                break
                        }
                        roundRect(startX + i * 32 + 10, startY + ind * 45 + 10, 25, 35, 5, context)
                        context.fillStyle = WHITE
                        context.fillText(
                            keys1[i].toUpperCase(),
                            startX + i * 32 + 22,
                            startY + ind * 45 + 32,
                        )
                    }
                } else if (j === 1) {
                    for (let i = 0; i <= 8; ++i) {
                        if (alphabetCurr[indLetters] === '') {
                            continue
                        }
                        alphabetNew += alphabetCurr[indLetters] + ' '
                        let color = alphabetCurr[indLetters].slice(2)
                        indLetters++
                        switch (color) {
                            case 'gray':
                                context.fillStyle = GRAY
                                break
                            case 'darker_gray':
                                context.fillStyle = DARKER_GRAY_KEYBOARD
                                break
                            case 'yellow':
                                context.fillStyle = YELLOW
                                break
                            case 'green':
                                context.fillStyle = GREEN
                                break
                        }
                        roundRect(startX + i * 32 + 30, startY + ind * 45 + 10, 25, 35, 5, context)
                        context.fillStyle = WHITE
                        context.fillText(
                            keys2[i].toUpperCase(),
                            startX + i * 32 + 42,
                            startY + ind * 45 + 32,
                        )
                    }
                } else if (j === 2) {
                    for (let i = 0; i <= 6; ++i) {
                        if (alphabetCurr[indLetters] === '') {
                            continue
                        }
                        alphabetNew += alphabetCurr[indLetters] + ' '
                        let color = alphabetCurr[indLetters].slice(2)
                        indLetters++
                        switch (color) {
                            case 'gray':
                                context.fillStyle = GRAY
                                break
                            case 'darker_gray':
                                context.fillStyle = DARKER_GRAY_KEYBOARD
                                break
                            case 'yellow':
                                context.fillStyle = YELLOW
                                break
                            case 'green':
                                context.fillStyle = GREEN
                                break
                        }
                        roundRect(startX + i * 32 + 60, startY + ind * 45 + 10, 25, 35, 5, context)
                        context.fillStyle = WHITE
                        context.fillText(
                            keys3[i].toUpperCase(),
                            startX + i * 32 + 72,
                            startY + ind * 45 + 32,
                        )
                    }
                }
                ind++;
            }

            const file = new AttachmentBuilder(await canvas.toBuffer(), { name: 'guess.png' })
            let schema
            if (perfectMatch) {
                await gamesSchema.deleteMany(query2)
                const embed = new EmbedBuilder()
                    .setImage('attachment://guess.png')
                    .setColor(GREEN)
                    .setTitle('Wordle Game')
                    .setDescription(
                        `🎉 You won 🎉
                        The word was **${wordToGuess}**
                        Wanna play again? \`/start\``
                    )
                    .setFooter({
                        text: `${count} / 6`
                    })
                schema = await statsSchema.findOne(query2)
                if (schema) {
                    schema.gamesWon = schema.gamesWon + 1
                    schema.winRate = Math.trunc(schema.gamesWon / schema.gamesTotal * 100)
                    let currentStreak = schema.currentStreak, maxStreak = schema.maxStreak
                    currentStreak++
                    schema.currentStreak = currentStreak
                    maxStreak = Math.max(maxStreak, currentStreak)
                    schema.maxStreak = maxStreak
                    switch (count) {
                        case 1:
                            schema.oneGuess = schema.oneGuess + 1
                            break
                        case 2:
                            schema.twoGuess = schema.twoGuess + 1
                            break
                        case 3:
                            schema.threeGuess = schema.threeGuess + 1
                            break
                        case 4:
                            schema.fourGuess = schema.fourGuess + 1
                            break
                        case 5:
                            schema.fiveGuess = schema.fiveGuess + 1
                            break
                        case 6:
                            schema.sixGuess = schema.sixGuess + 1
                            break
                    }
                    await schema.save()
                }
                await interaction.reply({ embeds: [embed], files: [file] })
            } else if (count >= 6) {
                await gamesSchema.deleteMany(query2)
                const embed = new EmbedBuilder()
                    .setImage('attachment://guess.png')
                    .setColor(RED)
                    .setTitle('Wordle Game')
                    .setDescription(
                        `❗ You lost ❗
                        The word was **${wordToGuess}**
                        Wanna play again? \`/start\``
                    )
                    .setFooter({
                        text: `${count} / 6`
                    })
                schema = await statsSchema.findOne(query2)
                schema.gamesLost = schema.gamesLost + 1
                schema.winRate = Math.trunc(schema.gamesWon / schema.gamesTotal * 100)

                // Check if user has voted in the last 12 hours
                const apiUrl = `https://top.gg/api/bots/1011006137690239059/check?userId=${userID}`
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        Authorization: process.env.TOPGG_TOKEN,
                    },
                })
                const data = await response.json()
                if (response.ok) {
                    if (!data.voted) { // not voted
                        schema.currentStreak = 0 // reset the current streak
                        if (schema.gamesWon % 7 === 0) {
                            setTimeout(async function () {
                                const voteEmbed = new EmbedBuilder()
                                    .setColor(RED)
                                    .setTitle('🔔 Heads up, you lost your current streak!')
                                    .setDescription(`🚀 At the beginning of each new month, the current streak will reset for all players. However: by supporting the bot through voting, you unlock a valuable advantage!\n\n**A 12-hour immunity period against streak resets.** This exclusive benefit **doesn't extend to the global reset** but empowers you to ascend the leaderboard with confidence.\n\n🌟Support us by voting the bot on Top.gg: https://top.gg/bot/1011006137690239059/vote 🗳️`)
                                return await interaction.followUp({ embeds: [voteEmbed], ephemeral: true })
                            }, 3 * 1000)
                        }
                    } else { // voted
                        if (schema.gamesWon % 3 === 0) {
                            setTimeout(async function () {
                                const voteEmbed = new EmbedBuilder()
                                    .setColor(GREEN)
                                    .setTitle('🔔 Yoo-hoo your current streak is saved!')
                                    .setDescription(`🚀 Thank you for supporting us! Rest assured, we're committed to our promises, ensuring that you haven't lost your current streak!`)
                                return await interaction.followUp({ embeds: [voteEmbed], ephemeral: true })
                            }, 3 * 1000)
                        }
                    }
                } else {
                    console.log(`Error checking vote status: ${data.error}`)
                }
                await schema.save()
                return await interaction.reply({ embeds: [embed], files: [file] })
            } else {

                // update expire time
                let dt = new Date()
                dt = new Date(dt.getTime() + 5 * 60 * 1000)

                let schema2 = await gamesSchema.findOne(query)
                if (schema2) {
                    schema2.expires = dt
                    await schema2.save()
                }
                schema = await gamesSchema.findOne(query2)
                if (schema) {
                    schema.guesses = count
                    schema.replyMessage = replyMessage
                    schema.alphabet = alphabetNew
                    await schema.save()
                }
                const embed = new EmbedBuilder()
                    .setImage('attachment://guess.png')
                    .setColor(GREEN)
                    .setTitle('Wordle Game')
                    .setFooter({
                        text: `${count} / 6`
                    })
                return await interaction.reply({ embeds: [embed], files: [file] })
            }
        }
    }
}

function hasWhiteSpaces(s) {
    return /\s/g.test(s)
}

function hasNumbers(s) {
    return /\d/.test(s)
}

function roundRect(x, y, w, h, r, context) {
    context.beginPath()
    context.arc(x + r, y + r, r, Math.PI, (Math.PI * 3) / 2)
    context.arc(x + w - r, y + r, r, (Math.PI * 3) / 2, 0)
    context.arc(x + w - r, y + h - r, r, 0, Math.PI / 2)
    context.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI)
    context.closePath()
    context.fill()
}