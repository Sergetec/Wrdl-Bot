const { Client, CommandInteraction} = require('discord.js')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'info',
    description: 'shows info about the wordle game',
    async execute(client, interaction){
        const message = new MessageEmbed()
            .setTitle('HOW TO PLAY')
            .setDescription('Guess the **word** in 6 tries.\n\nEach guess must be a valid 5-letter word. Use `/guess` to make your guess, after that hit the enter button to submit.\n\nAfter each guess, the color of the letters will change to show how close your guess was to the word.\n\n__Examples:__\n• The letter **R** is in the word but in the wrong spot.\n• The letter **A** is in the word in the correct spot\n• All **gray** letters are not in the word in any spot.')
            .setColor('WHITE')
            .setImage('https://cdn.discordapp.com/attachments/1011356237172056065/1016439307646554152/unknown.png')
        return await interaction.reply({ embeds: [message] })
    }
}