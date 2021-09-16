const client = require('../index');

// client.shard.broadcastEval(client => {
	const Database = require("simplest.db");
	// const { getAge, getTimestamp } = require("../../../../utils/utils");
	const { getAge, getTimestamp } = require("../utils/utils");

	client.on('guildDelete', async (guild) => {
		const guilded = new Database({ path: "./data/guilds/" + guild.id + ".json" });
		guilded.clear();

		console.log(guild.name + " left");
		client.channels.cache.get("880676073778581535").send("Guild lave! Name: **" + guild.name + "**");

		var owner = "Không rõ";
		await client.users.fetch(guild.ownerId).then(user => owner = user.tag + " (ID: " + guild.ownerId + ")");

		client.channels.cache.get("880676073778581535").send({
			embeds: [{
				title: guild.name,
				description: "Bot đã thoát khỏi nhóm!",
				fields: [
					{
						name: "Chủ server",
						value: owner,
						inline: true,
					},
					{
						name: "Ngày tạo nhóm",
						value: getTimestamp(guild.createdAt) + ` (tạo ${getAge(guild.createdAt, true)})`,
						inline: true
					},
				],
				timestamp: new Date(),
				color: client.config.DEF_COLOR,
				thumbnail: {
					url: guild.iconURL()
				},
				color: client.config.DEF_COLOR
			}]
		});
	});
// });