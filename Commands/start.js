const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} = require('discord.js')
const fs = require('node:fs')
const gamesSchema = require('../Models/gamesSchema')
const statsSchema = require('../Models/statsSchema')

const GREEN = '#5c8d4d'

module.exports = {
    name: 'start',
    description: 'Start a new game',
    async execute(client, interaction) {
        const userID = interaction.user.id
        const guildID = interaction.guild.id
        const channel = interaction.channel.id
        const query = {
            // guildID: guildID,
            userID: userID,
        }
        const result = await gamesSchema.findOne(query)
        if (result) {
            const message = new EmbedBuilder()
                .setTitle('Wordle Game')
                .setColor('#ED4245')
                .setDescription('❓ **You have already started a game**')
            return await interaction.reply({ embeds: [message], ephemeral: true })
        }

        const languages = [
            {
                label: 'English',
                description: 'English language',
                value: 'en',
                emoji: '🇬🇧'
            },
            {
                label: 'Romanian',
                description: 'Romanian language',
                value: 'ro',
                emoji: '🇷🇴',
            },
            {
                label: 'Turkish',
                description: 'Turkish language',
                value: 'tr',
                emoji: '🇹🇷',
            },
            {
                label: 'Spanish',
                description: 'Spanish language',
                value: 'es',
                emoji: '🇪🇸'
            },
            {
                label: 'Portuguese',
                description: 'Portuguese language',
                value: 'pt',
                emoji: '🇵🇹'
            },
            {
                label: 'French',
                description: 'French language',
                value: 'fr',
                emoji: '🇫🇷',
            },
            {
                label: 'Italian',
                description: 'Italian language',
                value: 'it',
                emoji: '🇮🇹',
            },
        ]

        const menu = new StringSelectMenuBuilder()
            .setCustomId('languages')
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder('Select a language...')
            .addOptions(languages.map((language) =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(language.label)
                        .setDescription(language.description)
                        .setValue(language.value)
                        .setEmoji(language.emoji)
                )
            );

        const actionRow = new ActionRowBuilder().addComponents(menu)

        const message = new EmbedBuilder()
            .setTitle('Wordle Game')
            .setColor('#FF964D')
            .setDescription('❗ Choose your language')
        const reply = await interaction.reply({ embeds: [message], components: [actionRow] })
        let ENGame = false, ROGame = false, TRGame = false, ESGame = false, PTGame = false, FRGame = false, ITGame = false
        const filter = (interaction) => interaction.user.id === userID
        const time = 1000 * 30 //30 seconds

        const collector = reply.createMessageComponentCollector({
            filter: filter,
            max: 1,
            time: time
        })
        collector.on('collect', async (menuInt) => {
            await menuInt.deferUpdate()
            if (menuInt.values.includes('en')) {
                ENGame = true
            } else if (menuInt.values.includes('ro')) {
                ROGame = true
            } else if (menuInt.values.includes('tr')) {
                TRGame = true
            } else if (menuInt.values.includes('es')) {
                ESGame = true
            } else if (menuInt.values.includes('pt')) {
                PTGame = true
            } else if (menuInt.values.includes('fr')) {
                FRGame = true
            } else if (menuInt.values.includes('it')) {
                ITGame = true
            }
            const ROMessage = new EmbedBuilder()
                .setTitle('Wordle Game')
                .setColor(GREEN)
                .addFields({
                    name: 'Joc început',
                    value: '👉 Folosește \`/guess\` pentru a ghici cuvântul',
                })

            const ENMessage = new EmbedBuilder()
                .setTitle('Wordle Game')
                .setColor(GREEN)
                .addFields({
                    name: 'Game started',
                    value: '👉 Use \`/guess\` to make your guess',
                })

            const TRMessage = new EmbedBuilder()
                .setTitle('Wordle Game')
                .setColor(GREEN)
                .addFields({
                    name: 'Oyun başladı',
                    value: '👉 Tahmininizi yapmak için \`/guess\` kullanın',
                })

            const ESMessage = new EmbedBuilder()
                .setTitle('Wordle Game')
                .setColor(GREEN)
                .addFields({
                    name: 'Juego iniciado',
                    value: '👉 Utiliza \`/guess\` para hacer tus conjetura',
                })

            const PTMessage = new EmbedBuilder()
                .setTitle('Wordle Game')
                .setColor(GREEN)
                .addFields({
                    name: 'Jogo iniciado',
                    value: '👉 Utilize \`/guess\` para dar o seu palpite',
                })

            const FRMessage = new EmbedBuilder()
                .setTitle('Wordle Game')
                .setColor(GREEN)
                .addFields({
                    name: 'Le jeu a commencé',
                    value: '👉 Utilisez \`/guess\` pour faire votre supposition',
                })

            const ITMessage = new EmbedBuilder()
                .setTitle('Wordle Game')
                .setColor(GREEN)
                .addFields({
                    name: 'Partita iniziata',
                    value: '👉 Usare \`/guess\` per fare la propria ipotesi',
                })

            let schema

            //Alphabet/keyboard at the bottom
            let alphabetGray = []
            let alphabetLetters
            //All alphabet is gray
            alphabetGray[0] = '<:Q_gray:1012693014516342864> '
            alphabetGray[1] = '<:W_gray:1012693024507187280> '
            alphabetGray[2] = '<:E_gray:1012692996396957776> '
            alphabetGray[3] = '<:R_gray:1012693015720120351> '
            alphabetGray[4] = '<:T_gray:1012693019343978606> '
            alphabetGray[5] = '<:Y_gray:1012693029661974578> '
            alphabetGray[6] = '<:U_gray:1012693020891693136> '
            alphabetGray[7] = '<:I_gray:1012693002638077952> '
            alphabetGray[8] = '<:O_gray:1012693011286736957> '
            alphabetGray[9] = '<:P_gray:1012693012956057640> '
            alphabetGray[10] = '\n⠀<:A_gray:1012692989807693834> '
            alphabetGray[11] = '<:S_gray:1012693017473335331> '
            alphabetGray[12] = '<:D_gray:1012692994656305214> '
            alphabetGray[13] = '<:F_gray:1012692997957238825> '
            alphabetGray[14] = '<:G_gray:1012692999613972520> '
            alphabetGray[15] = '<:H_gray:1012693001170071632> '
            alphabetGray[16] = '<:J_gray:1012693004064145509> '
            alphabetGray[17] = '<:K_gray:1012693005548920852> '
            alphabetGray[18] = '<:L_gray:1012693006769463408> '
            alphabetGray[19] = '\n⠀⠀⠀<:Z_gray:1012693031402622996> '
            alphabetGray[20] = '<:X_gray:1012693027778732132> '
            alphabetGray[21] = '<:C_gray:1012692993121210459> '
            alphabetGray[22] = '<:V_gray:1012693022506487828> '
            alphabetGray[23] = '<:B_gray:1012692991510589600> '
            alphabetGray[24] = '<:N_gray:1012693009411878953> '
            alphabetGray[25] = '<:M_gray:1012693008300396564> '
            alphabetLetters = alphabetGray[0]
            for (let i = 1; i < 26; ++i) {
                alphabetLetters += alphabetGray[i]
            }
            if (ENGame) {
                await interaction.editReply({ embeds: [ENMessage], components: [] })
                let word = randomWord('en')

                //Games database
                let expires1 = new Date()
                let dt = new Date(expires1.getTime() + 3 * 1000 * 60).toUTCString()
                schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: '\n',
                    alphabet: alphabetLetters,
                    language: 'en',
                    expires: dt,
                })
                await schema.save();
            } else if (ROGame) {
                await interaction.editReply({ embeds: [ROMessage], components: [] })
                let word = randomWord('ro')

                //Games database
                let expires1 = new Date()
                let dt = new Date(expires1.getTime() + 3 * 1000 * 60).toUTCString()
                schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: '\n',
                    alphabet: alphabetLetters,
                    language: 'ro',
                    expires: dt,
                })
                await schema.save();
            } else if (TRGame) {
                await interaction.editReply({ embeds: [TRMessage], components: [] })
                let word = randomWord('tr')

                //Games database
                let dt = new Date()
                dt = new Date(dt.getTime() + 3 * 60 * 1000).toUTCString()
                schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: '\n',
                    alphabet: alphabetLetters,
                    language: 'tr',
                    expires: dt,
                })
                await schema.save();
            } else if (ESGame) {
                await interaction.editReply({ embeds: [ESMessage], components: [] })
                let word = randomWord('es')

                //Games database
                let dt = new Date()
                dt = new Date(dt.getTime() + 3 * 60 * 1000).toUTCString()
                schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: '\n',
                    alphabet: alphabetLetters,
                    language: 'es',
                    expires: dt,
                })
                await schema.save();
            } else if (PTGame) {
                await interaction.editReply({ embeds: [PTMessage], components: [] })
                let word = randomWord('pt')

                //Games database
                let dt = new Date()
                dt = new Date(dt.getTime() + 3 * 60 * 1000).toUTCString()
                schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: '\n',
                    alphabet: alphabetLetters,
                    language: 'pt',
                    expires: dt,
                })
                await schema.save();
            } else if (FRGame) {
                await interaction.editReply({ embeds: [FRMessage], components: [] })
                let word = randomWord('fr')

                //Games database
                let dt = new Date()
                dt = new Date(dt.getTime() + 3 * 60 * 1000).toUTCString()
                schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: '\n',
                    alphabet: alphabetLetters,
                    language: 'fr',
                    expires: dt,
                })
                await schema.save();
            } else if (ITGame) {
                await interaction.editReply({ embeds: [ITMessage], components: [] })
                let word = randomWord('it')

                //Games database
                let dt = new Date()
                dt = new Date(dt.getTime() + 3 * 60 * 1000).toUTCString()
                schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: '\n',
                    alphabet: alphabetLetters,
                    language: 'it',
                    expires: dt,
                })
                await schema.save();
            }

            schema = await statsSchema.findOne(query)
            if (schema) {
                schema.gamesTotal = schema.gamesTotal + 1
                schema.guildID = guildID
                await schema.save()
            } else {
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
                    currentStreak: 0,
                    maxStreak: 0,
                    voteCount: 0,
                })
                await schema.save()
            }
        })
        collector.on('end', async (collected) => {
            if (collected.size === 0) {
                const messageExpired = new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor('#ED4245')
                    .setDescription('❗ Time has expired')
                return await interaction.editReply({ embeds: [messageExpired], components: [] })
            }
        })
    }
}

function randomWord(op) {
    const file = fs.readFileSync(`Words/words_${op}.txt`, 'utf-8')
    const wordArray = file.split('\n')

    let randomWord
    let rand = Math.floor(Math.random() * wordArray.length)
    randomWord = wordArray[rand]
    return randomWord
}