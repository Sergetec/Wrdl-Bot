const { Client, CommandInteraction} = require('discord.js')
const { MessageEmbed } = require('discord.js')
const statsSchema = require('../Models/statsSchema')

module.exports = {
    name: 'stats',
    description: 'Shows wordle stats of someone',
    options: [
        {
            name: 'type',
            type: 'STRING',
            description: 'Global or in this server',
            required: true,
            choices: [
                {
                    name: 'global',
                    value: 'global',
                },
                {
                    name: 'server',
                    value: 'server',
                },
            ],
        },
        {
            name: 'user',
            type: 'USER',
            description: 'The user of which to display stats',
            required: false,
        },
    ],
    async execute(client, interaction) {
        const user = interaction.options.getUser('user') || interaction.user
        const userID = user.id

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

        const type = interaction.options.get('type').value
        if (type === 'global') {
            const query = {
                userID: userID,
            }
            const results = await statsSchema.find(query)
            if (results.length !== 0) {
                for (const result of results) {
                    gamesTotal += result.gamesTotal
                    gamesWon += result.gamesWon
                    gamesLost += result.gamesLost
                    oneGuess += result.oneGuess
                    twoGuess += result.twoGuess
                    threeGuess += result.threeGuess
                    fourGuess += result.fourGuess
                    fiveGuess += result.fiveGuess
                    sixGuess += result.sixGuess
                }
                winRate = Math.trunc(gamesWon / gamesTotal * 100)
                getGuessDistribution(oneGuess, twoGuess, threeGuess, fourGuess, fiveGuess, sixGuess, Strings)

                const message = new MessageEmbed()
                    .setTitle(`📊 WRDL STATS GLOBAL 📊`)
                    .setColor('#ff7869')
                    .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
                    .setDescription(`
                    👤 **<@${user.id}>
                    
🌍 Total Games: \`${gamesTotal}\`
🎉 Words Solved: \`${gamesWon}\`
📈 Words Unsolved: \`${gamesLost}\`
📝 WinRate: \`${winRate}%\`**
                    
**Words guessed**
**1** ${Strings.oneGuessString} \`${oneGuess}\`
**2** ${Strings.twoGuessString} \`${twoGuess}\`
**3** ${Strings.threeGuessString} \`${threeGuess}\`
**4** ${Strings.fourGuessString} \`${fourGuess}\`
**5** ${Strings.fiveGuessString} \`${fiveGuess}\`
**6** ${Strings.sixGuessString} \`${sixGuess}\`
                    
                    
[Add Wrdl to your server!](https://ptb.discord.com/api/oauth2/authorize?client_id=1011006137690239059&permissions=277025721344&scope=applications.commands%20bot)`)

                return await interaction.reply({ embeds: [message] })
            }
            else {
                const message = new MessageEmbed()
                    .setTitle(`📊 WRDL STATS 📊`)
                    .setColor('#ff7869')
                    .setDescription(`❓ <@${user.id}> haven\'t played a game.`)

                return await interaction.reply({ embeds: [message] })
            }
        }
        else if (type === 'server') {
            const guildID = interaction.guild.id
            const query = {
                guildID: guildID,
                userID: userID,
            }
            let schema = await statsSchema.findOne(query)
            if (schema) {
                gamesTotal = schema.gamesTotal
                gamesWon = schema.gamesWon
                gamesLost = schema.gamesLost
                winRate = schema.winRate
                oneGuess = schema.oneGuess
                twoGuess = schema.twoGuess
                threeGuess = schema.threeGuess
                fourGuess = schema.fourGuess
                fiveGuess = schema.fiveGuess
                sixGuess = schema.sixGuess
                getGuessDistribution(oneGuess, twoGuess, threeGuess, fourGuess, fiveGuess, sixGuess, Strings)

                const message = new MessageEmbed()
                    .setTitle(`📊 WRDL STATS SERVER 📊`)
                    .setColor('#ff7869')
                    .setThumbnail(user.avatarURL({dynamic: true, size: 512}))
                    .setDescription(`
                    👤 **<@${user.id}>
                    
🌍 Total Games: \`${gamesTotal}\`
🎉 Words Solved: \`${gamesWon}\`
📈 Words Unsolved: \`${gamesLost}\`
📝 WinRate: \`${winRate}%\`**
                    
**Words guessed**
**1** ${Strings.oneGuessString} \`${oneGuess}\`
**2** ${Strings.twoGuessString} \`${twoGuess}\`
**3** ${Strings.threeGuessString} \`${threeGuess}\`
**4** ${Strings.fourGuessString} \`${fourGuess}\`
**5** ${Strings.fiveGuessString} \`${fiveGuess}\`
**6** ${Strings.sixGuessString} \`${sixGuess}\`
                    
                    
[Add Wrdl to your server!](https://ptb.discord.com/api/oauth2/authorize?client_id=1011006137690239059&permissions=277025721344&scope=applications.commands%20bot)`)

                return await interaction.reply({ embeds: [message] })
            }
            else {
                const message = new MessageEmbed()
                    .setTitle(`📊 WRDL STATS 📊`)
                    .setColor('#ff7869')
                    .setDescription(`❓ <@${user.id}> haven\'t played a game in this server.`)

                return await interaction.reply({ embeds: [message] })
            }
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
        oneGuessPercent /= 3.5
        //afisare
        for (let i = 1; i <= sferturi; ++i) {
            Strings.oneGuessString += '<:Bar1:1066803409417670676>'
        }
        oneGuessPercent -= sferturi
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
        twoGuessPercent /= 3.5
        //afisare
        for (let i = 1; i <= sferturi; ++i) {
            Strings.twoGuessString += '<:Bar1:1066803409417670676>'
        }
        twoGuessPercent -= sferturi
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
        threeGuessPercent /= 3.5
        //afisare
        for (let i = 1; i <= sferturi; ++i) {
            Strings.threeGuessString += '<:Bar1:1066803409417670676>'
        }
        threeGuessPercent -= sferturi
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
        fourGuessPercent /= 3.5
        //afisare
        for (let i = 1; i <= sferturi; ++i) {
            Strings.fourGuessString += '<:Bar1:1066803409417670676>'
        }
        fourGuessPercent -= sferturi
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
        fiveGuessPercent /= 3.5
        //afisare
        for (let i = 1; i <= sferturi; ++i) {
            Strings.fiveGuessString += '<:Bar1:1066803409417670676>'
        }
        fiveGuessPercent -= sferturi
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
        sixGuessPercent /= 3.5
        //afisare
        for (let i = 1; i <= sferturi; ++i) {
            Strings.sixGuessString += '<:Bar1:1066803409417670676>'
        }
        sixGuessPercent -= sferturi
        counter -= sferturi
    }
    counter = Math.ceil(counter)
    for (let i = 1; i <= counter; ++i) {
        Strings.sixGuessString += '<:BarDark:1066831537812815965>'
    }
    counter = 7
}