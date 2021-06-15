const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const FlameCommand = require('../../structures/FlameCommand');

class FoxCommand extends FlameCommand {
  constructor() {
    super('fox', {
      description: 'Случайная картинка лисы 🦊',
      category: 'fun',
      usage: 'fox',
      aliases: [],
    });
  }

  async run(message, args) {
    await fetch('https://randomfox.ca/floof/').then((res) => res.json())
      .then((data) => {
        message.channel.send(
          new MessageEmbed()
            .setColor('ffa500')
            .setImage(data?.image),
        );
      });
  }
}

module.exports = FoxCommand;