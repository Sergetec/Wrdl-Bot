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
            {
                label: 'Croatian',
                description: 'Croatian language',
                value: 'hr',
                emoji: '🇭🇷'
            },
        ]

        const menu = new StringSelectMenuBuilder()
            .setCustomId('languages')
            .setMinValues(1)
            .setMaxValues(1)
            .setPlaceholder('Select a language...')
            .addOptions(languages.map(language =>
                    new StringSelectMenuOptionBuilder()
                        .setLabel(language.label)
                        .setDescription(language.description)
                        .setValue(language.value)
                        .setEmoji(language.emoji)
                )
            )

        const actionRow = new ActionRowBuilder().addComponents(menu)

        const messages = {
            en: {
                embed: new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor(GREEN)
                    .addFields({
                        name: 'Game started',
                        value: '👉 Use `/guess` to make your guess',
                    }),
                gameFlag: 'ENGame'
            },
            ro: {
                embed: new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor(GREEN)
                    .addFields({
                        name: 'Joc început',
                        value: '👉 Folosește `/guess` pentru a ghici cuvântul',
                    }),
                gameFlag: 'ROGame'
            },
            tr: {
                embed: new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor(GREEN)
                    .addFields({
                        name: 'Oyun başladı',
                        value: '👉 Tahmininizi yapmak için `/guess` kullanın',
                    }),
                gameFlag: 'TRGame'
            },
            es: {
                embed: new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor(GREEN)
                    .addFields({
                        name: 'Juego iniciado',
                        value: '👉 Utiliza `/guess` para hacer tus conjetura',
                    }),
                gameFlag: 'ESGame'
            },
            pt: {
                embed: new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor(GREEN)
                    .addFields({
                        name: 'Jogo iniciado',
                        value: '👉 Utilize `/guess` para dar o seu palpite',
                    }),
                gameFlag: 'PTGame'
            },
            fr: {
                embed: new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor(GREEN)
                    .addFields({
                        name: 'Le jeu a commencé',
                        value: '👉 Utilisez `/guess` pour faire votre supposition',
                    }),
                gameFlag: 'FRGame'
            },
            it: {
                embed: new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor(GREEN)
                    .addFields({
                        name: 'Partita iniziata',
                        value: '👉 Usare `/guess` per fare la propria ipotesi',
                    }),
                gameFlag: 'ITGame'
            },
            hu: {
                embed: new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor(GREEN)
                    .addFields({
                        name: 'A játék elkezdődött',
                        value: '👉 A `/guess` használatával tippelhetsz.',
                    }),
                gameFlag: 'HUGame'
            },
            pl: {
                embed: new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor(GREEN)
                    .addFields({
                        name: 'Gra się rozpoczęła',
                        value: '👉 Użyj `/guess` aby zgadnąć.',
                    }),
                gameFlag: 'PLGame'
            },
            id: {
                embed: new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor(GREEN)
                    .addFields({
                        name: 'Permainan dimulai',
                        value: '👉 Gunakan `/guess` untuk membuat tebakan Anda',
                    }),
                gameFlag: 'IDGame'
            },
            hr: {
                embed: new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor(GREEN)
                    .addFields({
                        name: 'Igra je počela',
                        value: '👉 Koristite `/guess` da biste pogodili',
                    }),
                gameFlag: 'HRGame'
            },
        }

        const message = new EmbedBuilder()
            .setTitle('Wordle Game')
            .setColor(ORANGE)
            .setDescription('❗ Choose your language')

        const reply = await interaction.reply({ embeds: [message], components: [actionRow] })
        const filter = (interaction) => interaction.user.id === userID
        const time = 1000 * 30 // 30 seconds

        const collector = reply.createMessageComponentCollector({
            filter: filter,
            max: 1,
            time: time,
        })

        const alphabetGray = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('').map(letter => `${letter}_gray`).join(' ')

        collector.on('collect', async (menuInt) => {
            await menuInt.deferUpdate()
            const selectedLanguage = menuInt.values[0]
            const selectedMessage = messages[selectedLanguage]

            if (selectedMessage) {
                await interaction.editReply({ embeds: [selectedMessage.embed], components: [] })

                const word = randomWord(selectedLanguage)
                const expires1 = new Date()
                const dt = new Date(expires1.getTime() + 5 * 1000 * 60).toUTCString()
                const schema = await gamesSchema.create({
                    guildID: guildID,
                    channelStarted: channel,
                    userID: userID,
                    word: word,
                    guesses: '0',
                    replyMessage: ' ',
                    alphabet: alphabetGray,
                    language: selectedLanguage,
                    expires: dt,
                })
                await schema.save()

                let userStats = await statsSchema.findOne({ guildID, userID })
                if (userStats) {
                    userStats.gamesTotal += 1
                } else {
                    userStats = await statsSchema.create({
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
                }
                await userStats.save()
            }
        })
        collector.on('end', async (collected) => {
            if (collected.size === 0) {
                const messageExpired = new EmbedBuilder()
                    .setTitle('Wordle Game')
                    .setColor(RED)
                    .setDescription('❗ Time has expired')
                await interaction.editReply({ embeds: [messageExpired], components: [] })
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