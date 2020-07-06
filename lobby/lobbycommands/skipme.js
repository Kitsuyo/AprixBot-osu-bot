module.exports = {
    name: "skipme",
    category: "multi",

    run(client, message, args, lobby, queue, channel) {
        let proceed = require(`../proceed.js`);
        try {
            proceed.code(lobby, queue, null, lobby.channel);
        } catch (error) {
            console.error(error);
        }
    }
}