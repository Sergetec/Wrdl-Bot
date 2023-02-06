const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'info',
    description: 'Shows the rules of the wordle game',
    async execute(client, interaction) {
        try {
            const message = new MessageEmbed()
                .setTitle('❓ HOW TO PLAY')
                .setDescription('Guess the **word** in 6 tries.\n\nEach guess must be a **valid 5-letter word**. Use `/guess` to make your guess, then press enter to submit.\n\nAfter each guess, the colour of the letters will change to show how close your guess was to the word.\n\n__Examples:__\n• The letter **R** is in the word but in the wrong place.\n• The letter **A** is in the right place in the word.\n• All the **grey** letters are nowhere in the word.')
                .setColor('WHITE')
                .setImage('https://cdn.discordapp.com/attachments/1011356237172056065/1016439307646554152/unknown.png')
            return await interaction.reply({embeds: [message]})
        } catch(err) {
            console.log(err)
        }
    }
}