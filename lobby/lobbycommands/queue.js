module.exports = {
    name: "queue",
    category: "lobby",
    
    async run(client, message, args, lobby, queue, channel) {
        channel.sendMessage(`Queue: ${queue.join(', ')}`);
    }
}