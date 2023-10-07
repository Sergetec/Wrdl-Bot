const {
    EmbedBuilder,
    ApplicationCommandOptionType,
} = require('discord.js')
const statsSchema = require('../Models/statsSchema')

module.exports = {
    name: 'stats',
    description: 'Shows someone\'s Wordle stats',
    options: [
        {
            name: 'user',
            type: ApplicationCommandOptionType.User,
            description: 'The user of which to display stats',
            required: false,
        },
    ],
    async execute(client, interaction) {
        const user = interaction.options.getUser('user') || interaction.user
        const userID = user.id

        let currentStreak = 0, maxStreak = 0
        let gamesTotal = 0, gamesWon = 0, gamesLost = 0, winRate = 0
        let oneGuess = 0, twoGuess = 0, threeGuess = 0, fourGuess = 0, fiveGuess = 0, sixGuess = 0
        let Strings = {
            oneGuessString: '',
            twoGuessString: '',
            threeGuessString: '',
            fourGuessString: '',
            fiveGuessString: '',
            sixGuessString: '',
        }
        const query = {
            userID: userID,
        }
        const results = await statsSchema.findOne(query)
        if (results !== null) {
            gamesTotal = results.gamesTotal
            gamesWon = results.gamesWon
            gamesLost = results.gamesLost
            oneGuess = results.oneGuess
            twoGuess = results.twoGuess
            threeGuess = results.threeGuess
            fourGuess = results.fourGuess
            fiveGuess = results.fiveGuess
            sixGuess = results.sixGuess
            maxStreak = Math.max(maxStreak, results.maxStreak)
            currentStreak = results.currentStreak
            winRate = results.winRate
            getGuessDistribution(oneGuess, twoGuess, threeGuess, fourGuess, fiveGuess, sixGuess, Strings)

            const message = new EmbedBuilder()
                .setTitle(`📊 WRDL STATISTICS 📊`)
                .setColor('#FF964D')
                .setThumbnail(user.avatarURL({ dynamic: true, size: 512 }))
                .setDescription(`
                    👤 **<@${user.id}>
                    
🌍 Total Games: \`${gamesTotal}\`
🎉 Words Solved: \`${gamesWon}\`
📈 Words Unsolved: \`${gamesLost}\`
📝 WinRate: \`${winRate}%\`
🔥 Highest Streak: \`${maxStreak}\`
🔥 Current Streak: \`${currentStreak}\`**
                    
**Guess Distribution**
**1** ${Strings.oneGuessString} \`${oneGuess}\`
**2** ${Strings.twoGuessString} \`${twoGuess}\`
**3** ${Strings.threeGuessString} \`${threeGuess}\`
**4** ${Strings.fourGuessString} \`${fourGuess}\`
**5** ${Strings.fiveGuessString} \`${fiveGuess}\`
**6** ${Strings.sixGuessString} \`${sixGuess}\`
                    
                    
[Vote for me!](https://top.gg/bot/1011006137690239059/vote)`)

            return await interaction.reply({ embeds: [message] })
        } else {
            const message = new EmbedBuilder()
                .setTitle(`📊 WRDL STATISTICS 📊`)
                .setColor('#57F287')
                .setThumbnail(user.avatarURL({ dynamic: true, size: 512 }))
                .setDescription(`❓ <@${user.id}> haven\'t played a game yet.`)

            return await interaction.reply({ embeds: [message] })
        }
    }
}

function getGuessDistribution(oneGuess, twoGuess, threeGuess, fourGuess, fiveGuess, sixGuess, Strings) {
    let maxi = Math.max(oneGuess, twoGuess, threeGuess, fourGuess, fiveGuess, sixGuess)
    let oneGuessPercent = oneGuess / maxi * 100
    let twoGuessPercent = twoGuess / maxi * 100
    let threeGuessPercent = threeGuess / maxi * 100
    let fourGuessPercent = fourGuess / maxi * 100
    let fiveGuessPercent = fiveGuess / maxi * 100
    let sixGuessPercent = sixGuess / maxi * 100
    let counter = 7

    //ONE
    if (oneGuessPercent >= 14) {
        let intreg = oneGuessPercent / 14
        oneGuessPercent /= 14
        //afisare
        for (let i = 1; i <= intreg; ++i) {
            Strings.oneGuessString += '<:Bar4:1066803417072287856>'
        }
        oneGuessPercent -= intreg
        counter -= intreg
    }
    if (oneGuessPercent >= 7) {
        let jumatati = oneGuessPercent / 7
        oneGuessPercent /= 7
        //afisare
        for (let i = 1; i <= jumatati; ++i) {
            Strings.oneGuessString += '<:Bar2:1066803412219482123>'
        }
        oneGuessPercent -= jumatati
        counter -= jumatati
    }
    if (oneGuessPercent >= 3.5) {
        let sferturi = oneGuessPercent / 3.5
        // oneGuessPercent /= 3.5
        //afisare
        for (let i = 1; i <= sferturi; ++i) {
            Strings.oneGuessString += '<:Bar1:1066803409417670676>'
        }
        // oneGuessPercent -= sferturi
        counter -= sferturi
    }
    counter = Math.ceil(counter)
    for (let i = 1; i <= counter; ++i) {
        Strings.oneGuessString += '<:BarDark:1066831537812815965>'
    }
    counter = 7

    //TWO
    if (twoGuessPercent >= 14) {
        let intreg = twoGuessPercent / 14
        twoGuessPercent /= 14
        //afisare
        for (let i = 1; i <= intreg; ++i) {
            Strings.twoGuessString += '<:Bar4:1066803417072287856>'
        }
        twoGuessPercent -= intreg
        counter -= intreg
    }
    if (twoGuessPercent >= 7) {
        let jumatati = twoGuessPercent / 7
        twoGuessPercent /= 7
        //afisare
        for (let i = 1; i <= jumatati; ++i) {
            Strings.twoGuessString += '<:Bar2:1066803412219482123>'
        }
        twoGuessPercent -= jumatati
        counter -= jumatati
    }
    if (twoGuessPercent >= 3.5) {
        let sferturi = twoGuessPercent / 3.5
        // twoGuessPercent /= 3.5
        //afisare
        for (let i = 1; i <= sferturi; ++i) {
            Strings.twoGuessString += '<:Bar1:1066803409417670676>'
        }
        // twoGuessPercent -= sferturi
        counter -= sferturi
    }
    counter = Math.ceil(counter)
    for (let i = 1; i <= counter; ++i) {
        Strings.twoGuessString += '<:BarDark:1066831537812815965>'
    }
    counter = 7

    //THREE
    if (threeGuessPercent >= 14) {
        let intreg = threeGuessPercent / 14
        threeGuessPercent /= 14
        //afisare
        for (let i = 1; i <= intreg; ++i) {
            Strings.threeGuessString += '<:Bar4:1066803417072287856>'
        }
        threeGuessPercent -= intreg
        counter -= intreg
    }
    if (threeGuessPercent >= 7) {
        let jumatati = threeGuessPercent / 7
        threeGuessPercent /= 7
        //afisare
        for (let i = 1; i <= jumatati; ++i) {
            Strings.threeGuessString += '<:Bar2:1066803412219482123>'
        }
        threeGuessPercent -= jumatati
        counter -= jumatati
    }
    if (threeGuessPercent >= 3.5) {
        let sferturi = threeGuessPercent / 3.5
        // threeGuessPercent /= 3.5
        //afisare
        for (let i = 1; i <= sferturi; ++i) {
            Strings.threeGuessString += '<:Bar1:1066803409417670676>'
        }
        // threeGuessPercent -= sferturi
        counter -= sferturi
    }
    counter = Math.ceil(counter)
    for (let i = 1; i <= counter; ++i) {
        Strings.threeGuessString += '<:BarDark:1066831537812815965>'
    }
    counter = 7

    //FOUR
    if (fourGuessPercent >= 14) {
        let intreg = fourGuessPercent / 14
        fourGuessPercent /= 14
        //afisare
        for (let i = 1; i <= intreg; ++i) {
            Strings.fourGuessString += '<:Bar4:1066803417072287856>'
        }
        fourGuessPercent -= intreg
        counter -= intreg
    }
    if (fourGuessPercent >= 7) {
        let jumatati = fourGuessPercent / 7
        fourGuessPercent /= 7
        //afisare
        for (let i = 1; i <= jumatati; ++i) {
            Strings.fourGuessString += '<:Bar2:1066803412219482123>'
        }
        fourGuessPercent -= jumatati
        counter -= jumatati
    }
    if (fourGuessPercent >= 3.5) {
        let sferturi = fourGuessPercent / 3.5
        // fourGuessPercent /= 3.5
        //afisare
        for (let i = 1; i <= sferturi; ++i) {
            Strings.fourGuessString += '<:Bar1:1066803409417670676>'
        }
        // fourGuessPercent -= sferturi
        counter -= sferturi
    }
    counter = Math.ceil(counter)
    for (let i = 1; i <= counter; ++i) {
        Strings.fourGuessString += '<:BarDark:1066831537812815965>'
    }
    counter = 7

    //FIVE
    if (fiveGuessPercent >= 14) {
        let intreg = fiveGuessPercent / 14
        fiveGuessPercent /= 14
        //afisare
        for (let i = 1; i <= intreg; ++i) {
            Strings.fiveGuessString += '<:Bar4:1066803417072287856>'
        }
        fiveGuessPercent -= intreg
        counter -= intreg
    }
    if (fiveGuessPercent >= 7) {
        let jumatati = fiveGuessPercent / 7
        fiveGuessPercent /= 7
        //afisare
        for (let i = 1; i <= jumatati; ++i) {
            Strings.fiveGuessString += '<:Bar2:1066803412219482123>'
        }
        fiveGuessPercent -= jumatati
        counter -= jumatati
    }
    if (fiveGuessPercent >= 3.5) {
        let sferturi = fiveGuessPercent / 3.5
        // fiveGuessPercent /= 3.5
        //afisare
        for (let i = 1; i <= sferturi; ++i) {
            Strings.fiveGuessString += '<:Bar1:1066803409417670676>'
        }
        // fiveGuessPercent -= sferturi
        counter -= sferturi
    }
    counter = Math.ceil(counter)
    for (let i = 1; i <= counter; ++i) {
        Strings.fiveGuessString += '<:BarDark:1066831537812815965>'
    }
    counter = 7

    //SIX
    if (sixGuessPercent >= 14) {
        let intreg = sixGuessPercent / 14
        sixGuessPercent /= 14
        //afisare
        for (let i = 1; i <= intreg; ++i) {
            Strings.sixGuessString += '<:Bar4:1066803417072287856>'
        }
        sixGuessPercent -= intreg
        counter -= intreg
    }
    if (sixGuessPercent >= 7) {
        let jumatati = sixGuessPercent / 7
        sixGuessPercent /= 7
        //afisare
        for (let i = 1; i <= jumatati; ++i) {
            Strings.sixGuessString += '<:Bar2:1066803412219482123>'
        }
        sixGuessPercent -= jumatati
        counter -= jumatati
    }
    if (sixGuessPercent >= 3.5) {
        let sferturi = sixGuessPercent / 3.5
        // sixGuessPercent /= 3.5
        //afisare
        for (let i = 1; i <= sferturi; ++i) {
            Strings.sixGuessString += '<:Bar1:1066803409417670676>'
        }
        // sixGuessPercent -= sferturi
        counter -= sferturi
    }
    counter = Math.ceil(counter)
    for (let i = 1; i <= counter; ++i) {
        Strings.sixGuessString += '<:BarDark:1066831537812815965>'
    }
    // counter = 7
}