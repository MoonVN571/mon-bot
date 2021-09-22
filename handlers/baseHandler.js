const { readdirSync } = require('fs');
const { Client } = require('discord.js');
const { dev }  =require('../config.json');
/**
 * 
 * @param {Client} client 
 */
module.exports = (client) => {
    // Event handler
    readdirSync('./events/').forEach(files => require("../events/" + files));

    // Slash handler
    const arrayOfSlashCommands = [];

    readdirSync('./slashCommands/').forEach(dir => {
        const commands = readdirSync(`./slashCommands/${dir}/`).filter(file => file.endsWith('.js'));

        commands.forEach((file) => {
            const pull = require(`../slashCommands/${dir}/${file}`);

            if (pull.name) {
                client.slashCommands.set(pull.name, pull);
                arrayOfSlashCommands.push(pull);
            } else {
                console.log("Can not load " + file);
            }
        });
    });

    client.on("ready", async () => {
        if(!dev) await client.application.commands.set(arrayOfSlashCommands);
        await client.guilds.cache.get("884993985968484422").commands.set([]); // gin
        await client.guilds.cache.get("869076561075261460").commands.set(arrayOfSlashCommands);

        // if(!dev) {
            client.guilds.cache.forEach(guild => {
                /*
                guild.commands.set(arrayOfSlashCommands).then((cmd) => {
                    const getRole = (cmdName) => {
                        const perm = arrayOfSlashCommands.find((x) => x.name === cmdName).userPermissions;
                    
                        if(!perm) return null;

                        return guild.roles.cache.filter(
                            (x) => x.permissions.has(perm) && !x.managed
                        );
                    }

                    const fullPerm = cmd.reduce((acc,x) => {
                        const roles = getRole(x.name);
                        if(!roles) return acc;

                        const perms = roles.reduce((a,v) => {
                            return [
                                ...a,
                                {
                                    id: v.id,
                                    type: "ROLE",
                                    permission: true,
                                    s
                                }
                            ]
                        }, []);

                        return [
                            ...acc,
                            {
                                id: x.id,
                                perms
                            }
                        ]
                    }, []);
                    guild.commands.set({ fullPerm });
                });
                */
            });
            return
        // }
    });


    // Command handler
    readdirSync('./commands/').forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith('.js'));

        commands.forEach((file) => {
            const pull = require(`../commands/${dir}/${file}`);

            if (pull.name) client.commands.set(pull.name, pull);
        });
    });
}