const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const fs = require('fs')
const gamesSchema = require('../Models/gamesSchema')
const statsSchema = require('../Models/statsSchema')

module.exports = {
    name: 'start',
    description: 'starts the game',
    async execute(client, interaction) {
        const userID = interaction.user.id
        const guildID = interaction.guild.id
        const channel = interaction.channel.id
        const query = {
            guildID: guildID,
            userID: userID,
        }
        const result = await gamesSchema.findOne(query)
        if (result) {
            const message = new MessageEmbed()
                .setTitle('Wordle Game')
                .setColor('RED')
                .setDescription('❓ **You have already started a game**')
            return await interaction.reply({ embeds: [message], ephemeral: true })
        }

        const row = new MessageActionRow()
        row.addComponents(
            new MessageButton()
                .setCustomId('EN')
                .setLabel('English')
                .setEmoji('🇬🇧')
                .setStyle('PRIMARY')
        )
        row.addComponents(
            new MessageButton()
                .setCustomId('RO')
                .setLabel('Romanian')
                .setEmoji('🇷🇴')
                .setStyle('PRIMARY')
        )
        const deadRowEN = new MessageActionRow()
        deadRowEN.addComponents(
            new MessageButton()
                .setCustomId('EN')
                .setLabel('English')
                .setEmoji('🇬🇧')
                .setStyle('SUCCESS')
        )
        deadRowEN.addComponents(
            new MessageButton()
                .setCustomId('RO')
                .setLabel('Romanian')
                .setEmoji('🇷🇴')
                .setStyle('PRIMARY')
        )

        const deadRowRO = new MessageActionRow()
        deadRowRO.addComponents(
            new MessageButton()
                .setCustomId('EN')
                .setLabel('English')
                .setEmoji('🇬🇧')
                .setStyle('PRIMARY')
        )
        deadRowRO.addComponents(
            new MessageButton()
                .setCustomId('RO')
                .setLabel('Romanian')
                .setEmoji('🇷🇴')
                .setStyle('SUCCESS')
        )

        const message = new MessageEmbed()
            .setTitle('Wordle Game')
            .setColor('RED')
            .setDescription('❗ Choose your language')
        await interaction.reply({ embeds: [message], components: [row] })
        let ENGame = false, ROGame = false
        let collector
        const filter = (interaction) => interaction.user.id === userID
        const time = 1000 * 30

        collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time })
        collector.on('collect', async (btnInt) => {
            if (!btnInt) {
                return;
            }
            if (btnInt.customId !== 'EN' && btnInt.customId !== 'RO') {
                return;
            }
            await btnInt.deferUpdate()
            switch (btnInt.customId) {
                case 'EN':
                    ENGame = true;
                    break;
                case 'RO':
                    ROGame = true
                    break;
            }
            collector.on('end', async () => {
                const messageExpired = new MessageEmbed()
                    .setTitle('Wordle Game')
                    .setColor('WHITE')
                    .setDescription('❗ Time has expired')
                return await interaction.editReply({ embeds: [messageExpired], components: [deadRow] })
            })

            const ROMessage = new MessageEmbed()
                .setTitle('Wordle Game')
                .setColor('GREEN')
                .addFields({
                    name: 'Joc început',
                    value: '👉 Folosește \`/guess\` pentru a ghici cuvântul',
                })

            const ENMessage = new MessageEmbed()
                .setTitle('Wordle Game')
                .setColor('GREEN')
                .addFields({
                    name: 'Game started',
                    value: '👉 Use \`/guess\` to make your guess',
                })

            let schema

            //Alphabet/keyboard at the bottom
            let alphabetGray = []
            let alphabetLetters
            //all alphabet is gray
            // alphabetGray[0] = '<:A_darker_gray:1064629141342793908> '
            // alphabetGray[1] = '<:B_darker_gray:1064629144933122118> '
            // alphabetGray[2] = '<:C_darker_gray:1064629146510168105> '
            // alphabetGray[3] = '<:D_darker_gray:1064629149672685690> '
            // alphabetGray[4] = '<:E_darker_gray:1064629151396540506> '
            // alphabetGray[5] = '<:F_darker_gray:1064629153804058694> '
            // alphabetGray[6] = '<:G_darker_gray:1064629155364356116> '
            // alphabetGray[7] = '<:H_darker_gray:1064629158325522462> '
            // alphabetGray[8] = '<:I_darker_gray:1064629159579635865> '
            // alphabetGray[9] = '<:J_darker_gray:1064629162867953754> '
            // alphabetGray[10] = '<:K_darker_gray:1064629164784758835> '
            // alphabetGray[11] = '<:L_darker_gray:1064629167783690402> '
            // alphabetGray[12] = '<:M_darker_gray:1064629169134260234> '
            // alphabetGray[13] = '<:N_darker_gray:1064629171453702316> '
            // alphabetGray[14] = '<:O_darker_gray:1064629174238707772> '
            // alphabetGray[15] = '<:P_darker_gray:1064629176671416460> '
            // alphabetGray[16] = '<:Q_darker_gray:1064634245873680485> '
            // alphabetGray[17] = '<:R_darker_gray:1064634248495112282> '
            // alphabetGray[18] = '<:S_darker_gray:1064634250252537946> '
            // alphabetGray[19] = '<:T_darker_gray:1064634252664254595> '
            // alphabetGray[20] = '<:U_darker_gray:1064634254287454380> '
            // alphabetGray[21] = '<:V_darker_gray:1064634280719941713> '
            // alphabetGray[22] = '<:W_darker_gray:1064634282141810780> '
            // alphabetGray[23] = '<:X_darker_gray:1064634283735658576> '
            // alphabetGray[24] = '<:Y_darker_gray:1064634286533259354> '
            // alphabetGray[25] = '<:Z_darker_gray:1064634287917387916> '

            alphabetGray[0] = '<:A_gray:1012692989807693834> '
            alphabetGray[1] = '<:B_gray:1012692991510589600> '
            alphabetGray[2] = '<:C_gray:1012692993121210459> '
            alphabetGray[3] = '<:D_gray:1012692994656305214> '
            alphabetGray[4] = '<:E_gray:1012692996396957776> '
            alphabetGray[5] = '<:F_gray:1012692997957238825> '
            alphabetGray[6] = '<:G_gray:1012692999613972520> '
            alphabetGray[7] = '<:I_gray:1012693002638077952> '
            alphabetGray[8] = '<:I_gray:1012693002638077952> '
            alphabetGray[9] = '<:J_gray:1012693004064145509> '
            alphabetGray[10] = '<:K_gray:1012693005548920852> '
            alphabetGray[11] = '<:L_gray:1012693006769463408> '
            alphabetGray[12] = '<:M_gray:1012693008300396564> '
            alphabetGray[13] = '<:N_gray:1012693009411878953> '
            alphabetGray[14] = '<:O_gray:1012693011286736957> '
            alphabetGray[15] = '<:P_gray:1012693012956057640> '
            alphabetGray[16] = '<:Q_gray:1012693014516342864> '
            alphabetGray[17] = '<:R_gray:1012693015720120351> '
            alphabetGray[18] = '<:S_gray:1012693017473335331> '
            alphabetGray[19] = '<:T_gray:1012693019343978606> '
            alphabetGray[20] = '<:U_gray:1012693020891693136> '
            alphabetGray[21] = '<:V_gray:1012693022506487828> '
            alphabetGray[22] = '<:W_gray:1012693024507187280> '
            alphabetGray[23] = '<:X_gray:1012693027778732132> '
            alphabetGray[24] = '<:Y_gray:1012693029661974578> '
            alphabetGray[25] = '<:Z_gray:1012693031402622996> '
            for (let i = 0; i < 26; ++i) {
                if (i === 0) {
                    alphabetLetters = alphabetGray[i]
                }
                else {
                    alphabetLetters += alphabetGray[i]
                }
                if (i === 12) {
                    alphabetLetters += '\n'
                }
            }
            if (ENGame) {
                await interaction.editReply({ embeds: [ENMessage], components: [deadRowEN] })
                let word = randomWord_EN()

                //Stats database
                const expires1 = new Date()
                expires1.setMinutes(expires1.getMinutes() + 2)
                schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: '\n',
                    alphabet: alphabetLetters,
                    language: 'EN',
                    expires: expires1,
                })
                await schema.save();
            }
            if (ROGame) {
                await interaction.editReply({ embeds: [ROMessage], components: [deadRowRO] })
                let word = randomWord_RO()

                //Stats database
                const expires1 = new Date()
                expires1.setMinutes(expires1.getMinutes() + 2)
                schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: '\n',
                    alphabet: alphabetLetters,
                    language: 'RO',
                    expires: expires1,
                })
                await schema.save();
            }

            schema = await statsSchema.findOne(query)
            if (schema){
                schema.gamesTotal = schema.gamesTotal + 1
                await schema.save()
            }
            else{
                schema = await statsSchema.create({
                    guildID: guildID,
                    userID: userID,
                    gamesTotal: 1,
                    gamesWon: 0,
                    gamesLost: 0,
                    winRate: 0,
                })
                await schema.save()
            }
        })
    }
}

function randomWord_EN() {
    const file = fs.readFileSync('Words/words_en.txt', 'utf-8')
    const wordArray = file.split('\n')

    let randomWord
    let rand = Math.floor(Math.random() * wordArray.length)
    randomWord = wordArray[rand]
    return randomWord
}

function randomWord_RO() {
    const file = fs.readFileSync('Words/words_ro.txt', 'utf-8')
    const wordArray = file.split('\n')

    let randomWord
    let rand = Math.floor(Math.random() * wordArray.length)
    randomWord = wordArray[rand]
    return randomWord
}