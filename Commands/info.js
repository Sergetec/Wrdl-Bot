const { EmbedBuilder } = require('discord.js')

const GREEN = '#5c8d4d'

module.exports = {
    name: 'info',
    description: 'Shows the rules of the wordle game',
    async execute(client, interaction) {
        const embed = new EmbedBuilder()
            .setTitle('❓ HOW TO PLAY')
            .setDescription('Guess the **word** in 6 tries.\n\nEach guess must be a **valid 5-letter word**. Use `/guess` to make your guess, then press enter to submit.\n\nAfter each guess, the color of the letters will change to show how close your guess was to the word.\n\n__Examples:__\n• The letter **R** and **O** are in the word but in the wrong place.\n• The letter **A** is in the right place in the word.\n• All the **gray** letters are nowhere in the word.')
            .setColor(GREEN)
            .setImage('https://cdn.discordapp.com/attachments/1071147069982642246/1163805144262127719/image.png?ex=6540e900&is=652e7400&hm=e9aab45b85ea689def57bc319fc8cb3a1306d540777c7b27df3b3ac8beac9e37&')
        return await interaction.reply({ embeds: [embed] })
    }
}