const gradient = require('gradient-string');

module.exports = (client) => {
    console.log("=========================")
    console.log(gradient.fruit('Nikki Bot ready.'))
    console.log(gradient.morning(`v${process.env.VERSION} | Running in ${process.env.NODE_ENV} mode`))
    console.log(gradient.retro(`By etstringy`))
    client.user.setPresence({ game: { name: 'with the hair dye.' }, status: 'streaming' })
}