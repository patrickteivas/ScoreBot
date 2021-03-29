const Discord = require('discord.js');
const Database = require('./services/Database');

const token = process.env.DJS_TOKEN;

const discordClient = new Discord.Client();
const db = new Database();

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}`);
});

discordClient.on('message', async msg => {
  let message = msg.content.trim();

  if (message.charAt(0) !== '/') {
    return;
  }

  message = message.substring(1);
  const messageParts = message.split(' ');

  if (messageParts.length !== 3 || !messageParts[0] || !messageParts[1] || !messageParts[2]) {
    msg.reply('recheck command');
    return;
  }

  if (messageParts[0] === 'pay') {
    const name = messageParts[1];
    const value = Math.abs(Number(messageParts[2]));
    
    db.getScoreByName(name, async (dbScore) => {
      if (dbScore === undefined) {
        db.insertByName(name, value, async (name, score) => {
          msg.reply(`${name} = ${value}`);
          await msg.delete();
        });
      } else {
        db.updateByName(name, dbScore.score + value, async (name, score) => {
          msg.reply(`${name} = ${dbScore.score + value}`);
          await msg.delete();
        });
      }
    });
  } else if (messageParts[0] === 'withdraw') {
    const name = messageParts[1];
    const value = Math.abs(Number(messageParts[2]));
    
    db.getScoreByName(name, (dbScore) => {
      if (dbScore === undefined) {
        msg.reply(`Unable to find ${name}`);
      } else {
        db.updateByName(name, dbScore.score - value, async (name, score) => {
          msg.reply(`${name} = ${score}`);
          await msg.delete();
        });
      }
    });
  }

});

discordClient.login(token);