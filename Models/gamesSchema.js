const mongoose = require("mongoose");
const { Schema } = mongoose;

const reqString = {
    type: String,
    required: true,
}

const schema = new Schema({
        guildID: reqString,
        channelStarted: reqString,
        userID: reqString,
        word: reqString,
        guesses: reqString,
        replyMessage: reqString,
        language: reqString,
        expires: reqString,
    },
    {
        timestamps: true,
    }
    )

const name = 'games'

module.exports = mongoose.models[name] || mongoose.model(name, schema, name)