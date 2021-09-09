const client = require("..");

client.on('ready', () => {
    console.log(client.user.tag + " đã sẵn sàng!");

    if (client.DEV) return;
    client.user.setPresence({ activities: [{ name: 'RESTARTING', type: "PLAYING" }] });

    /*
    const app = express()
            
    const webhook = new Topgg.Webhook(client.config.TOPGG_AUTH)
    
    AutoPoster(client.config.TOPGG_TOKEN, client).on('posted', () => console.log('Posted stats to Top.gg!'));

    app.post('/dblwebhook', webhook.listener(vote => {
        let data = new Scriptdb('./voted.json');
        

        if(!data.get(vote.user)) {
            data.set(vote.user, Date.now())
        }

        client.channels.cache.get('862215076698128396').send({embeds: [{
            description: "**<@" + vote.user + ">** đã vote bot!",
            color: client.config.DEF_COLOR
        }]});
    }));
   
    app.listen(3000);
    */


    var i = -1;
    setInterval(() => {
        let random = [
            `${client.guilds.cache.size}/20 servers! | WATCHING`,
            `${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)} users! | LISTENING`,
            '@Mon Bot lấy prefix! | PLAYING',
        ];

        i++;
        if (i >= random.length) i = 1;

        let data = random[i];

        client.user.setPresence({
            activities: [
                {
                    name: data.split(" | ")[0],
                    type: data.split(" | ")[1]
                }
            ]
        });
    }, 60 * 1000);
});