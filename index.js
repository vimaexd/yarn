const gradient = require('gradient-string');
console.log(gradient.fruit('Loading Nikki...'))
console.log("=========================")

// Gradient Bot

const Discord = require("discord.js");
const fs = require("fs");
require('dotenv').config()

const client = new Discord.Client();
client.prefix = "+"

fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  console.log(`Loading ${files.length} events`)
  files.forEach(file => {
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    console.log(`Loaded event ` + gradient.retro(eventName));
    client.on(eventName, event.bind(null, client));
  });
});

client.commands = new Discord.Collection();
fs.readdir("./commands/", (err, files) => {
  if(err) console.error(err);

  let jsfiles = files.filter(f => f.split(".").pop() === "js");
  if(jsfiles.length <= 0) {
      console.log("No commands to load");
      return;
  }
  console.log("=========================")
  console.log(`Loading ${jsfiles.length} commands`);

  jsfiles.forEach((f, i) => {
      let props = require(`./commands/${f}`);
      let fg = gradient.retro(f)
      console.log(`${i + 1}: ${fg} loaded`)
      client.commands.set(props.help.name, props);
  })
})

if(process.env.NODE_ENV === "development"){
    client.login(process.env.BETATOKEN);
} else if(process.env.NODE_ENV === "production"){
    client.login(process.env.PRODTOKEN);
}

// Express Server
const express = require("express")
const app = express()
let port;

if(process.env.NODE_ENV === "development"){
  port = 2000
} else if(process.env.NODE_ENV === "production"){
  port = 8043
}

app.listen(port, () => {
    console.log(gradient.fruit('Gradient Site ready.'))
    console.log("=========================")
})