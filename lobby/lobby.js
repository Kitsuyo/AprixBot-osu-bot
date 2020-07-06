const {writeJson, readdirSync} = require('fs-extra');
const {prefix} = require(`../config.json`);

module.exports = {
    async code(client) {
        async function lobbyCreate() {
            return new Promise(resolve => {
                client.createLobby(`Automatic Host Rotation | 4-6.49* | EARLY BETA`).then(channel => {
                    return resolve(channel);
                });
            });
        }
        
        let que = require(`./queue.json`);
        que = [];
        writeJson(`./queue.json`, que)

        var channel = await lobbyCreate();
        var lobby = channel.lobby;

        lobby.setSize(16);
        lobby.setPassword("abc");

        let commands = [];
        const commandFiles = readdirSync('./lobby/lobbycommands').filter(file => file.endsWith('.js'));
    
        for (const file of commandFiles) {
            const command = require(`./lobbycommands/${file}`);
            commands.push(command.name);
        }
        client.on("CM", message => {
            if (message.channel !== channel) return;

            if (!message.message.startsWith(prefix) || message.self) return;
            let args = message.message.slice(prefix.length).split(/ +/);
            let commandName = args.shift().toLowerCase();
            if (!commands.includes(commandName)) return;
            let command = require(`./lobbycommands/${commandName}.js`);
            if (!command) return;
            let queue = require(`./queue.json`);
            try {
                command.run(client, message, args, lobby, queue, channel);
            } catch (error) {
                console.error(error);
            }
        });

        lobby.on("playerJoined", async player => {
            let queue = require(`./queue.json`);
            if (queue.length === 0) lobby.setHost(player.player.user.ircUsername);
            if (queue.includes(player.player.user.ircUsername)) return;
            queue.push(player.player.user.ircUsername);
            writeJson(`./queue.json`, queue);
            console.log(queue)
        });

        lobby.on("playerLeft", player => {
            let queue = require(`./queue.json`);
            if (player.user.ircUsername === queue[0]) {
                let proceed = require(`./proceed.js`);
                try {
                    proceed.code(lobby, queue, null, channel);
                } catch (error) {
                    console.error(error);
                }
            }
        });

        lobby.on("host", async player => {
            let queue = require(`./queue.json`);
            if (player === null) return;
            if (player.user.ircUsername !== queue[0]) {
                let trueHost = await lobby.getPlayerByName(queue[0]);
                lobby.setHost(trueHost.user.ircUsername);
                channel.sendMessage(`${trueHost.user.ircUsername} please do not pass the host. Host rotation will be done automatically. If you don't want to pick a map, please do -skipme`);
            }
        });

        /*lobby.on("slotsLocked", () => {
            lobby.setSize(16);
        });

        lobby.on("passwordChanged", () => {
            lobby.setPassword(``);
        });

        lobby.on("matchSettings", () => {
            lobby.setSettings(0, 0);
        });

        lobby.on("allPlayersReady", () => {
            lobby.startMatch();
        });*/

        lobby.on("matchStarted", () => {
            lobby.clearHost();
        });

        lobby.on("matchAborted", () => {
            let queue = require(`./queue.json`);
            let proceed = require(`./proceed.js`);
            try {
                proceed.code(lobby, queue, null, lobby.channel);
            } catch (error) {
                console.error(error);
            }
        });

        lobby.on("matchFinished", async scores => {
            let queue = require(`./queue.json`);
            let proceed = require(`./proceed.js`);
            try {
                proceed.code(lobby, queue, scores, channel);
            } catch (error) {
                console.error(error);
            }
        });
    }
}