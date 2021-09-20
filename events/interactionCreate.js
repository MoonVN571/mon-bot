const client = require('../index');

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()) return;

    const errorInfo = `\`\`Server ID: ${guildID} - Name: ${message.guild.name}\`\``; 

    await interaction.deferReply();

    const cmd = client.slashCommands.get(interaction.commandName);
    if(!cmd) return;

    const args = [];

    for (let option of interaction.options.data) {
        if (option.type === "SUB_COMMAND") {
            if (option.name) args.push(option.name);
            option.options?.forEach((x) => {
                if (x.value) args.push(x.value);
            });
        } else if (option.value) args.push(option.value);
    }
    
    await cmd.execute(client, interaction, args);
})
