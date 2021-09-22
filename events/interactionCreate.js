const client = require('../index');

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()) return;

    const errorInfo = `\`\`Server ID: ${interaction.guildId} - Name: ${interaction.guild.name}\`\``; 

    // await interaction.deferReply();

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
    
    function botError() {
        console.log(cmdName);
        interaction.followUp({
            embeds: [{
                description: "Hệ thống gặp lỗi thử lại sau!",
                color: client.config.ERR_COLOR
            }], allowedMentions: { repliedUser: false }
        });
    }
    interaction.botError = botError;
    interaction.errorInfo = cmd.name + " | " + errorInfo;

    await cmd.execute(client, interaction, args);
})
