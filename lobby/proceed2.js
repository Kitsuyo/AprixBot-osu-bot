const proceedOne = require("./proceed.js");

module.exports = {
    async code(lobby, queue, channel, timeOutDuration) {
        var timer = setTimeout(() => {
            try {
                proceedOne.code(lobby, queue, null, channel);
            } catch (error) {
                console.error(error);
            }
        }, timeOutDuration);
        lobby.once("beatmap", beatmap => {
            clearTimeout(timer);
            if (!beatmap.id) {
                channel.sendMessage(`This map is not available. Please select something else.`);
                this.code(lobby, queue, channel, Math.ceil(timer._idleStart + timer._idleTimeout - Date.now()));
            } else {
                channel.sendMessage(`Map picked. Y'all have 2 minutes to get ready.`);
                var readyTimer = setTimeout(() => {
                    lobby.startMatch();
                }, 120000);
                lobby.once("matchStarted", () => {
                    clearTimeout(readyTimer);
                });
            }
        });
    }
}