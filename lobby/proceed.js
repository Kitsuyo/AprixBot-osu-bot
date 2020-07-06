const {writeJson} = require('fs-extra');

module.exports = {
    async code(lobby, queue, scores, channel) {
        let oldHost = queue.splice(0,1);
        await queue;
        queue.push(oldHost[0]);
        await queue;
        console.log(queue)
        let player;
        let hasPlayer = false;
        while (hasPlayer === false) {
            player = await lobby.getPlayerByName(queue[0]);
            if (!player) {queue.splice(0,1); await queue; hasPlayer = false;}
            if (player) hasPlayer = true;
        }
        await player;
        await writeJson(`./queue.json`, queue);
        if (scores !== null) {
        let totalScore = 0;
        scores.forEach(score => {
            totalScore+=score.score;
        });
        await totalScore;
        await channel.sendMessage(`Total score collected this match: ${totalScore}`);
        }
        await lobby.setHost(player.user.ircUsername);
        channel.sendMessage(`${player.user.ircUsername} you have 2 minutes to pick a map or else you will be skipped. If you don't wanna pick a map, please do -skipme`);
        /*var timer = setTimeout(() => {
            try {
                this.code(lobby, queue, null, channel);
            } catch (error) {
                console.error(error);
            }
        }, 120000);
        lobby.on("beatmapid", beatmap => {
            clearTimeout(timer);
            channel.sendMessage(`Map picked. Y'all have 2 minutes to get ready.`);
            var readyTimer = setTimeout(() => {
                lobby.startMatch();
            }, 120000);
            lobby.on("matchStarted", () => {
                clearTimeout(readyTimer);
            });
        });*/
    }
}