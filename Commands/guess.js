const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js')
const gamesSchema = require('../Models/gamesSchema')
const statsSchema = require('../Models/statsSchema')
const fs = require("fs");

module.exports = {
    name: 'guess',
    description: 'guess the word',
    options: [
        {
            name: 'word',
            type: 'STRING',
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
            const message = new MessageEmbed()
                .setTitle('Wordle Game')
                .setColor('RED')
                .setDescription('❗ **You have not started a game yet**')
            return await interaction.reply({ embeds: [message], ephemeral: true })
        }
        else {
            let replyMessage = result.replyMessage
            let alphabetString = ''
            alphabetString = result.alphabet
            let alphabetCurr = alphabetString.split(' ')
            console.log(alphabetCurr)
            let count = result.guesses
            let wordToGuess = result.word
            let guessedWord = interaction.options.getString('word')
            if (hasWhiteSpace(guessedWord)) {
                const message = new MessageEmbed()
                    .setTitle('Wordle Game')
                    .setColor('RED')
                    .setDescription('❗Your guess must **not contain spaces**')
                return await interaction.reply({ embeds: [message], ephemeral: true })
            }
            if (guessedWord.length !== 5) {
                const message = new MessageEmbed()
                    .setTitle('Wordle Game')
                    .setColor('RED')
                    .setDescription('❗ Your guess must be a **5 character word**')
                return await interaction.reply({ embeds: [message], ephemeral: true })
            }
            if (hasNumber(guessedWord)) {
                const message = new MessageEmbed()
                    .setTitle('Wordle Game')
                    .setColor('RED')
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
                const message = new MessageEmbed()
                    .setTitle('Wordle Game')
                    .setColor('RED')
                    .setDescription(`❗**${charsGuessed}** is not in the words list`)
                return await interaction.reply({ embeds: [message], ephemeral: true })
            }

            //The word is valid stored in charsGuessed[]

            //Alphabet/keyboard at the bottom
            // let alphabetGray = []
            // let alphabet
            // //all alphabet is grey
            // alphabetGray[1] = '<:A_darker_gray:1064629141342793908>'
            // alphabetGray[2] = '<:B_darker_gray:1064629144933122118>'
            // alphabetGray[3] = '<:C_darker_gray:1064629146510168105>'
            // alphabetGray[4] = '<:D_darker_gray:1064629149672685690>'
            // alphabetGray[5] = '<:E_darker_gray:1064629151396540506>'
            // alphabetGray[6] = '<:F_darker_gray:1064629153804058694>'
            // alphabetGray[7] = '<:G_darker_gray:1064629155364356116>'
            // alphabetGray[8] = '<:H_darker_gray:1064629158325522462>'
            // alphabetGray[9] = '<:I_darker_gray:1064629159579635865>'
            // alphabetGray[10] = '<:J_darker_gray:1064629162867953754>'
            // alphabetGray[11] = '<:K_darker_gray:1064629164784758835>'
            // alphabetGray[12] = '<:L_darker_gray:1064629167783690402>'
            // alphabetGray[13] = '<:M_darker_gray:1064629169134260234>'
            // alphabetGray[14] = '<:N_darker_gray:1064629171453702316>'
            // alphabetGray[15] = '<:O_darker_gray:1064629174238707772>'
            // alphabetGray[16] = '<:P_darker_gray:1064629176671416460>'
            // alphabetGray[17] = '<:Q_darker_gray:1064634245873680485>'
            // alphabetGray[18] = '<:R_darker_gray:1064634248495112282>'
            // alphabetGray[19] = '<:S_darker_gray:1064634250252537946>'
            // alphabetGray[20] = '<:T_darker_gray:1064634252664254595>'
            // alphabetGray[21] = '<:U_darker_gray:1064634254287454380>'
            // alphabetGray[22] = '<:V_darker_gray:1064634280719941713>'
            // alphabetGray[23] = '<:W_darker_gray:1064634282141810780>'
            // alphabetGray[24] = '<:X_darker_gray:1064634283735658576>'
            // alphabetGray[25] = '<:Y_darker_gray:1064634286533259354>'
            // alphabetGray[26] = '<:Z_darker_gray:1064634287917387916>'
            // for (let i = 1; i <= 26; ++i) {
            //     alphabet += alphabetGray[i]
            // }

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
                            alphabetCurr[13] = '<:N_darker_gray:1064629171453702316>'
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

            let greenFound = [0, 0, 0, 0, 0]
            for (let i = 0; i < 5; ++i) {
                counter = wordToGuess[i].charCodeAt(0)
                if (charsGuessed[i] === wordToGuess[i]) {
                    wordsRepeated[counter] = wordsRepeated[counter] - 1
                    greenFound[i] = greenFound[i] + 1
                    if (charsGuessed[i] === 'a') {
                        reply[i] = '<:A_green:1012673118441058404> '
                        alphabetCurr[0] = '<:A_green:1012673118441058404>'
                        // if (reply[i] !== alphabetCurr[0]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'b') {
                        reply[i] = '<:B_green:1012673120072646707> '
                        alphabetCurr[1] = '<:B_green:1012673120072646707>'
                        // if (reply[i] !== alphabetCurr[1]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'c') {
                        reply[i] = '<:C_green:1012673121892970507> '
                        alphabetCurr[2] = '<:C_green:1012673121892970507>'
                        // if (reply[i] !== alphabetCurr[2]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'd') {
                        reply[i] = '<:D_green:1012673123428094023> '
                        alphabetCurr[3] = '<:D_green:1012673123428094023>'
                        // if (reply[i] !== alphabetCurr[3]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'e') {
                        reply[i] = '<:E_green:1012673124623470612> '
                        alphabetCurr[4] = '<:E_green:1012673124623470612>'
                        // if (reply[i] !== alphabetCurr[4]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'f') {
                        reply[i] = '<:F_green:1012673125839802443> '
                        alphabetCurr[5] = '<:F_green:1012673125839802443>'
                        // if (reply[i] !== alphabetCurr[5]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'g') {
                        reply[i] = '<:G_green:1012673127605600337> '
                        alphabetCurr[6] = '<:G_green:1012673127605600337>'
                        // if (reply[i] !== alphabetCurr[6]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'h') {
                        reply[i] = '<:H_green:1012673129149108334> '
                        alphabetCurr[7] = '<:H_green:1012673129149108334>'
                        // if (reply[i] !== alphabetCurr[7]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'i') {
                        reply[i] = '<:I_green:1012673130407407676> '
                        alphabetCurr[8] = '<:I_green:1012673130407407676>'
                        // if (reply[i] !== alphabetCurr[8]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'j') {
                        reply[i] = '<:J_green:1012673131791532132> '
                        alphabetCurr[9] = '<:J_green:1012673131791532132>'
                        // if (reply[i] !== alphabetCurr[9]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'k') {
                        reply[i] = '<:K_green:1012673133133713468> '
                        alphabetCurr[10] = '<:K_green:1012673133133713468>'
                        // if (reply[i] !== alphabetCurr[10]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'l') {
                        reply[i] = '<:L_green:1012673134660419584> '
                        alphabetCurr[11] = '<:L_green:1012673134660419584>'
                        // if (reply[i] !== alphabetCurr[11]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'm') {
                        reply[i] = '<:M_green:1012673136279441508> '
                        alphabetCurr[12] = '<:M_green:1012673136279441508>'
                        // if (reply[i] !== alphabetCurr[12]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'n') {
                        reply[i] = '<:N_green:1012673137630007316> '
                        alphabetCurr[13] = '<:N_green:1012673137630007316>'
                        // if (reply[i] !== alphabetCurr[13]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'o') {
                        reply[i] = '<:O_green:1012673139135742012> '
                        alphabetCurr[14] = '<:O_green:1012673139135742012>'
                        // if (reply[i] !== alphabetCurr[14]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'p') {
                        reply[i] = '<:P_green:1012673140448571473> '
                        alphabetCurr[15] = '<:P_green:1012673140448571473>'
                        // if (reply[i] !== alphabetCurr[15]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'q') {
                        reply[i] = '<:Q_green:1012673142038204426> '
                        alphabetCurr[16] = '<:Q_green:1012673142038204426>'
                        // if (reply[i] !== alphabetCurr[16]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'r') {
                        reply[i] = '<:R_green:1012673143376183387> '
                        alphabetCurr[17] = '<:R_green:1012673143376183387>'
                        // if (reply[i] !== alphabetCurr[17]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 's') {
                        reply[i] = '<:S_green:1012673144923902013> '
                        alphabetCurr[18] = '<:S_green:1012673144923902013>'
                        // if (reply[i] !== alphabetCurr[18]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 't') {
                        reply[i] = '<:T_green:1012673146320605184> '
                        alphabetCurr[19] = '<:T_green:1012673146320605184>'
                        // if (reply[i] !== alphabetCurr[19]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'u') {
                        reply[i] = '<:U_green:1012673147834744863> '
                        alphabetCurr[20] = '<:U_green:1012673147834744863>'
                        // if (reply[i] !== alphabetCurr[20]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'v') {
                        reply[i] = '<:V_green:1012673149403398176> '
                        alphabetCurr[21] = '<:V_green:1012673149403398176>'
                        // if (reply[i] !== alphabetCurr[21]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'w') {
                        reply[i] = '<:W_green:1012673151274061824> '
                        alphabetCurr[22] = '<:W_green:1012673151274061824>'
                        // if (reply[i] !== alphabetCurr[22]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'x') {
                        reply[i] = '<:X_green:1012673152721096766> '
                        alphabetCurr[23] = '<:X_green:1012673152721096766>'
                        // if (reply[i] !== alphabetCurr[23]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'y') {
                        reply[i] = '<:Y_green:1012673154746953798> '
                        alphabetCurr[24] = '<:Y_green:1012673154746953798>'
                        // if (reply[i] !== alphabetCurr[24]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                    if (charsGuessed[i] === 'z') {
                        reply[i] = '<:Z_green:1012673156462432276> '
                        alphabetCurr[25] = '<:Z_green:1012673156462432276>'
                        // if (reply[i] !== alphabetCurr[25]) {
                        //     if (alphabetNew === '') {
                        //         alphabetNew = reply[i]
                        //     }
                        //     else {
                        //         alphabetNew += reply[i]
                        //     }
                        // }
                    }
                }
            }

            for (let i = 0; i < 5; ++i) {
                for (let j = 0; j < 5; ++j) {
                    if (charsGuessed[i] === wordToGuess[j]) {
                        counter = charsGuessed[i].charCodeAt(0)
                        if (!greenFound[i] && wordsRepeated[counter] > 0) {
                            if (charsGuessed[i] === 'a'){
                                reply[i] = '<:A_yellow:1012673286506827806> '
                                alphabetCurr[0] = '<:A_yellow:1012673286506827806>'
                                // if (reply[i] !== alphabetCurr[0]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'b'){
                                reply[i] = '<:B_yellow:1012673288415223841> '
                                alphabetCurr[1] = '<:B_yellow:1012673288415223841>'
                                // if (reply[i] !== alphabetCurr[1]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'c'){
                                reply[i] = '<:C_yellow:1012673290340417598> '
                                alphabetCurr[2] = '<:C_yellow:1012673290340417598>'
                                // if (reply[i] !== alphabetCurr[2]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'd'){
                                reply[i] = '<:D_yellow:1012673292060065842> '
                                alphabetCurr[3] = '<:D_yellow:1012673292060065842>'
                                // if (reply[i] !== alphabetCurr[3]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'e'){
                                reply[i] = '<:E_yellow:1012673294069141525> '
                                alphabetCurr[4] = '<:E_yellow:1012673294069141525>'
                                // if (reply[i] !== alphabetCurr[4]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'f'){
                                reply[i] = '<:F_yellow:1012673295600070717> '
                                alphabetCurr[5] = '<:F_yellow:1012673295600070717>'
                                // if (reply[i] !== alphabetCurr[5]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'g'){
                                reply[i] = '<:G_yellow:1012673297365860352> '
                                alphabetCurr[6] = '<:G_yellow:1012673297365860352>'
                                // if (reply[i] !== alphabetCurr[6]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'h'){
                                reply[i] = '<:H_yellow:1012673299051986994> '
                                alphabetCurr[7] = '<:H_yellow:1012673299051986994>'
                                // if (reply[i] !== alphabetCurr[7]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'i'){
                                reply[i] = '<:I_yellow:1012673300654194789> '
                                alphabetCurr[8] = '<:I_yellow:1012673300654194789>'
                                // if (reply[i] !== alphabetCurr[8]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'j'){
                                reply[i] = '<:J_yellow:1012673302218686484> '
                                alphabetCurr[9] = '<:J_yellow:1012673302218686484>'
                                // if (reply[i] !== alphabetCurr[9]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'k'){
                                reply[i] = '<:K_yellow:1012673304106106890> '
                                alphabetCurr[10] = '<:K_yellow:1012673304106106890>'
                                // if (reply[i] !== alphabetCurr[10]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'l'){
                                reply[i] = '<:L_yellow:1012673305876111363> '
                                alphabetCurr[11] = '<:L_yellow:1012673305876111363>'
                                // if (reply[i] !== alphabetCurr[11]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'm'){
                                reply[i] = '<:M_yellow:1012673307759353876> '
                                alphabetCurr[12] = '<:M_yellow:1012673307759353876>'
                                // if (reply[i] !== alphabetCurr[12]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'n'){
                                reply[i] = '<:N_yellow:1012673309470642277> '
                                alphabetCurr[13] = '<:N_yellow:1012673309470642277>'
                                // if (reply[i] !== alphabetCurr[13]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'o'){
                                reply[i] = '<:O_yellow:1012673310955421738> '
                                alphabetCurr[14] = '<:O_yellow:1012673310955421738>'
                                // if (reply[i] !== alphabetCurr[14]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'p'){
                                reply[i] = '<:P_yellow:1012673312645718026> '
                                alphabetCurr[15] = '<:P_yellow:1012673312645718026>'
                                // if (reply[i] !== alphabetCurr[15]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'q'){
                                reply[i] = '<:Q_yellow:1012673314726105118> '
                                alphabetCurr[16] = '<:Q_yellow:1012673314726105118>'
                                // if (reply[i] !== alphabetCurr[16]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'r'){
                                reply[i] = '<:R_yellow:1012673316605141072> '
                                alphabetCurr[17] = '<:R_yellow:1012673316605141072>'
                                // if (reply[i] !== alphabetCurr[17]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 's'){
                                reply[i] = '<:S_yellow:1012673318291263599> '
                                alphabetCurr[18] = '<:S_yellow:1012673318291263599>'
                                // if (reply[i] !== alphabetCurr[18]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 't'){
                                reply[i] = '<:T_yellow:1012673320010907660> '
                                alphabetCurr[19] = '<:T_yellow:1012673320010907660>'
                                // if (reply[i] !== alphabetCurr[19]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'u'){
                                reply[i] = '<:U_yellow:1012673321713807410> '
                                alphabetCurr[20] = '<:U_yellow:1012673321713807410>'
                                // if (reply[i] !== alphabetCurr[20]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'v'){
                                reply[i] = '<:V_yellow:1012691824227405824> '
                                alphabetCurr[21] = '<:V_yellow:1012691824227405824>'
                                // if (reply[i] !== alphabetCurr[21]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'w'){
                                reply[i] = '<:W_yellow:1012691826102255666> '
                                alphabetCurr[22] = '<:W_yellow:1012691826102255666>'
                                // if (reply[i] !== alphabetCurr[22]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'x'){
                                reply[i] = '<:X_yellow:1012691827251486732> '
                                alphabetCurr[23] = '<:X_yellow:1012691827251486732>'
                                // if (reply[i] !== alphabetCurr[23]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'y'){
                                reply[i] = '<:Y_yellow:1012692413560668213> '
                                alphabetCurr[24] = '<:Y_yellow:1012692413560668213>'
                                // if (reply[i] !== alphabetCurr[24]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            if (charsGuessed[i] === 'z'){
                                reply[i] = '<:Z_yellow:1012692416043692082> '
                                alphabetCurr[25] = '<:Z_yellow:1012692416043692082>'
                                // if (reply[i] !== alphabetCurr[25]) {
                                //     if (alphabetNew === '') {
                                //         alphabetNew = reply[i]
                                //     }
                                //     else {
                                //         alphabetNew += reply[i]
                                //     }
                                // }
                            }
                            wordsRepeated[counter] = wordsRepeated[counter] - 1
                        }
                    }
                }
            }

            // // let alphabetNew = ''
            // // // for (let i = 1; i <= 26; ++i) {
            // // //     if (!alphabetCurr[i]) {
            // // //         alphabetNew += alphabetCurr[i]
            // // //     }
            // // //     else {
            // // //         alphabetNew += alphabetCurr[i]
            // // //     }
            // // // }
            // // console.log(alphabetCurr)
            // // for (let i = 1; i <= 26; ++i) {
            // //     if (alphabetCurr[i] !== alphabetCurr[i]) {
            // //         alphabetCurr[i] = alphabetCurr[i]
            // //     }
            // // }
            // // for (let i = 1; i <= 26; ++i) {
            // //     alphabetNew += alphabetCurr[i]
            // // }
            // // console.log(alphabetNew)
            // let alphabetNewArr
            // alphabetNewArr = alphabetNew.split(' ')
            // // for (let i = 0; i < 26; ++i) {
            // //     if (alphabetNewArr[i] === undefined) {
            // //         alphabetNewArr[i] = 'noLetter'
            // //     }
            // // }
            // // console.log(alphabetNewArr)
            // let alphabetNewNew = []
            // // // console.log(alphabetCurr)
            // // for (let i = 0; i < 26; ++i) {
            // //     if (alphabetCurr[i] !== alphabetNewArr[i] && alphabetNewArr[i] !== 'noLetter' && alphabetCurr[i] !== undefined) {
            // //         if (i === 0) {
            // //             alphabetNewNew = alphabetNewArr[i] + ' '
            // //         }
            // //         else {
            // //             alphabetNewNew += alphabetNewArr[i] + ' '
            // //         }
            // //     }
            // //     else {
            // //         if (i === 0) {
            // //             alphabetNewNew = alphabetCurr[i] + ' '
            // //         }
            // //         else {
            // //             alphabetNewNew = alphabetCurr[i] + ' '
            // //         }
            // //     }
            // //     // console.log(alphabetCurr[i])
            // // }
            // // console.log(alphabetNewNew)
            // for (let i = 0; i <= 26; ++i) {
            //     if (alphabetNewArr[i] !== alphabetCurr[i] && alphabetNewArr[i] !== undefined && alphabetCurr !== undefined) {
            //         //GREEN
            //         if (alphabetNewArr[i] === '<:A_green:1012673118441058404>') {
            //             alphabetNewNew[0] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:B_green:1012673120072646707>') {
            //             alphabetNewNew[1] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:C_green:1012673121892970507>') {
            //             alphabetNewNew[2] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:D_green:1012673123428094023>') {
            //             alphabetNewNew[3] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:E_green:1012673124623470612>') {
            //             alphabetNewNew[4] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:F_green:1012673125839802443>') {
            //             alphabetNewNew[5] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:G_green:1012673127605600337>') {
            //             alphabetNewNew[6] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:H_green:1012673129149108334>') {
            //             alphabetNewNew[7] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:I_green:1012673130407407676>') {
            //             alphabetNewNew[8] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:J_green:1012673131791532132>') {
            //             alphabetNewNew[9] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:K_green:1012673133133713468>') {
            //             alphabetNewNew[10] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:L_green:1012673134660419584>') {
            //             alphabetNewNew[11] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:M_green:1012673136279441508>') {
            //             alphabetNewNew[12] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:N_green:1012673137630007316>') {
            //             alphabetNewNew[13] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:O_green:1012673139135742012>') {
            //             alphabetNewNew[14] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:P_green:1012673140448571473>') {
            //             alphabetNewNew[15] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:Q_green:1012673142038204426>') {
            //             alphabetNewNew[16] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:R_green:1012673143376183387>') {
            //             alphabetNewNew[17] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:S_green:1012673144923902013>') {
            //             alphabetNewNew[18] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:T_green:1012673146320605184>') {
            //             alphabetNewNew[19] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:U_green:1012673147834744863>') {
            //             alphabetNewNew[20] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:V_green:1012673149403398176>') {
            //             alphabetNewNew[21] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:W_green:1012673151274061824>') {
            //             alphabetNewNew[22] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:X_green:1012673152721096766>') {
            //             alphabetNewNew[23] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:Y_green:1012673154746953798>') {
            //             alphabetNewNew[24] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:Z_green:1012673156462432276>') {
            //             alphabetNewNew[25] = alphabetNewArr[i]
            //         }
            //
            //         //YELLOW
            //         if (alphabetNewArr[i] === '<:A_yellow:1012673286506827806>') {
            //             alphabetNewNew[0] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:B_yellow:1012673288415223841>') {
            //             alphabetNewNew[1] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:C_yellow:1012673290340417598>') {
            //             alphabetNewNew[2] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:D_yellow:1012673292060065842>') {
            //             alphabetNewNew[3] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:E_yellow:1012673294069141525>') {
            //             alphabetNewNew[4] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:F_yellow:1012673295600070717>') {
            //             alphabetNewNew[5] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:G_yellow:1012673297365860352>') {
            //             alphabetNewNew[6] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:H_yellow:1012673299051986994>') {
            //             alphabetNewNew[7] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:I_yellow:1012673300654194789>') {
            //             alphabetNewNew[8] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:J_yellow:1012673302218686484>') {
            //             alphabetNewNew[9] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:K_yellow:1012673304106106890>') {
            //             alphabetNewNew[10] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:L_yellow:1012673305876111363>') {
            //             alphabetNewNew[11] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:M_yellow:1012673307759353876>') {
            //             alphabetNewNew[12] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:N_yellow:1012673309470642277>') {
            //             alphabetNewNew[13] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:O_yellow:1012673310955421738>') {
            //             alphabetNewNew[14] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:P_yellow:1012673312645718026>') {
            //             alphabetNewNew[15] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:Q_yellow:1012673314726105118>') {
            //             alphabetNewNew[16] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:R_yellow:1012673316605141072>') {
            //             alphabetNewNew[17] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:S_yellow:1012673318291263599>') {
            //             alphabetNewNew[18] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:T_yellow:1012673320010907660>') {
            //             alphabetNewNew[19] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:U_yellow:1012673321713807410>') {
            //             alphabetNewNew[20] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:V_yellow:1012691824227405824>') {
            //             alphabetNewNew[21] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:W_yellow:1012691826102255666>') {
            //             alphabetNewNew[22] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:X_yellow:1012691827251486732>') {
            //             alphabetNewNew[23] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:Y_yellow:1012692413560668213>') {
            //             alphabetNewNew[24] = alphabetNewArr[i]
            //         }
            //         if (alphabetNewArr[i] === '<:Z_yellow:1012692416043692082>') {
            //             alphabetNewNew[25] = alphabetNewArr[i]
            //         }
            //     }
            //     else if (alphabetNewArr[i] === alphabetCurr[i] && alphabetNewArr[i] !== undefined && alphabetCurr !== undefined) {
            //         alphabetNewNew[i] = alphabetCurr[i]
            //     }
            // }
            // // console.log(alphabetNewNew)
            // return
            // console.log(alphabetCurr)
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
                // if (i === 13) {
                //     alphabetNew += '\n'
                // }
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
            if (perfectMatch){
                await gamesSchema.deleteMany(query2)
                const message = new MessageEmbed()
                    .setTitle(`Wordle Game`)
                    .setColor('GREEN')
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
                await schema.save()
                return await interaction.reply({ embeds: [message] })
            }
            if (count >= 6){
                await gamesSchema.deleteMany(query2)
                const message = new MessageEmbed()
                    .setTitle(`Wordle Game`)
                    .setColor('RED')
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
                await schema.save()
                return await interaction.reply({ embeds: [message] })
            }

            //Update inactive time
            const expires1 = new Date()
            expires1.setMinutes(expires1.getMinutes() + 1)

            let schema2 = await gamesSchema.findOne(query)
            schema2.expires = expires1
            await schema2.save()

            schema = await gamesSchema.findOne(query2)
            schema.guesses = count
            schema.replyMessage = replyMessage
            schema.alphabet = alphabetNew
            await schema.save()
            const message = new MessageEmbed()
                .setTitle(`Wordle Game`)
                .setColor('YELLOW')
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