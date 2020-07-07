const {writeJson} = require(`fs-extra`);

module.exports = {
    async code(scores) {
        let uniqueUsers = require(`../uniqueUsers.json`);
        scores.forEach(score => {
            if (uniqueUsers.usernames.includes(score.player.user.ircUsername)) return;
            uniqueUsers.count+=1;
            uniqueUsers.usernames.push(score.player.user.ircUsername);
        });
        await uniqueUsers;
        writeJson(`../uniqueUsers.json`, uniqueUsers);
    }
}