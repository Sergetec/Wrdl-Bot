const fs = require('node:fs')

module.exports = (client) => {
    const commandFiles = fs.readdirSync('./Commands/').filter(file => file.endsWith('.js'))

    const commandsArray = []
    for (const file of commandFiles) {
        const command = require(`../Commands/${file}`)

        if (command.name) {
            client.commands.set(command.name, command)
            commandsArray.push(command)

            client.on("ready", async () => {
                //client.guilds.cache.get("984505316462981190").commands.set(commandsArray); - guild commands
                await client.application?.commands.set(commandsArray)
            })
        }
    }
}