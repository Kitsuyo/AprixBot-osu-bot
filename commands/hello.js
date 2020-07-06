module.exports = {
    name: "hello",
    category: "fun",

    run(client, message, args) {
        console.log(`hello`)
        //message.user.sendMessage(`Hey, ${message.user.ircUsername}!`);
    }
}