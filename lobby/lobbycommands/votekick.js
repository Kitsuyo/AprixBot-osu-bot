module.exports = {
    name: "votekick",
    category: "multi",
    count: 0,
    voted: [],

    run(client, message, args, lobby, queue, channel) {
        if (Math.round((queue.length-1)/2) <= this.count) {
            let host = lobby.getHost();
            lobby.kickPlayer(host.user.ircUsername);
            let proceed = require(`../proceed.js`);
            try {
                proceed.code(lobby, queue, null, channel);
            } catch (error) {
                console.error(error);
            }
            this.count = 0;
            this.voted = [];
        }
        else {
            this.count+=1;
            this.voted.push(message.user.ircUsername);
            channel.sendMessage(`${this.count}/${Math.round((queue.length-1)/2)} has voted to kick the host. (${this.voted.join(', ')}) If y'all agree with this, you have 30 seconds to vote.`);
            setTimeout(() => {
                this.count = 0;
                this.voted = 0;
            }, 30000);
        }
    }
}