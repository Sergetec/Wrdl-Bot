const { EmbedBuilder, ApplicationCommandOptionType } = require('discord.js')
const gamesSchema = require('../Models/gamesSchema')
const statsSchema = require('../Models/statsSchema')
const fs = require("fs")

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
            guildID: guildID,
            userID: userID,
        }
        const result = await gamesSchema.findOne(query)
        if (!result) {
            const message = new EmbedBuilder()
                .setTitle('Wordle Game')
                .setColor('#ED4245')
                .setDescription('❗ **You have not started a game yet**')
            return await interaction.reply({ embeds: [message], ephemeral: true })
        }
        else {
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
                    .setColor('#ED4245')
                    .setDescription('❗Your guess must **not contain spaces**')
                return await interaction.reply({ embeds: [message], ephemeral: true })
            }
            if (guessedWord.length !== 5) {
                const message = new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor('#ED4245')
                    .setDescription('❗ Your guess must be a **5 character word**')
                return await interaction.reply({ embeds: [message], ephemeral: true })
            }
            if (hasNumber(guessedWord)) {
                const message = new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor('#ED4245')
                    .setDescription('❗You **cannot use numbers**')
                return await interaction.reply({ embeds: [message], ephemeral: true })
            }
            count++
            let charsGuessed = ''
            //Copying
            for (let i = 0; i < 5; ++i) {
                charsGuessed += guessedWord[i].toLowerCase()
            }

            //Check for valid word
            let found
            let auxChars
            let file
            if (result.language === 'EN') {
                file = fs.readFileSync('Words/valid_en.txt', 'utf-8')
            }
            if (result.language === 'RO') {
                file = fs.readFileSync('Words/valid_ro.txt', 'utf-8')
            }
            if (result.language === 'TR') {
                file = fs.readFileSync('Words/valid_tr.txt', 'utf-8')
            }
            const wordArray = file.split('\n')
            for (let i = 0; i < wordArray.length; ++i) {
                let word = wordArray[i]
                auxChars = ''
                for (let j = 0; j < 5; ++j) {
                    auxChars += word[j]
                }
                found = true
                for (let k = 0; k < 5; ++k){
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
                    .setColor('#ED4245')
                    .setDescription(`❗**${charsGuessed}** is not in the words list`)
                return await interaction.reply({ embeds: [message], ephemeral: true })
            }

            //The word is valid stored in charsGuessed[]

            let alphabetNew
            //Current line
            let reply = []
            //Counter for index
            let counter
            //All are grey in the beginning
            let wordsRepeated = []
            for (let i = 97; i <= 122; ++i) {
                wordsRepeated[i] = 0
            }
            for (let i = 0; i < 5; ++i) {
                counter = wordToGuess[i].charCodeAt(0)
                wordsRepeated[counter] = wordsRepeated[counter] + 1
                if (charsGuessed[i] === 'a'){
                    reply[i] = '<:A_gray:1012692989807693834> '
                }
                if (charsGuessed[i] === 'b'){
                    reply[i] = '<:B_gray:1012692991510589600> '
                }
                if (charsGuessed[i] === 'c'){
                    reply[i] = '<:C_gray:1012692993121210459> '
                }
                if (charsGuessed[i] === 'd'){
                    reply[i] = '<:D_gray:1012692994656305214> '
                }
                if (charsGuessed[i] === 'e'){
                    reply[i] = '<:E_gray:1012692996396957776> '
                }
                if (charsGuessed[i] === 'f'){
                    reply[i] = '<:F_gray:1012692997957238825> '
                }
                if (charsGuessed[i] === 'g'){
                    reply[i] = '<:G_gray:1012692999613972520> '
                }
                if (charsGuessed[i] === 'h'){
                    reply[i] = '<:H_gray:1012693001170071632> '
                }
                if (charsGuessed[i] === 'i'){
                    reply[i] = '<:I_gray:1012693002638077952> '
                }
                if (charsGuessed[i] === 'j'){
                    reply[i] = '<:J_gray:1012693004064145509> '
                }
                if (charsGuessed[i] === 'k'){
                    reply[i] = '<:K_gray:1012693005548920852> '
                }
                if (charsGuessed[i] === 'l'){
                    reply[i] = '<:L_gray:1012693006769463408> '
                }
                if (charsGuessed[i] === 'm'){
                    reply[i] = '<:M_gray:1012693008300396564> '
                }
                if (charsGuessed[i] === 'n'){
                    reply[i] = '<:N_gray:1012693009411878953> '
                }
                if (charsGuessed[i] === 'o'){
                    reply[i] = '<:O_gray:1012693011286736957> '
                }
                if (charsGuessed[i] === 'p'){
                    reply[i] = '<:P_gray:1012693012956057640> '
                }
                if (charsGuessed[i] === 'q'){
                    reply[i] = '<:Q_gray:1012693014516342864>  '
                }
                if (charsGuessed[i] === 'r'){
                    reply[i] = '<:R_gray:1012693015720120351> '
                }
                if (charsGuessed[i] === 's'){
                    reply[i] = '<:S_gray:1012693017473335331> '
                }
                if (charsGuessed[i] === 't'){
                    reply[i] = '<:T_gray:1012693019343978606> '
                }
                if (charsGuessed[i] === 'u'){
                    reply[i] = '<:U_gray:1012693020891693136> '
                }
                if (charsGuessed[i] === 'v'){
                    reply[i] = '<:V_gray:1012693022506487828> '
                }
                if (charsGuessed[i] === 'w'){
                    reply[i] = '<:W_gray:1012693024507187280> '
                }
                if (charsGuessed[i] === 'x'){
                    reply[i] = '<:X_gray:1012693027778732132> '
                }
                if (charsGuessed[i] === 'y'){
                    reply[i] = '<:Y_gray:1012693029661974578> '
                }
                if (charsGuessed[i] === 'z'){
                    reply[i] = '<:Z_gray:1012693031402622996> '
                }
            }

            //If character guessed is not in the word
            for (let i = 0; i < 5; ++i) {
                for (let j = 0; j < 5; ++j) {
                    if (charsGuessed[i] !== wordToGuess[j]) {
                        if (charsGuessed[i] === 'a') {
                            alphabetCurr[0] = '<:A_darker_gray:1064629141342793908>'
                        }
                        if (charsGuessed[i] === 'b') {
                            alphabetCurr[1] = '<:B_darker_gray:1064629144933122118>'
                        }
                        if (charsGuessed[i] === 'c') {
                            alphabetCurr[2] = '<:C_darker_gray:1064629146510168105>'
                        }
                        if (charsGuessed[i] === 'd') {
                            alphabetCurr[3] = '<:D_darker_gray:1064629149672685690>'
                        }
                        if (charsGuessed[i] === 'e') {
                            alphabetCurr[4] = '<:E_darker_gray:1064629151396540506>'
                        }
                        if (charsGuessed[i] === 'f') {
                            alphabetCurr[5] = '<:F_darker_gray:1064629153804058694>'
                        }
                        if (charsGuessed[i] === 'g') {
                            alphabetCurr[6] = '<:G_darker_gray:1064629155364356116>'
                        }
                        if (charsGuessed[i] === 'h') {
                            alphabetCurr[7] = '<:H_darker_gray:1064629158325522462>'
                        }
                        if (charsGuessed[i] === 'i') {
                            alphabetCurr[8] = '<:I_darker_gray:1064629159579635865>'
                        }
                        if (charsGuessed[i] === 'j') {
                            alphabetCurr[9] = '<:J_darker_gray:1064629162867953754>'
                        }
                        if (charsGuessed[i] === 'k') {
                            alphabetCurr[10] = '<:K_darker_gray:1064629164784758835>'
                        }
                        if (charsGuessed[i] === 'l') {
                            alphabetCurr[11] = '<:L_darker_gray:1064629167783690402>'
                        }
                        if (charsGuessed[i] === 'm') {
                            alphabetCurr[12] = '<:M_darker_gray:1064629169134260234>'
                        }
                        if (charsGuessed[i] === 'n') {
                            alphabetCurr[13] = '\n<:N_darker_gray:1064629171453702316>'
                        }
                        if (charsGuessed[i] === 'o') {
                            alphabetCurr[14] = '<:O_darker_gray:1064629174238707772>'
                        }
                        if (charsGuessed[i] === 'p') {
                            alphabetCurr[15] = '<:P_darker_gray:1064629176671416460>'
                        }
                        if (charsGuessed[i] === 'q') {
                            alphabetCurr[16] = '<:Q_darker_gray:1064634245873680485>'
                        }
                        if (charsGuessed[i] === 'r') {
                            alphabetCurr[17] = '<:R_darker_gray:1064634248495112282>'
                        }
                        if (charsGuessed[i] === 's') {
                            alphabetCurr[18] = '<:S_darker_gray:1064634250252537946>'
                        }
                        if (charsGuessed[i] === 't') {
                            alphabetCurr[19] = '<:T_darker_gray:1064634252664254595>'
                        }
                        if (charsGuessed[i] === 'u') {
                            alphabetCurr[20] = '<:U_darker_gray:1064634254287454380>'
                        }
                        if (charsGuessed[i] === 'v') {
                            alphabetCurr[21] = '<:V_darker_gray:1064634280719941713>'
                        }
                        if (charsGuessed[i] === 'w') {
                            alphabetCurr[22] = '<:W_darker_gray:1064634282141810780>'
                        }
                        if (charsGuessed[i] === 'x') {
                            alphabetCurr[23] = '<:X_darker_gray:1064634283735658576>'
                        }
                        if (charsGuessed[i] === 'y') {
                            alphabetCurr[24] = '<:Y_darker_gray:1064634286533259354>'
                        }
                        if (charsGuessed[i] === 'z') {
                            alphabetCurr[25] = '<:Z_darker_gray:1064634287917387916>'
                        }
                    }
                }
            }

            //If character guessed is in the word in the right place
            let greenFound = [0, 0, 0, 0, 0]
            for (let i = 0; i < 5; ++i) {
                counter = wordToGuess[i].charCodeAt(0)
                if (charsGuessed[i] === wordToGuess[i]) {
                    wordsRepeated[counter] = wordsRepeated[counter] - 1
                    greenFound[i] = greenFound[i] + 1
                    if (charsGuessed[i] === 'a') {
                        reply[i] = '<:A_green:1012673118441058404> '
                        alphabetCurr[0] = '<:A_green:1012673118441058404>'
                    }
                    if (charsGuessed[i] === 'b') {
                        reply[i] = '<:B_green:1012673120072646707> '
                        alphabetCurr[1] = '<:B_green:1012673120072646707>'
                    }
                    if (charsGuessed[i] === 'c') {
                        reply[i] = '<:C_green:1012673121892970507> '
                        alphabetCurr[2] = '<:C_green:1012673121892970507>'
                    }
                    if (charsGuessed[i] === 'd') {
                        reply[i] = '<:D_green:1012673123428094023> '
                        alphabetCurr[3] = '<:D_green:1012673123428094023>'
                    }
                    if (charsGuessed[i] === 'e') {
                        reply[i] = '<:E_green:1012673124623470612> '
                        alphabetCurr[4] = '<:E_green:1012673124623470612>'
                    }
                    if (charsGuessed[i] === 'f') {
                        reply[i] = '<:F_green:1012673125839802443> '
                        alphabetCurr[5] = '<:F_green:1012673125839802443>'
                    }
                    if (charsGuessed[i] === 'g') {
                        reply[i] = '<:G_green:1012673127605600337> '
                        alphabetCurr[6] = '<:G_green:1012673127605600337>'
                    }
                    if (charsGuessed[i] === 'h') {
                        reply[i] = '<:H_green:1012673129149108334> '
                        alphabetCurr[7] = '<:H_green:1012673129149108334>'
                    }
                    if (charsGuessed[i] === 'i') {
                        reply[i] = '<:I_green:1012673130407407676> '
                        alphabetCurr[8] = '<:I_green:1012673130407407676>'
                    }
                    if (charsGuessed[i] === 'j') {
                        reply[i] = '<:J_green:1012673131791532132> '
                        alphabetCurr[9] = '<:J_green:1012673131791532132>'
                    }
                    if (charsGuessed[i] === 'k') {
                        reply[i] = '<:K_green:1012673133133713468> '
                        alphabetCurr[10] = '<:K_green:1012673133133713468>'
                    }
                    if (charsGuessed[i] === 'l') {
                        reply[i] = '<:L_green:1012673134660419584> '
                        alphabetCurr[11] = '<:L_green:1012673134660419584>'
                    }
                    if (charsGuessed[i] === 'm') {
                        reply[i] = '<:M_green:1012673136279441508> '
                        alphabetCurr[12] = '<:M_green:1012673136279441508>'
                    }
                    if (charsGuessed[i] === 'n') {
                        reply[i] = '<:N_green:1012673137630007316> '
                        alphabetCurr[13] = '\n<:N_green:1012673137630007316>'
                    }
                    if (charsGuessed[i] === 'o') {
                        reply[i] = '<:O_green:1012673139135742012> '
                        alphabetCurr[14] = '<:O_green:1012673139135742012>'
                    }
                    if (charsGuessed[i] === 'p') {
                        reply[i] = '<:P_green:1012673140448571473> '
                        alphabetCurr[15] = '<:P_green:1012673140448571473>'
                    }
                    if (charsGuessed[i] === 'q') {
                        reply[i] = '<:Q_green:1012673142038204426> '
                        alphabetCurr[16] = '<:Q_green:1012673142038204426>'
                    }
                    if (charsGuessed[i] === 'r') {
                        reply[i] = '<:R_green:1012673143376183387> '
                        alphabetCurr[17] = '<:R_green:1012673143376183387>'
                    }
                    if (charsGuessed[i] === 's') {
                        reply[i] = '<:S_green:1012673144923902013> '
                        alphabetCurr[18] = '<:S_green:1012673144923902013>'
                    }
                    if (charsGuessed[i] === 't') {
                        reply[i] = '<:T_green:1012673146320605184> '
                        alphabetCurr[19] = '<:T_green:1012673146320605184>'
                    }
                    if (charsGuessed[i] === 'u') {
                        reply[i] = '<:U_green:1012673147834744863> '
                        alphabetCurr[20] = '<:U_green:1012673147834744863>'
                    }
                    if (charsGuessed[i] === 'v') {
                        reply[i] = '<:V_green:1012673149403398176> '
                        alphabetCurr[21] = '<:V_green:1012673149403398176>'
                    }
                    if (charsGuessed[i] === 'w') {
                        reply[i] = '<:W_green:1012673151274061824> '
                        alphabetCurr[22] = '<:W_green:1012673151274061824>'
                    }
                    if (charsGuessed[i] === 'x') {
                        reply[i] = '<:X_green:1012673152721096766> '
                        alphabetCurr[23] = '<:X_green:1012673152721096766>'
                    }
                    if (charsGuessed[i] === 'y') {
                        reply[i] = '<:Y_green:1012673154746953798> '
                        alphabetCurr[24] = '<:Y_green:1012673154746953798>'
                    }
                    if (charsGuessed[i] === 'z') {
                        reply[i] = '<:Z_green:1012673156462432276> '
                        alphabetCurr[25] = '<:Z_green:1012673156462432276>'
                    }
                }
            }

            //If character guessed is in the word but wrong place
            for (let i = 0; i < 5; ++i) {
                for (let j = 0; j < 5; ++j) {
                    if (charsGuessed[i] === wordToGuess[j]) {
                        counter = charsGuessed[i].charCodeAt(0)
                        if (!greenFound[i] && wordsRepeated[counter] > 0) {
                            if (charsGuessed[i] === 'a'){
                                reply[i] = '<:A_yellow:1012673286506827806> '
                                alphabetCurr[0] = '<:A_yellow:1012673286506827806>'
                            }
                            if (charsGuessed[i] === 'b'){
                                reply[i] = '<:B_yellow:1012673288415223841> '
                                alphabetCurr[1] = '<:B_yellow:1012673288415223841>'
                            }
                            if (charsGuessed[i] === 'c'){
                                reply[i] = '<:C_yellow:1012673290340417598> '
                                alphabetCurr[2] = '<:C_yellow:1012673290340417598>'
                            }
                            if (charsGuessed[i] === 'd'){
                                reply[i] = '<:D_yellow:1012673292060065842> '
                                alphabetCurr[3] = '<:D_yellow:1012673292060065842>'
                            }
                            if (charsGuessed[i] === 'e'){
                                reply[i] = '<:E_yellow:1012673294069141525> '
                                alphabetCurr[4] = '<:E_yellow:1012673294069141525>'
                            }
                            if (charsGuessed[i] === 'f'){
                                reply[i] = '<:F_yellow:1012673295600070717> '
                                alphabetCurr[5] = '<:F_yellow:1012673295600070717>'
                            }
                            if (charsGuessed[i] === 'g'){
                                reply[i] = '<:G_yellow:1012673297365860352> '
                                alphabetCurr[6] = '<:G_yellow:1012673297365860352>'
                            }
                            if (charsGuessed[i] === 'h'){
                                reply[i] = '<:H_yellow:1012673299051986994> '
                                alphabetCurr[7] = '<:H_yellow:1012673299051986994>'
                            }
                            if (charsGuessed[i] === 'i'){
                                reply[i] = '<:I_yellow:1012673300654194789> '
                                alphabetCurr[8] = '<:I_yellow:1012673300654194789>'
                            }
                            if (charsGuessed[i] === 'j'){
                                reply[i] = '<:J_yellow:1012673302218686484> '
                                alphabetCurr[9] = '<:J_yellow:1012673302218686484>'
                            }
                            if (charsGuessed[i] === 'k'){
                                reply[i] = '<:K_yellow:1012673304106106890> '
                                alphabetCurr[10] = '<:K_yellow:1012673304106106890>'
                            }
                            if (charsGuessed[i] === 'l'){
                                reply[i] = '<:L_yellow:1012673305876111363> '
                                alphabetCurr[11] = '<:L_yellow:1012673305876111363>'
                            }
                            if (charsGuessed[i] === 'm'){
                                reply[i] = '<:M_yellow:1012673307759353876> '
                                alphabetCurr[12] = '<:M_yellow:1012673307759353876>'
                            }
                            if (charsGuessed[i] === 'n'){
                                reply[i] = '<:N_yellow:1012673309470642277> '
                                alphabetCurr[13] = '\n<:N_yellow:1012673309470642277>'
                            }
                            if (charsGuessed[i] === 'o'){
                                reply[i] = '<:O_yellow:1012673310955421738> '
                                alphabetCurr[14] = '<:O_yellow:1012673310955421738>'
                            }
                            if (charsGuessed[i] === 'p'){
                                reply[i] = '<:P_yellow:1012673312645718026> '
                                alphabetCurr[15] = '<:P_yellow:1012673312645718026>'
                            }
                            if (charsGuessed[i] === 'q'){
                                reply[i] = '<:Q_yellow:1012673314726105118> '
                                alphabetCurr[16] = '<:Q_yellow:1012673314726105118>'
                            }
                            if (charsGuessed[i] === 'r'){
                                reply[i] = '<:R_yellow:1012673316605141072> '
                                alphabetCurr[17] = '<:R_yellow:1012673316605141072>'
                            }
                            if (charsGuessed[i] === 's'){
                                reply[i] = '<:S_yellow:1012673318291263599> '
                                alphabetCurr[18] = '<:S_yellow:1012673318291263599>'
                            }
                            if (charsGuessed[i] === 't'){
                                reply[i] = '<:T_yellow:1012673320010907660> '
                                alphabetCurr[19] = '<:T_yellow:1012673320010907660>'
                            }
                            if (charsGuessed[i] === 'u'){
                                reply[i] = '<:U_yellow:1012673321713807410> '
                                alphabetCurr[20] = '<:U_yellow:1012673321713807410>'
                            }
                            if (charsGuessed[i] === 'v'){
                                reply[i] = '<:V_yellow:1012691824227405824> '
                                alphabetCurr[21] = '<:V_yellow:1012691824227405824>'
                            }
                            if (charsGuessed[i] === 'w'){
                                reply[i] = '<:W_yellow:1012691826102255666> '
                                alphabetCurr[22] = '<:W_yellow:1012691826102255666>'
                            }
                            if (charsGuessed[i] === 'x'){
                                reply[i] = '<:X_yellow:1012691827251486732> '
                                alphabetCurr[23] = '<:X_yellow:1012691827251486732>'
                            }
                            if (charsGuessed[i] === 'y'){
                                reply[i] = '<:Y_yellow:1012692413560668213> '
                                alphabetCurr[24] = '<:Y_yellow:1012692413560668213>'
                            }
                            if (charsGuessed[i] === 'z'){
                                reply[i] = '<:Z_yellow:1012692416043692082> '
                                alphabetCurr[25] = '<:Z_yellow:1012692416043692082>'
                            }
                            wordsRepeated[counter] = wordsRepeated[counter] - 1
                        }
                    }
                }
            }

            //Updating alphabet
            for (let i = 0; i < 26; ++i) {
                if (i === 0) {
                    alphabetNew = alphabetCurr[i] + ' '
                }
                else {
                    if (alphabetCurr[i] === '') {
                        continue
                    }
                    alphabetNew += alphabetCurr[i] + ' '
                }
            }
            let perfectMatch = true
            for (let i = 0; i < 5; ++i) {
                if (charsGuessed[i] !== wordToGuess[i]) {
                    perfectMatch = false
                }
            }
            for (let i = 0; i < 5; ++i) {
                replyMessage += reply[i]
            }
            replyMessage += '\n'
            const query2 = {
                guildID: guildID,
                userID: userID,
            }
            let schema
            if (perfectMatch) {
                await gamesSchema.deleteMany(query2)
                const message = new EmbedBuilder()
                    .setTitle(`Wordle Game`)
                    .setColor('#57F287')
                    .setDescription(
                        `🎉 You won 🎉
                        The word was **${wordToGuess}**
                        Wanna play again? \`/start\``
                    )
                    .addFields({
                        name: '\u200b',
                        value: `${replyMessage}`,
                    })
                    .addFields({
                        name: '\u200b',
                        value: `${alphabetNew}`
                    })
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
                return await interaction.reply({ embeds: [message] })
            }
            if (count >= 6) {
                await gamesSchema.deleteMany(query2)
                const message = new EmbedBuilder()
                    .setTitle(`Wordle Game`)
                    .setColor('#ED4245')
                    .setDescription(
                        `❗ You lost ❗
                        The word was **${wordToGuess}**
                        Wanna play again? \`/start\``
                    )
                    .addFields({
                        name: '\u200b',
                        value: `${replyMessage}`,
                    })
                    .addFields({
                        name: '\u200b',
                        value: `${alphabetNew}`
                    })
                    .setFooter({
                        text: `${count} / 6`
                    })
                schema = await statsSchema.findOne(query2)
                schema.gamesLost = schema.gamesLost + 1
                schema.winRate = Math.trunc(schema.gamesWon / schema.gamesTotal * 100)
                schema.currentStreak = 0
                await schema.save()
                return await interaction.reply({ embeds: [message] })
            }

            //Update inactive time
            let expires1 = new Date()
            let dt = new Date(expires1.getTime() + 123 * 60 * 1000)
            dt = dt.toLocaleString('ro-RO', { timezone: 'Europe/Bucharest' })

            let schema2 = await gamesSchema.findOne(query)
            schema2.expires = dt
            await schema2.save()

            schema = await gamesSchema.findOne(query2)
            schema.guesses = count
            schema.replyMessage = replyMessage
            schema.alphabet = alphabetNew
            await schema.save()
            const message = new EmbedBuilder()
                .setTitle(`Wordle Game`)
                .setColor('#FF964D')
                .addFields({
                    name: '\u200b',
                    value: `${replyMessage}`,
                })
                .addFields({
                    name: '\u200b',
                    value: `${alphabetNew}`
                })
                .setFooter({
                    text: `${count} / 6`
                })
            return await interaction.reply({ embeds: [message] })
        }
    }
}

function hasWhiteSpace(s) {
    return /\s/g.test(s);
}

function hasNumber(s) {
    return /\d/.test(s);
}