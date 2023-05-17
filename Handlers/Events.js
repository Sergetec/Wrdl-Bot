const fs = require('fs')

module.exports = (client, Discord) => {
    const eventFiles = fs.readdirSync('./Events').filter(file => file.endsWith('.js'))
    for (const file of eventFiles) {
        const event = require(`../Events/${file}`)
        if (event.on) {
            client.on(event.name, (...args) => event.execute(...args, client, Discord))
        }
    }
}