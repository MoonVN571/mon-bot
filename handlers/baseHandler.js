const { readdirSync } = require('fs');
const { Client } = require('discord.js');
const { dev }  =require('../config.json');
const { sleep } = require('../utils/utils');
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

                if(["MESSAGE","USER"].includes(pull.type)) delete pull.description;
                // if(!pull.defaultPermission) pull.defaultPermission = false;
                arrayOfSlashCommands.push(pull);
            } else {
                console.log("Can not load " + file);
            }
        });
    });

    client.on("ready", async () => {
        if(!dev) await client.application.commands.set(arrayOfSlashCommands);
        if(dev) await client.guilds.cache.get("884993985968484422").commands.set([]); // gin
        await client.guilds.cache.get("869076561075261460").commands.set(arrayOfSlashCommands);

        await sleep(2000);
        return;
        if(dev) {
            let guild = client.guilds.cache.get("869076561075261460");
            // client.guilds.cache.forEach(async (guild) => {
                // if(guild.id !== "869076561075261460") return;
                await guild.commands.set(arrayOfSlashCommands).then(async (cmd) => {

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
                    guild.commands.permissions.set({fullPerm});
                });
            // });
            return
        }
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