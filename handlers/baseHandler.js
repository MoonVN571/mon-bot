const ascii = require('ascii-table');
let table = new ascii("Commands");
table.setHeading("Name", "Status");
const { readdirSync } = require('fs');
const { Client } = require('discord.js');
/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
    // Event handler
    readdirSync('./events/').forEach(files => require("../events/" + files));

    // Slash handler
    const arrayOfSlashCommands = [];

    readdirSync('./slashs/').forEach(dir => {
        const commands = readdirSync(`./slashs/${dir}/`).filter(file => file.endsWith('.js'));

        commands.forEach((file) => {
            const pull = require(`../slashs/${dir}/${file}`);

            if (pull.name) {
                client.slashCommands.set(pull.name, pull);
                arrayOfSlashCommands.push(pull);
            } else {
                console.log("Can not load " + file);
            }
        });
    });

    client.on("ready", async () => {
        await client.application.commands.set(arrayOfSlashCommands)
    });


    // Command handler
    readdirSync('./commands/').forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));

        commands.forEach((file) => {
            const pull = require(`../commands/${dir}/${file}`);

            if (pull.name) {
                table.addRow(pull.name, "Successful");
                client.commands.set(pull.name, pull);
            } else {
                table.addRow(file, "Failed -> cmd.name");
            }
        });
    });
    console.log(table.toString());
}