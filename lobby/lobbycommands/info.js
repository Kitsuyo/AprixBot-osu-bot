module.exports = {
    name: "info",
    category: "info",

    run(client, message, args, lobby, queue, channel) {
        channel.sendMessage(`Queue Info: Once a host has had their map played, they are added to the end of the queue. If you leave, you will still be on the queue until it is your turn. | More info (Commands, Features, planned features, etc.): [https://osu.ppy.sh/users/14781224 Aprixia's Profile]`);
    }
}