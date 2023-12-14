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
            // guildID: guildID,
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
            let alphabetString = ''
            alphabetString = result.alphabet
            let alphabetCurr = alphabetString.split(' ')
            let count = result.guesses
            let wordToGuess = result.word
            let guessedWord = interaction.options.getString('word')
            if (hasWhiteSpace(guessedWord)) {
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
                    .setDescription('❗ Your guess must be a **5 character word**')
                return await interaction.reply({ embeds: [message], ephemeral: true })
            }
            if (hasNumber(guessedWord)) {
                const message = new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor(RED)
                    .setDescription('❗You **cannot use numbers**')
                return await interaction.reply({ embeds: [message], ephemeral: true })
            }
            count++
            let charsGuessed = ''
            // copying
            for (let i = 0; i < 5; ++i) {
                charsGuessed += guessedWord[i].toLowerCase()
            }

            // check for valid word
            let found
            let auxChars
            let fileWords = fs.readFileSync(`Words/valid_${result.language}.txt`, 'utf-8')
            const wordArray = fileWords.split('\n')
            for (let i = 0; i < wordArray.length; ++i) {
                let word = wordArray[i]
                auxChars = ''
                for (let j = 0; j < 5; ++j) {
                    auxChars += word[j]
                }
                found = true
                for (let k = 0; k < 5; ++k) {
                    if (charsGuessed[k] !== auxChars[k]) {
                        found = false
                    }
                }
                if (found === true) {
                    break
                }
            }
            if (!found) {
                const message = new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor(RED)
                    .setDescription(`❗**${charsGuessed}** is not in the words list`)
                return await interaction.reply({ embeds: [message], ephemeral: true })
            }

            // the word is valid stored in charsGuessed[]

            let alphabetNew
            // current line
            let reply = ['']
            // counter for index
            let counter
            // all are gray in the beginning
            let wordsRepeated = []
            for (let i = 97; i <= 122; ++i) {
                wordsRepeated[i] = 0
            }
            for (let i = 0; i < 5; ++i) {
                counter = wordToGuess[i].charCodeAt(0)
                wordsRepeated[counter] = wordsRepeated[counter] + 1
                if (charsGuessed[i] === 'a') {
                    reply[i] = 'A_gray '
                }
                if (charsGuessed[i] === 'b') {
                    reply[i] = 'B_gray '
                }
                if (charsGuessed[i] === 'c') {
                    reply[i] = 'C_gray '
                }
                if (charsGuessed[i] === 'd') {
                    reply[i] = 'D_gray '
                }
                if (charsGuessed[i] === 'e') {
                    reply[i] = 'E_gray '
                }
                if (charsGuessed[i] === 'f') {
                    reply[i] = 'F_gray '
                }
                if (charsGuessed[i] === 'g') {
                    reply[i] = 'G_gray '
                }
                if (charsGuessed[i] === 'h') {
                    reply[i] = 'H_gray '
                }
                if (charsGuessed[i] === 'i') {
                    reply[i] = 'I_gray '
                }
                if (charsGuessed[i] === 'j') {
                    reply[i] = 'J_gray '
                }
                if (charsGuessed[i] === 'k') {
                    reply[i] = 'K_gray '
                }
                if (charsGuessed[i] === 'l') {
                    reply[i] = 'L_gray '
                }
                if (charsGuessed[i] === 'm') {
                    reply[i] = 'M_gray '
                }
                if (charsGuessed[i] === 'n') {
                    reply[i] = 'N_gray '
                }
                if (charsGuessed[i] === 'o') {
                    reply[i] = 'O_gray '
                }
                if (charsGuessed[i] === 'p') {
                    reply[i] = 'P_gray '
                }
                if (charsGuessed[i] === 'q') {
                    reply[i] = 'Q_gray  '
                }
                if (charsGuessed[i] === 'r') {
                    reply[i] = 'R_gray '
                }
                if (charsGuessed[i] === 's') {
                    reply[i] = 'S_gray '
                }
                if (charsGuessed[i] === 't') {
                    reply[i] = 'T_gray '
                }
                if (charsGuessed[i] === 'u') {
                    reply[i] = 'U_gray '
                }
                if (charsGuessed[i] === 'v') {
                    reply[i] = 'V_gray '
                }
                if (charsGuessed[i] === 'w') {
                    reply[i] = 'W_gray '
                }
                if (charsGuessed[i] === 'x') {
                    reply[i] = 'X_gray '
                }
                if (charsGuessed[i] === 'y') {
                    reply[i] = 'Y_gray '
                }
                if (charsGuessed[i] === 'z') {
                    reply[i] = 'Z_gray '
                }
            }

            // if character guessed is not in the word
            for (let i = 0; i < 5; ++i) {
                for (let j = 0; j < 5; ++j) {
                    if (charsGuessed[i] !== wordToGuess[j]) {
                        if (charsGuessed[i] === 'a') {
                            alphabetCurr[10] = 'A_darker_gray'
                        }
                        if (charsGuessed[i] === 'b') {
                            alphabetCurr[23] = 'B_darker_gray'
                        }
                        if (charsGuessed[i] === 'c') {
                            alphabetCurr[21] = 'C_darker_gray'
                        }
                        if (charsGuessed[i] === 'd') {
                            alphabetCurr[12] = 'D_darker_gray'
                        }
                        if (charsGuessed[i] === 'e') {
                            alphabetCurr[2] = 'E_darker_gray'
                        }
                        if (charsGuessed[i] === 'f') {
                            alphabetCurr[13] = 'F_darker_gray'
                        }
                        if (charsGuessed[i] === 'g') {
                            alphabetCurr[14] = 'G_darker_gray'
                        }
                        if (charsGuessed[i] === 'h') {
                            alphabetCurr[15] = 'H_darker_gray'
                        }
                        if (charsGuessed[i] === 'i') {
                            alphabetCurr[7] = 'I_darker_gray'
                        }
                        if (charsGuessed[i] === 'j') {
                            alphabetCurr[16] = 'J_darker_gray'
                        }
                        if (charsGuessed[i] === 'k') {
                            alphabetCurr[17] = 'K_darker_gray'
                        }
                        if (charsGuessed[i] === 'l') {
                            alphabetCurr[18] = 'L_darker_gray'
                        }
                        if (charsGuessed[i] === 'm') {
                            alphabetCurr[25] = 'M_darker_gray'
                        }
                        if (charsGuessed[i] === 'n') {
                            alphabetCurr[24] = 'N_darker_gray'
                        }
                        if (charsGuessed[i] === 'o') {
                            alphabetCurr[8] = 'O_darker_gray'
                        }
                        if (charsGuessed[i] === 'p') {
                            alphabetCurr[9] = 'P_darker_gray'
                        }
                        if (charsGuessed[i] === 'q') {
                            alphabetCurr[0] = 'Q_darker_gray'
                        }
                        if (charsGuessed[i] === 'r') {
                            alphabetCurr[3] = 'R_darker_gray'
                        }
                        if (charsGuessed[i] === 's') {
                            alphabetCurr[11] = 'S_darker_gray'
                        }
                        if (charsGuessed[i] === 't') {
                            alphabetCurr[4] = 'T_darker_gray'
                        }
                        if (charsGuessed[i] === 'u') {
                            alphabetCurr[6] = 'U_darker_gray'
                        }
                        if (charsGuessed[i] === 'v') {
                            alphabetCurr[22] = 'V_darker_gray'
                        }
                        if (charsGuessed[i] === 'w') {
                            alphabetCurr[1] = 'W_darker_gray'
                        }
                        if (charsGuessed[i] === 'x') {
                            alphabetCurr[20] = 'X_darker_gray'
                        }
                        if (charsGuessed[i] === 'y') {
                            alphabetCurr[5] = 'Y_darker_gray'
                        }
                        if (charsGuessed[i] === 'z') {
                            alphabetCurr[19] = 'Z_darker_gray'
                        }
                    }
                }
            }

            // if character guessed is in the word in the right place
            let greenFound = [0, 0, 0, 0, 0]
            for (let i = 0; i < 5; ++i) {
                counter = wordToGuess[i].charCodeAt(0)
                if (charsGuessed[i] === wordToGuess[i]) {
                    wordsRepeated[counter] = wordsRepeated[counter] - 1
                    greenFound[i] = greenFound[i] + 1
                    if (charsGuessed[i] === 'a') {
                        reply[i] = 'A_green '
                        alphabetCurr[10] = 'A_green'
                    }
                    if (charsGuessed[i] === 'b') {
                        reply[i] = 'B_green '
                        alphabetCurr[23] = 'B_green'
                    }
                    if (charsGuessed[i] === 'c') {
                        reply[i] = 'C_green '
                        alphabetCurr[21] = 'C_green'
                    }
                    if (charsGuessed[i] === 'd') {
                        reply[i] = 'D_green '
                        alphabetCurr[12] = 'D_green'
                    }
                    if (charsGuessed[i] === 'e') {
                        reply[i] = 'E_green '
                        alphabetCurr[2] = 'E_green'
                    }
                    if (charsGuessed[i] === 'f') {
                        reply[i] = 'F_green '
                        alphabetCurr[13] = 'F_green'
                    }
                    if (charsGuessed[i] === 'g') {
                        reply[i] = 'G_green '
                        alphabetCurr[14] = 'G_green'
                    }
                    if (charsGuessed[i] === 'h') {
                        reply[i] = 'H_green '
                        alphabetCurr[15] = 'H_green'
                    }
                    if (charsGuessed[i] === 'i') {
                        reply[i] = 'I_green '
                        alphabetCurr[7] = 'I_green'
                    }
                    if (charsGuessed[i] === 'j') {
                        reply[i] = 'J_green '
                        alphabetCurr[16] = 'J_green'
                    }
                    if (charsGuessed[i] === 'k') {
                        reply[i] = 'K_green '
                        alphabetCurr[17] = 'K_green'
                    }
                    if (charsGuessed[i] === 'l') {
                        reply[i] = 'L_green '
                        alphabetCurr[18] = 'L_green'
                    }
                    if (charsGuessed[i] === 'm') {
                        reply[i] = 'M_green '
                        alphabetCurr[25] = 'M_green'
                    }
                    if (charsGuessed[i] === 'n') {
                        reply[i] = 'N_green '
                        alphabetCurr[24] = 'N_green'
                    }
                    if (charsGuessed[i] === 'o') {
                        reply[i] = 'O_green '
                        alphabetCurr[8] = 'O_green'
                    }
                    if (charsGuessed[i] === 'p') {
                        reply[i] = 'P_green '
                        alphabetCurr[9] = 'P_green'
                    }
                    if (charsGuessed[i] === 'q') {
                        reply[i] = 'Q_green '
                        alphabetCurr[0] = 'Q_green'
                    }
                    if (charsGuessed[i] === 'r') {
                        reply[i] = 'R_green '
                        alphabetCurr[3] = 'R_green'
                    }
                    if (charsGuessed[i] === 's') {
                        reply[i] = 'S_green '
                        alphabetCurr[11] = 'S_green'
                    }
                    if (charsGuessed[i] === 't') {
                        reply[i] = 'T_green '
                        alphabetCurr[4] = 'T_green'
                    }
                    if (charsGuessed[i] === 'u') {
                        reply[i] = 'U_green '
                        alphabetCurr[6] = 'U_green'
                    }
                    if (charsGuessed[i] === 'v') {
                        reply[i] = 'V_green '
                        alphabetCurr[22] = 'V_green'
                    }
                    if (charsGuessed[i] === 'w') {
                        reply[i] = 'W_green '
                        alphabetCurr[1] = 'W_green'
                    }
                    if (charsGuessed[i] === 'x') {
                        reply[i] = 'X_green '
                        alphabetCurr[20] = 'X_green'
                    }
                    if (charsGuessed[i] === 'y') {
                        reply[i] = 'Y_green '
                        alphabetCurr[5] = 'Y_green'
                    }
                    if (charsGuessed[i] === 'z') {
                        reply[i] = 'Z_green '
                        alphabetCurr[19] = 'Z_green'
                    }
                }
            }

            // if character guessed is in the word but wrong place
            for (let i = 0; i < 5; ++i) {
                for (let j = 0; j < 5; ++j) {
                    if (charsGuessed[i] === wordToGuess[j]) {
                        counter = charsGuessed[i].charCodeAt(0)
                        if (!greenFound[i] && wordsRepeated[counter] > 0) {
                            if (charsGuessed[i] === 'a') {
                                reply[i] = 'A_yellow '
                                alphabetCurr[10] = 'A_yellow'
                            }
                            if (charsGuessed[i] === 'b') {
                                reply[i] = 'B_yellow '
                                alphabetCurr[23] = 'B_yellow'
                            }
                            if (charsGuessed[i] === 'c') {
                                reply[i] = 'C_yellow '
                                alphabetCurr[21] = 'C_yellow'
                            }
                            if (charsGuessed[i] === 'd') {
                                reply[i] = 'D_yellow '
                                alphabetCurr[12] = 'D_yellow'
                            }
                            if (charsGuessed[i] === 'e') {
                                reply[i] = 'E_yellow '
                                alphabetCurr[2] = 'E_yellow'
                            }
                            if (charsGuessed[i] === 'f') {
                                reply[i] = 'F_yellow '
                                alphabetCurr[13] = 'F_yellow'
                            }
                            if (charsGuessed[i] === 'g') {
                                reply[i] = 'G_yellow '
                                alphabetCurr[14] = 'G_yellow'
                            }
                            if (charsGuessed[i] === 'h') {
                                reply[i] = 'H_yellow '
                                alphabetCurr[15] = 'H_yellow'
                            }
                            if (charsGuessed[i] === 'i') {
                                reply[i] = 'I_yellow '
                                alphabetCurr[7] = 'I_yellow'
                            }
                            if (charsGuessed[i] === 'j') {
                                reply[i] = 'J_yellow '
                                alphabetCurr[16] = 'J_yellow'
                            }
                            if (charsGuessed[i] === 'k') {
                                reply[i] = 'K_yellow '
                                alphabetCurr[17] = 'K_yellow'
                            }
                            if (charsGuessed[i] === 'l') {
                                reply[i] = 'L_yellow '
                                alphabetCurr[18] = 'L_yellow'
                            }
                            if (charsGuessed[i] === 'm') {
                                reply[i] = 'M_yellow '
                                alphabetCurr[25] = 'M_yellow'
                            }
                            if (charsGuessed[i] === 'n') {
                                reply[i] = 'N_yellow '
                                alphabetCurr[24] = 'N_yellow'
                            }
                            if (charsGuessed[i] === 'o') {
                                reply[i] = 'O_yellow '
                                alphabetCurr[8] = 'O_yellow'
                            }
                            if (charsGuessed[i] === 'p') {
                                reply[i] = 'P_yellow '
                                alphabetCurr[9] = 'P_yellow'
                            }
                            if (charsGuessed[i] === 'q') {
                                reply[i] = 'Q_yellow '
                                alphabetCurr[0] = 'Q_yellow'
                            }
                            if (charsGuessed[i] === 'r') {
                                reply[i] = 'R_yellow '
                                alphabetCurr[3] = 'R_yellow'
                            }
                            if (charsGuessed[i] === 's') {
                                reply[i] = 'S_yellow '
                                alphabetCurr[11] = 'S_yellow'
                            }
                            if (charsGuessed[i] === 't') {
                                reply[i] = 'T_yellow '
                                alphabetCurr[4] = 'T_yellow'
                            }
                            if (charsGuessed[i] === 'u') {
                                reply[i] = 'U_yellow '
                                alphabetCurr[6] = 'U_yellow'
                            }
                            if (charsGuessed[i] === 'v') {
                                reply[i] = 'V_yellow '
                                alphabetCurr[22] = 'V_yellow'
                            }
                            if (charsGuessed[i] === 'w') {
                                reply[i] = 'W_yellow '
                                alphabetCurr[1] = 'W_yellow'
                            }
                            if (charsGuessed[i] === 'x') {
                                reply[i] = 'X_yellow '
                                alphabetCurr[20] = 'X_yellow'
                            }
                            if (charsGuessed[i] === 'y') {
                                reply[i] = 'Y_yellow '
                                alphabetCurr[5] = 'Y_yellow'
                            }
                            if (charsGuessed[i] === 'z') {
                                reply[i] = 'Z_yellow '
                                alphabetCurr[19] = 'Z_yellow'
                            }
                            wordsRepeated[counter] = wordsRepeated[counter] - 1
                        }
                    }
                }
            }

            // verifying for perfect match
            let perfectMatch = true
            for (let i = 0; i < 5; ++i) {
                if (charsGuessed[i] !== wordToGuess[i]) {
                    perfectMatch = false
                }
            }

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
                return await interaction.reply({ embeds: [embed], files: [file] })
            }
            if (count >= 6) {
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
                schema.currentStreak = 0
                await schema.save()
                return await interaction.reply({ embeds: [embed], files: [file] })
            }

            // update expire time
            let dt = new Date()
            dt = new Date(dt.getTime() + 5 * 60 * 1000).toUTCString()

            let schema2 = await gamesSchema.findOne(query)
            schema2.expires = dt
            await schema2.save()

            schema = await gamesSchema.findOne(query2)
            schema.guesses = count
            schema.replyMessage = replyMessage
            schema.alphabet = alphabetNew
            await schema.save()
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

function hasWhiteSpace(s) {
    return /\s/g.test(s);
}

function hasNumber(s) {
    return /\d/.test(s);
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