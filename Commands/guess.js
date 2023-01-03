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
    async execute(client, interaction){
        const userID = interaction.user.id
        const guildID = interaction.guild.id
        const query = {
            guildID: guildID,
            userID: userID,
        }
        const result = await gamesSchema.findOne(query)
        if (!result){
            const message = new MessageEmbed()
                .setTitle('Wordle Game')
                .setColor('RED')
                .setDescription('❗ **You have not started a game yet**')
            return await interaction.reply({ embeds: [message], ephemeral: true })
        }
        else{
            let replyMessage = result.replyMessage
            let count = result.guesses
            let wordToGuess = result.word
            let guessedWord = interaction.options.getString('word')
            if (hasWhiteSpace(guessedWord)){
                const message = new MessageEmbed()
                    .setTitle('Wordle Game')
                    .setColor('RED')
                    .setDescription('❗Your guess must **not contain spaces**')
                return await interaction.reply({ embeds: [message], ephemeral: true })
            }
            if (guessedWord.length !== 5){
                const message = new MessageEmbed()
                    .setTitle('Wordle Game')
                    .setColor('RED')
                    .setDescription('❗ Your guess must be a **5 character word**')
                return await interaction.reply({ embeds: [message], ephemeral: true })
            }
            if (hasNumber(guessedWord)){
                const message = new MessageEmbed()
                    .setTitle('Wordle Game')
                    .setColor('RED')
                    .setDescription('❗You **cannot use numbers**')
                return await interaction.reply({ embeds: [message], ephemeral: true })
            }
            count++
            let charsGuessed = ''
            //Copying
            for (let i = 0; i < 5; ++i){
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
            for (let i = 0; i < wordArray.length; ++i){
                let word = wordArray[i]
                auxChars = ''
                for (let j = 0; j < 5; ++j){
                    auxChars += word[j]
                }
                found = true
                for (let k = 0; k < 5; ++k){
                    if (charsGuessed[k] !== auxChars[k]){
                        found = false
                    }
                }
                if (found === true){
                    break
                }
            }
            if (!found){
                const message = new MessageEmbed()
                    .setTitle('Wordle Game')
                    .setColor('RED')
                    .setDescription(`❗**${charsGuessed}** is not in the words list`)
                return await interaction.reply({ embeds: [message], ephemeral: true })
            }

            //Current line
            let reply = []
            //Counter for index
            let counter
            //All are grey in the beginning
            let wordsRepeated = []
            for (let i = 97; i <= 122; ++i){
                wordsRepeated[i] = 0
            }
            for (let i = 0; i < 5; ++i){
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
            let greenFound = [0, 0, 0, 0, 0]
            for (let i = 0; i < 5; ++i){
                counter = wordToGuess[i].charCodeAt(0)
                if (charsGuessed[i] === wordToGuess[i]){
                    wordsRepeated[counter] = wordsRepeated[counter] - 1
                    greenFound[i] = greenFound[i] + 1
                    if (charsGuessed[i] === 'a'){
                        reply[i] = '<:A_green:1012673118441058404> '
                    }
                    if (charsGuessed[i] === 'b'){
                        reply[i] = '<:B_green:1012673120072646707> '
                    }
                    if (charsGuessed[i] === 'c'){
                        reply[i] = '<:C_green:1012673121892970507> '
                    }
                    if (charsGuessed[i] === 'd'){
                        reply[i] = '<:D_green:1012673123428094023> '
                    }
                    if (charsGuessed[i] === 'e'){
                        reply[i] = '<:E_green:1012673124623470612> '
                    }
                    if (charsGuessed[i] === 'f'){
                        reply[i] = '<:F_green:1012673125839802443> '
                    }
                    if (charsGuessed[i] === 'g'){
                        reply[i] = '<:G_green:1012673127605600337> '
                    }
                    if (charsGuessed[i] === 'h'){
                        reply[i] = '<:H_green:1012673129149108334> '
                    }
                    if (charsGuessed[i] === 'i'){
                        reply[i] = '<:I_green:1012673130407407676> '
                    }
                    if (charsGuessed[i] === 'j'){
                        reply[i] = '<:J_green:1012673131791532132> '
                    }
                    if (charsGuessed[i] === 'k'){
                        reply[i] = '<:K_green:1012673133133713468> '
                    }
                    if (charsGuessed[i] === 'l'){
                        reply[i] = '<:L_green:1012673134660419584> '
                    }
                    if (charsGuessed[i] === 'm'){
                        reply[i] = '<:M_green:1012673136279441508> '
                    }
                    if (charsGuessed[i] === 'n'){
                        reply[i] = '<:N_green:1012673137630007316> '
                    }
                    if (charsGuessed[i] === 'o'){
                        reply[i] = '<:O_green:1012673139135742012> '
                    }
                    if (charsGuessed[i] === 'p'){
                        reply[i] = '<:P_green:1012673140448571473> '
                    }
                    if (charsGuessed[i] === 'q'){
                        reply[i] = '<:Q_green:1012673142038204426>  '
                    }
                    if (charsGuessed[i] === 'r'){
                        reply[i] = '<:R_green:1012673143376183387> '
                    }
                    if (charsGuessed[i] === 's'){
                        reply[i] = '<:S_green:1012673144923902013> '
                    }
                    if (charsGuessed[i] === 't'){
                        reply[i] = '<:T_green:1012673146320605184> '
                    }
                    if (charsGuessed[i] === 'u'){
                        reply[i] = '<:U_green:1012673147834744863> '
                    }
                    if (charsGuessed[i] === 'v'){
                        reply[i] = '<:V_green:1012673149403398176> '
                    }
                    if (charsGuessed[i] === 'w'){
                        reply[i] = '<:W_green:1012673151274061824> '
                    }
                    if (charsGuessed[i] === 'x'){
                        reply[i] = '<:X_green:1012673152721096766> '
                    }
                    if (charsGuessed[i] === 'y'){
                        reply[i] = '<:Y_green:1012673154746953798> '
                    }
                    if (charsGuessed[i] === 'z'){
                        reply[i] = '<:Z_green:1012673156462432276> '
                    }
                }
            }
            for (let i = 0; i < 5; ++i){
                for (let j = 0; j < 5; ++j){
                    if (charsGuessed[i] === wordToGuess[j]){
                        counter = charsGuessed[i].charCodeAt(0)
                        if (!greenFound[i] && wordsRepeated[counter] > 0){
                            if (charsGuessed[i] === 'a'){
                                reply[i] = '<:A_yellow:1012673286506827806> '
                            }
                            if (charsGuessed[i] === 'b'){
                                reply[i] = '<:B_yellow:1012673288415223841> '
                            }
                            if (charsGuessed[i] === 'c'){
                                reply[i] = '<:C_yellow:1012673290340417598> '
                            }
                            if (charsGuessed[i] === 'd'){
                                reply[i] = '<:D_yellow:1012673292060065842> '
                            }
                            if (charsGuessed[i] === 'e'){
                                reply[i] = '<:E_yellow:1012673294069141525> '
                            }
                            if (charsGuessed[i] === 'f'){
                                reply[i] = '<:F_yellow:1012673295600070717> '
                            }
                            if (charsGuessed[i] === 'g'){
                                reply[i] = '<:G_yellow:1012673297365860352> '
                            }
                            if (charsGuessed[i] === 'h'){
                                reply[i] = '<:H_yellow:1012673299051986994> '
                            }
                            if (charsGuessed[i] === 'i'){
                                reply[i] = '<:I_yellow:1012673300654194789> '
                            }
                            if (charsGuessed[i] === 'j'){
                                reply[i] = '<:J_yellow:1012673302218686484> '
                            }
                            if (charsGuessed[i] === 'k'){
                                reply[i] = '<:K_yellow:1012673304106106890> '
                            }
                            if (charsGuessed[i] === 'l'){
                                reply[i] = '<:L_yellow:1012673305876111363> '
                            }
                            if (charsGuessed[i] === 'm'){
                                reply[i] = '<:M_yellow:1012673307759353876> '
                            }
                            if (charsGuessed[i] === 'n'){
                                reply[i] = '<:N_yellow:1012673309470642277> '
                            }
                            if (charsGuessed[i] === 'o'){
                                reply[i] = '<:O_yellow:1012673310955421738> '
                            }
                            if (charsGuessed[i] === 'p'){
                                reply[i] = '<:P_yellow:1012673312645718026> '
                            }
                            if (charsGuessed[i] === 'q'){
                                reply[i] = '<:Q_yellow:1012673314726105118>  '
                            }
                            if (charsGuessed[i] === 'r'){
                                reply[i] = '<:R_yellow:1012673316605141072> '
                            }
                            if (charsGuessed[i] === 's'){
                                reply[i] = '<:S_yellow:1012673318291263599> '
                            }
                            if (charsGuessed[i] === 't'){
                                reply[i] = '<:T_yellow:1012673320010907660> '
                            }
                            if (charsGuessed[i] === 'u'){
                                reply[i] = '<:U_yellow:1012673321713807410> '
                            }
                            if (charsGuessed[i] === 'v'){
                                reply[i] = '<:V_yellow:1012691824227405824> '
                            }
                            if (charsGuessed[i] === 'w'){
                                reply[i] = '<:W_yellow:1012691826102255666> '
                            }
                            if (charsGuessed[i] === 'x'){
                                reply[i] = '<:X_yellow:1012691827251486732> '
                            }
                            if (charsGuessed[i] === 'y'){
                                reply[i] = '<:Y_yellow:1012692413560668213> '
                            }
                            if (charsGuessed[i] === 'z'){
                                reply[i] = '<:Z_yellow:1012692416043692082> '
                            }
                            wordsRepeated[counter] = wordsRepeated[counter] - 1
                        }
                    }
                }
            }

            let perfectMatch = true
            for (let i = 0; i < 5; ++i){
                if (charsGuessed[i] !== wordToGuess[i]){
                    perfectMatch = false
                }
            }
            for (let i = 0; i < 5; ++i){
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
            expires1.setMinutes(expires1.getMinutes() + 5)

            let schema2 = await gamesSchema.findOne(query)
            schema2.expires = expires1
            await schema2.save()

            schema = await gamesSchema.findOne(query2)
            schema.guesses = count
            schema.replyMessage = replyMessage
            await schema.save()
            const message = new MessageEmbed()
                .setTitle(`Wordle Game`)
                .setColor('YELLOW')
                .addFields({
                    name: '\u200b',
                    value: `${replyMessage}`,
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