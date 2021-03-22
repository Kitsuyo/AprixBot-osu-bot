const {writeJson, readdirSync} = require('fs-extra');
const {prefix} = require(`../config.json`);


module.exports = {
    async code(client) {
        client.createLobby(`Automatic Host Rotation | -info | EARLY BETA`).then(channel => {
        
            let que = require(`./queue.json`);
            que = [];
            writeJson(`./lobby/queue.json`, que)

            var lobby = channel.lobby;

            lobby.setSize(16);
            lobby.setPassword("");

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
                console.log(1)
                let queue = require(`./queue.json`);
                console.log(2)
                console.log(queue)
                if (queue.length === 0) lobby.setHost(player.player.user.ircUsername);
                console.log(3)
                if (queue.includes(player.player.user.ircUsername)) return;
                console.log(4)
                queue.push(player.player.user.ircUsername);
                console.log(5)
                console.log(queue)
                writeJson(`./lobby/queue.json`, queue);
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
                if (player.user.ircUsername !== queue[0] && lobby.getPlayerSlot(queue[0])) {
                    let trueHost = await lobby.getPlayerByName(queue[0]);
                    lobby.setHost(trueHost.user.ircUsername);
                    channel.sendMessage(`${trueHost.user.ircUsername} please do not pass the host. Host rotation will be done automatically. If you don't want to pick a map, please do -skipme`);
                }
            });

            lobby.on("size", size => {
                if (size !== 16) {
                    lobby.setSize(16);
                }
            });

            lobby.on("passwordChanged", () => {
                lobby.setPassword(``);
            });

            lobby.on("matchSettings", settings => {
                lobby.setSettings(0, 0);
            });

            lobby.on("freemod", freemod => {
                if (freemod === false) lobby.setMods([], true);
            })

            lobby.on("allPlayersReady", () => {
                lobby.startMatch();
            });

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
                let addusers = require(`./addusers.js`);
                try {
                    proceed.code(lobby, queue, scores, channel);
                    addusers.code(scores);
                } catch (error) {
                    console.error(error);
                }
            });
        });
    }
}