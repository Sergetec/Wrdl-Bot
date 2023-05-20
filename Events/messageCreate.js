const statsSchema = require('../Models/statsSchema')

module.exports = {
    name: 'messageCreate',
    description: 'Vote listener',
    on: true,
    async execute(message) {
        if (message.channel.id === '1108729260606234684') {
            let content = message.content.split(' ')
            let id = content[0]
            const query = {
                userID: id,
            }
            let schema = await statsSchema.findOne(query)
           schema.voteCount = schema.voteCount + 1
           await schema.save()
        }
    }
}