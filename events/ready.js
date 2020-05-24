const gradient = require('gradient-string');
const config = require('../config/conf.json');

module.exports = (client) => {
    console.log("=========================")
    console.log(gradient.fruit('Nikki Bot ready.'))
    console.log(gradient.morning(`v${process.env.VERSION} | Running in ${process.env.NODE_ENV} mode`))
    console.log(gradient.retro(`By etstringy and TheRandomMelon`))

    let presence = config.presences[Math.floor(Math.random() * config.presences.length)];
    client.user.setPresence({ game: { name: presence }, status: 'streaming' })
}