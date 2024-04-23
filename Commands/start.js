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
const RED = '#ED4245'
const ORANGE = '#FF964D'

module.exports = {
    name: 'start',
    description: 'Start a new game',
    async execute(client, interaction) {
        const userID = interaction.user.id
        const guildID = interaction.guild.id
        const channel = interaction.channel.id
        const query = {
            userID: userID,
        }
        const result = await gamesSchema.findOne(query)
        if (result) {
            const embed = new EmbedBuilder()
                .setTitle('Wordle Game')
                .setColor(RED)
                .setDescription('❓ **You have already started a game**')
            return await interaction.reply({ embeds: [embed], ephemeral: true })
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
            {
                label: 'Hungarian',
                description: 'Hungarian language',
                value: 'hu',
                emoji: '🇭🇺',
            },
            {
                label: 'Polish',
                description: 'Polish language',
                value: 'pl',
                emoji: '🇵🇱',
            },
            {
                label: 'Indonesian',
                description: 'Indonesian language',
                value: 'id',
                emoji: '🇮🇩'
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
            .setColor(ORANGE)
            .setDescription('❗ Choose your language')
        const reply = await interaction.reply({ embeds: [message], components: [actionRow] })
        let ENGame = false, ROGame = false, TRGame = false, ESGame = false, PTGame = false, FRGame = false, ITGame = false, HUGame = false, PLGame = false, IDGame = false
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
            } else if (menuInt.values.includes('hu')) {
                HUGame = true
            } else if (menuInt.values.includes('pl')) {
                PLGame = true
            } else if (menuInt.values.includes('id')) {
                IDGame = true
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

            const HUMessage = new EmbedBuilder()
                .setTitle('Wordle Game')
                .setColor(GREEN)
                .addFields({
                    name: 'A játék elkezdődött',
                    value: '👉 A \`/guess\` használatával tippelhetsz.',
                })

            const PLMessage = new EmbedBuilder()
                .setTitle('Wordle Game')
                .setColor(GREEN)
                .addFields({
                    name: 'Gra się rozpoczęła',
                    value: '👉 Użyj \`/guess\` aby zgadnąć.',
                })

                const IDMessage = new EmbedBuilder()
                .setTitle('Wordle Game')
                .setColor(GREEN)
                .addFields({
                    name: 'Permainan dimulai',
                    value: '👉 Gunakan \`/guess\` untuk membuat tebakan Anda',
                })

            let schema

            // keyboard at the bottom
            let alphabetGray = []
            let alphabetLetters
            // all keyboard is gray at the beginning of the round
            alphabetGray[0] = 'Q_gray '
            alphabetGray[1] = 'W_gray '
            alphabetGray[2] = 'E_gray '
            alphabetGray[3] = 'R_gray '
            alphabetGray[4] = 'T_gray '
            alphabetGray[5] = 'Y_gray '
            alphabetGray[6] = 'U_gray '
            alphabetGray[7] = 'I_gray '
            alphabetGray[8] = 'O_gray '
            alphabetGray[9] = 'P_gray '
            alphabetGray[10] = 'A_gray '
            alphabetGray[11] = 'S_gray '
            alphabetGray[12] = 'D_gray '
            alphabetGray[13] = 'F_gray '
            alphabetGray[14] = 'G_gray '
            alphabetGray[15] = 'H_gray '
            alphabetGray[16] = 'J_gray '
            alphabetGray[17] = 'K_gray '
            alphabetGray[18] = 'L_gray '
            alphabetGray[19] = 'Z_gray '
            alphabetGray[20] = 'X_gray '
            alphabetGray[21] = 'C_gray '
            alphabetGray[22] = 'V_gray '
            alphabetGray[23] = 'B_gray '
            alphabetGray[24] = 'N_gray '
            alphabetGray[25] = 'M_gray '
            alphabetLetters = alphabetGray[0]
            for (let i = 1; i < 26; ++i) {
                alphabetLetters += alphabetGray[i]
            }
            if (ENGame) {
                await interaction.editReply({ embeds: [ENMessage], components: [] })
                let word = randomWord('en')

                // games database
                let expires1 = new Date()
                let dt = new Date(expires1.getTime() + 5 * 1000 * 60).toUTCString()
                schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: ' ',
                    alphabet: alphabetLetters,
                    language: 'en',
                    expires: dt,
                })
                await schema.save()
            } else if (ROGame) {
                await interaction.editReply({ embeds: [ROMessage], components: [] })
                let word = randomWord('ro')

                // games database
                let expires1 = new Date()
                let dt = new Date(expires1.getTime() + 5 * 1000 * 60).toUTCString()
                schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: ' ',
                    alphabet: alphabetLetters,
                    language: 'ro',
                    expires: dt,
                })
                await schema.save()
            } else if (TRGame) {
                await interaction.editReply({ embeds: [TRMessage], components: [] })
                let word = randomWord('tr')

                // games database
                let expires1 = new Date()
                let dt = new Date(expires1.getTime() + 5 * 1000 * 60).toUTCString()
                schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: ' ',
                    alphabet: alphabetLetters,
                    language: 'tr',
                    expires: dt,
                })
                await schema.save()
            } else if (ESGame) {
                await interaction.editReply({ embeds: [ESMessage], components: [] })
                let word = randomWord('es')

                // games database
                let expires1 = new Date()
                let dt = new Date(expires1.getTime() + 5 * 1000 * 60).toUTCString()
                schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: ' ',
                    alphabet: alphabetLetters,
                    language: 'es',
                    expires: dt,
                })
                await schema.save()
            } else if (PTGame) {
                await interaction.editReply({ embeds: [PTMessage], components: [] })
                let word = randomWord('pt')

                // games database
                let expires1 = new Date()
                let dt = new Date(expires1.getTime() + 5 * 1000 * 60).toUTCString()
                schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: ' ',
                    alphabet: alphabetLetters,
                    language: 'pt',
                    expires: dt,
                })
                await schema.save()
            } else if (FRGame) {
                await interaction.editReply({ embeds: [FRMessage], components: [] })
                let word = randomWord('fr')

                // games database
                let expires1 = new Date()
                let dt = new Date(expires1.getTime() + 5 * 1000 * 60).toUTCString()
                schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: ' ',
                    alphabet: alphabetLetters,
                    language: 'fr',
                    expires: dt,
                })
                await schema.save()
            } else if (ITGame) {
                await interaction.editReply({ embeds: [ITMessage], components: [] })
                let word = randomWord('it')

                // games database
                let expires1 = new Date()
                let dt = new Date(expires1.getTime() + 5 * 1000 * 60).toUTCString()
                schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: ' ',
                    alphabet: alphabetLetters,
                    language: 'it',
                    expires: dt,
                })
                await schema.save()
            } else if (HUGame) {
                await interaction.editReply({ embeds: [HUMessage], components: [] })
                let word = randomWord('hu')

                // games database
                let expires1 = new Date()
                let dt = new Date(expires1.getTime() + 5 * 1000 * 60).toUTCString()
                schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: '\n',
                    alphabet: alphabetLetters,
                    language: 'hu',
                    expires: dt,
                })
                await schema.save()
            } else if (PLGame) {
                await interaction.editReply({ embeds: [PLMessage], components: [] })
                let word = randomWord('pl')

                // games database
                let expires1 = new Date()
                let dt = new Date(expires1.getTime() + 5 * 1000 * 60).toUTCString()
                schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: ' ',
                    alphabet: alphabetLetters,
                    language: 'pl',
                    expires: dt,
                })
                await schema.save()
            } else if (IDGame) {
                await interaction.editReply({ embeds: [IDMessage], components: [] })
                let word = randomWord('id')

                // games database
                let expires1 = new Date()
                let dt = new Date(expires1.getTime() + 5 * 1000 * 60).toUTCString()
                schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: ' ',
                    alphabet: alphabetLetters,
                    language: 'id',
                    expires: dt,
                })
                await schema.save()
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
                    .setColor(RED)
                    .setDescription('❗ Time has expired')
                return await interaction.editReply({ embeds: [messageExpired], components: [] })
            }
        })
    }
}

function randomWord(lang) {
    const file = fs.readFileSync(`Words/words_${lang}.txt`, 'utf-8')
    const wordArray = file.split('\n')

    let randomWord
    let rand = Math.floor(Math.random() * wordArray.length)
    randomWord = wordArray[rand]
    return randomWord
}