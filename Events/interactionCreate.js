module.exports = {
    name: 'interactionCreate',
    description: 'slash commands handler',
    on: true,
    async execute(interaction, client){
        /*
        SLASH COMMANDS - HANDLER
        */
        if (interaction.isCommand()){
            // await interaction.deferReply({ ephemeral: false }).catch(() => {});

            const command = client.commands.get(interaction.commandName)
            if (!command){
                return;
            }
            command.execute(client, interaction);
        }
    }
}