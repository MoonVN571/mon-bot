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

    /*for (const file of files) {
        if (file.endsWith('.js')) {
            const eventName = file.substring(0, file.indexOf('.js'));
            try {
                const eventModule = require('../events/' + file);
                client.on(eventName, eventModule.bind(null, client));
            }
            catch(err) {
                console.error(err);
                table.addRow(eventName, '❌');
                continue;
            }
        }
    } */

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

    /*
    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    }); */
    client.on("ready", async () => {
        // Register for a single guild

        await client.guilds.cache
            .get("869076561075261460")
            .commands.set(arrayOfSlashCommands);


        // Register for all the guilds the bot is in
        //client.application.commands.set(arrayOfSlashCommands)
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