module.exports = {
    name: "rules",
    category: "info",

    run(client, message, args, lobby, queue, channel) {
        channel.sendMessage(`Star Difficulty must be within the range of 4.00 to 6.50 stars. Anything higher or lower is against the rules and will have a higher chance of getting votekicked. Length should be at max 6-7 minutes. This is a public multi, no one wants to sit through something like Alternator Compilation (27 minutes) while playing in a multi.`)
    }
}