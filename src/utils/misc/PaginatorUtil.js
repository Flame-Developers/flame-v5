class PaginatorUtil {
  constructor(user, pages = []) {
    this.reactions = ['◀️', '⏺', '▶️'];
    this.user = user ?? null;
    this.pages = pages;
    this.page = 0;
  }

  async #refresh(newPage) {
    if (newPage > this.pages.length || newPage < 0) return null;
    this.page = newPage;
    return this.message.edit(this.pages[this.page]);
  }

  async init(channel) {
    const data = this.pages[this.page];

    this.message = await channel.send(data);
    this.reactions.forEach((reaction) => this.message.react(reaction).catch(() => {}));
    // eslint-disable-next-line max-len
    const collector = await this.message.createReactionCollector((reaction, user) => user.id === this.user.id, {
      time: 120000,
    });

    collector.on('collect', (reaction) => {
      if (this.message.guild.me.permissions.has('MANAGE_MESSAGES')) {
        this.message.reactions.cache.get(reaction.emoji.name).users?.remove(this.user.id);
      }

      switch (reaction.emoji.name) {
        case '◀️':
          this.#refresh(this.page - 1);
          break;
        case '▶️':
          this.#refresh(this.page + 1);
          break;
        case '⏺':
          collector.stop();
          this.message.delete().catch(() => {});
          break;

        default:
      }
      collector.on('end', () => this.message.reactions.removeAll().catch(() => {}));
    });
  }
}

module.exports = PaginatorUtil;
