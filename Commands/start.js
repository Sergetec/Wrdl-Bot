const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const fs = require('fs')
const gamesSchema = require('../Models/gamesSchema')
const statsSchema = require('../Models/statsSchema')

global.ROGame = false
global.ENGame = false

module.exports = {
    name: 'start',
    description: 'starts the game',
    async execute(client, interaction){
        const userID = interaction.user.id
        const guildID = interaction.guild.id
        const channel = interaction.channel.id
        const query = {
            guildID: guildID,
            userID: userID,
        }
        const result = await gamesSchema.findOne(query)
        if (result){
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

        let collector
        const filter = (interaction) => interaction.user.id === userID
        const time = 1000 * 30

        collector = interaction.channel.createMessageComponentCollector({ filter, max: 1, time })
        collector.on('collect', async (btnInt) => {
            if (!btnInt){
                return;
            }
            if (btnInt.customId !== 'EN' && btnInt.customId !== 'RO'){
                return;
            }
            await btnInt.deferUpdate()
            switch (btnInt.customId){
                case 'RO':
                        global.ROGame = true
                    break;
                case 'EN':
                    global.ENGame = true;
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

            let word
            if (global.ROGame){
                await interaction.editReply({ embeds: [ROMessage], components: [deadRowRO] })
                word = randomWord_RO()
            }
            if (global.ENGame){
                await interaction.editReply({ embeds: [ENMessage], components: [deadRowEN] })
                word = randomWord_EN()
            }

            //Stats database
            const expires1 = new Date()
            expires1.setMinutes(expires1.getMinutes() + 5)
            let schema = await gamesSchema.create({
                guildID: guildID,
                channelStarted: channel,
                userID: userID,
                word: word,
                guesses: '0',
                replyMessage: '\n',
                expires: expires1,
            })
            await schema.save();

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

function randomWord_EN(){
    const file = fs.readFileSync('words_en.txt', 'utf-8');
    const wordArray = file.split('\n');

    let randomWord
    let rand = Math.floor(Math.random() * wordArray.length)
    randomWord = wordArray[rand]
    return randomWord
}

function randomWord_RO(){
    const file = fs.readFileSync('words_ro.txt', 'utf-8');
    const wordArray = file.split('\n');

    let randomWord
    let rand = Math.floor(Math.random() * wordArray.length)
    randomWord = wordArray[rand]
    return randomWord
}