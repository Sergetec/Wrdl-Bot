const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const fs = require('fs')
const gamesSchema = require('../Models/gamesSchema')
const statsSchema = require('../Models/statsSchema')

module.exports = {
    name: 'start',
    description: 'Start a new game',
    async execute(client, interaction) {
        try {
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
                return await interaction.reply({embeds: [message], ephemeral: true})
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
                .setColor('#FF964D')
                .setDescription('❗ Choose your language')
            await interaction.reply({ embeds: [message], components: [row] })
            let ENGame = false, ROGame = false
            let collector
            const filter = (interaction) => interaction.user.id === userID
            const time = 1000 * 30

            collector = interaction.channel.createMessageComponentCollector({filter, max: 1, time})
            collector.on('collect', async (btnInt) => {
                if (!btnInt) {
                    return
                }
                if (btnInt.customId !== 'EN' && btnInt.customId !== 'RO') {
                    return
                }
                await btnInt.deferUpdate()
                switch (btnInt.customId) {
                    case 'EN':
                        ENGame = true;
                        break
                    case 'RO':
                        ROGame = true
                        break
                }
                collector.on('end', async () => {
                    const messageExpired = new MessageEmbed()
                        .setTitle('Wordle Game')
                        .setColor('RED')
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
                //All alphabet is gray
                alphabetGray[0] = '<:A_gray:1012692989807693834> '
                alphabetGray[1] = '<:B_gray:1012692991510589600> '
                alphabetGray[2] = '<:C_gray:1012692993121210459> '
                alphabetGray[3] = '<:D_gray:1012692994656305214> '
                alphabetGray[4] = '<:E_gray:1012692996396957776> '
                alphabetGray[5] = '<:F_gray:1012692997957238825> '
                alphabetGray[6] = '<:G_gray:1012692999613972520> '
                alphabetGray[7] = '<:H_gray:1012693001170071632> '
                alphabetGray[8] = '<:I_gray:1012693002638077952> '
                alphabetGray[9] = '<:J_gray:1012693004064145509> '
                alphabetGray[10] = '<:K_gray:1012693005548920852> '
                alphabetGray[11] = '<:L_gray:1012693006769463408> '
                alphabetGray[12] = '<:M_gray:1012693008300396564> '
                alphabetGray[13] = '\n<:N_gray:1012693009411878953> '
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
                }
                if (ENGame) {
                    await interaction.editReply({ embeds: [ENMessage], components: [deadRowEN] })
                    let word = randomWord_EN()

                    //Stats database
                    let expires1 = new Date()
                    let dt = new Date(expires1.getTime() + 123 * 60 * 1000)
                    dt = dt.toLocaleString('ro-RO', { timezone: 'Europe/Bucharest' })
                    schema = await gamesSchema.create({
                        guildID: guildID,
                        channelStarted: channel,
                        userID: userID,
                        word: word,
                        guesses: '0',
                        replyMessage: '\n',
                        alphabet: alphabetLetters,
                        language: 'EN',
                        expires: dt,
                    })
                    await schema.save();
                }
                if (ROGame) {
                    await interaction.editReply({ embeds: [ROMessage], components: [deadRowRO] })
                    let word = randomWord_RO()

                    //Stats database
                    let expires1 = new Date()
                    let dt = new Date(expires1.getTime() + 123 * 60 * 1000)
                    dt = dt.toLocaleString('ro-RO', { timezone: 'Europe/Bucharest' })
                    schema = await gamesSchema.create({
                        guildID: guildID,
                        channelStarted: channel,
                        userID: userID,
                        word: word,
                        guesses: '0',
                        replyMessage: '\n',
                        alphabet: alphabetLetters,
                        language: 'RO',
                        expires: dt,
                    })
                    await schema.save();
                }

                schema = await statsSchema.findOne(query)
                if (schema) {
                    schema.gamesTotal = schema.gamesTotal + 1
                    await schema.save()
                }
                else {
                    schema = await statsSchema.create({
                        guildID: guildID,
                        userID: userID,
                        gamesTotal: 1,
                        gamesWon: 0,
                        gamesLost: 0,
                        winRate: 0,
                        oneGuess: 0,
                        twoGuess: 0,
                        threeGuess: 0,
                        fourGuess: 0,
                        fiveGuess: 0,
                        sixGuess: 0,
                    })
                    await schema.save()
                }
            })
        } catch(err) {
            console.log(err)
        }
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

function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("ro-RO", {timeZone: tzString}))
}