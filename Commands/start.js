const { Client, CommandInteraction } = require('discord.js')
const { MessageEmbed } = require('discord.js')
const fs = require('fs')
const gamesSchema = require('../Models/gamesSchema')
const statsSchema = require('../Models/statsSchema')

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

        const word = randomWord()
        const message = new MessageEmbed()
            .setTitle('Wordle Game')
            .setColor('WHITE')
            .addFields({
                name: 'Game started',
                value: '👉 Use \`/guess\` to make your guess',
            })
        await interaction.reply({ embeds: [message] });
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
    }
}

function randomWord(){
    const file = fs.readFileSync('words_list.txt', 'utf-8');
    const wordArray = file.split('\n');

    let randomWord
    let rand = Math.floor(Math.random() * wordArray.length)
    randomWord = wordArray[rand]
    return randomWord
}