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
            else if (player) hasPlayer = true;
        }
        await player;
        await writeJson(`./lobby/queue.json`, queue);
        if (scores !== null) {
        let totalScore = 0;
        scores.forEach(score => {
            totalScore+=score.score;
        });
        await totalScore;
        await channel.sendMessage(`Total score collected this match: ${totalScore}`);
        }
        await lobby.setHost(player.user.ircUsername);
        channel.sendMessage(`${player.user.ircUsername} you are now host, please pick a map within 2 minutes. If you don't wanna pick a map, please do -skipme`);
        //  you have 2 minutes to pick a map or else you will be skipped. 
        try {
            let proceedTwo = require("./proceedTwo.js");
            proceedTwo.code(lobby, queue, channel, 120000);
        } catch (error) {
            console.error(error);
        }
    }
}