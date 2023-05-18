const mongoose = require("mongoose")
const { Schema } = mongoose

const reqString = {
    type: String,
    required: true,
}
const reqNumber = {
    type: Number,
    required: true,
}

const schema = new Schema({
        guildID: reqString,
        userID: reqString,
        gamesTotal: reqNumber,
        gamesWon: reqNumber,
        gamesLost: reqNumber,
        winRate: reqNumber,
        oneGuess: reqNumber,
        twoGuess: reqNumber,
        threeGuess: reqNumber,
        fourGuess: reqNumber,
        fiveGuess: reqNumber,
        sixGuess: reqNumber,
        currentStreak: reqNumber,
        maxStreak: reqNumber,
        voteCount: reqNumber,
    })

const name = 'stats'

module.exports = mongoose.models[name] || mongoose.model(name, schema, name)