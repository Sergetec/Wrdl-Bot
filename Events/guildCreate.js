const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'guildCreate',
    description: 'when bot joins a new guild',
    on: true,
    async execute(guild, client, interaction){
        let channelToSend;
        guild.channels.cache.forEach((channel) => {
            if (channel.type === 'GUILD_TEXT' && !channelToSend){
                channelToSend = channel
            }
        })
        if (!channelToSend){
            return;
        }
        const message = new MessageEmbed()
            .setTitle('Wordle Bot')
            .setColor('#ffdd00')
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

        await channelToSend.send({ embeds: [message] });
    }
}