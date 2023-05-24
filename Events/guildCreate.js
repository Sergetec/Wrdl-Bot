const { EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'guildCreate',
    description: 'When bot joins a new guild',
    on: true,
    async execute(guild) {
        if (!guild.available) {
            return console.log("Not available")
        }
        let channelToSend = ""
        guild.channels.cache.forEach((channel) => {
            if (channel.type === ChannelType.GuildText && channelToSend === "") {
                if (channel.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.SendMessages) && channel.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.ViewChannel)) {
                    channelToSend = channel
                }
            }
        })
        // channelToSend = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.SendMessages))
        if (!channelToSend) {
            return console.log("No channel to send")
        }
        const message = new EmbedBuilder()
            .setTitle('Wordle Bot')
            .setColor('#FF964D')
            .setDescription(
                `👋 **Hi, I am Wordle Bot!**
            
            You can play the famous game **Wordle** in your favourite servers 😆 just use \`/start\`
            After starting the game, use \`/guess\` to make your guesses
            
            👉・If you don\'t know how to play, do \`/info\` and I will show you the rules of the game
            👍・You can always see your stats (or spy on your friends stats 👀) using the \`/stats\` command
            👍・There is also a **leaderboard** that you can access at any time by running \`/leaderboard\`
            ❓・Every game started will be added to your account
            ❗・After **5 minutes of inactivity** (not guessing) your game will be automatically aborted and it will **count as a loss**
            ❓・You also have the option to **quit** a game, after doing \`/quit\` while playing a game a popup will ask you to confirm if you really wish to quit. Be aware that this will also **count as a loss**
            
            😄・**I hope that you will have a great time playing wordle with me**`
            )
            .setTimestamp(Date.now())

        await channelToSend.send({ embeds: [message] })
    }
}