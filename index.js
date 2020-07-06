const fs = require('fs-extra');
const { USERNAME, PASSWORD, prefix, apikey } = require(`./config.json`);

const Banchojs = require('bancho.js');
const client = new Banchojs.BanchoClient({ username: USERNAME, password: PASSWORD, limiterTimespan: 10000, apiKey: apikey});

client.connect().then(async () => {
    console.log(`Running!`);

    var lobby = require(`./lobby/lobby.js`);

    try {
        lobby.code(client);
    } catch (error) {
        console.error(error);
    }
    var commands = [];
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);
        commands.push(command.name);
    }
    client.on("PM", message => {
        if (!message.message.startsWith(prefix) || message.self) return;
        let args = message.message.slice(prefix.length).split(/ +/);
        let commandName = args.shift().toLowerCase();
        if (!commands.includes(commandName)) return;
        let command = require(`./commands/${commandName}.js`);
        if (!command) return;
        try {
            command.run(client, message, args);
        } catch (error) {
            console.error(error);
        }
    });
});