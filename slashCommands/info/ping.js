const { Client, CommandInteraction } = require("discord.js");

module.exports = {
    name: "ping",
    description: "Xem ping của bot",
    type: 'CHAT_INPUT',

    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    execute: async (client, interaction, args) => {
        await interaction.reply({ content: client.ws.ping + "ms!" });
    },
};