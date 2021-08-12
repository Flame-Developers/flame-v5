class InteractionResponse {
  constructor(client, interaction) {
    this.client = client;
    this.interaction = interaction;
  }

  send(content, options = {}) {
    return this.client.api
      .interactions(this.interaction.id, this.interaction.token)
      .callback.post({
        data: {
          type: options.type ?? 4,
          data: {
            flags: options.flags ?? 0,
            embeds: options.embeds ?? [],
            content,
          },
        },
      });
  }

  followUp(content, options = {}) {
    return this.client.api
      .webhooks(this.client.user.id, this.interaction.token)
      .post({
        data: {
          embeds: options.embeds ?? [],
          content,
        },
      });
  }
}

module.exports = InteractionResponse;
