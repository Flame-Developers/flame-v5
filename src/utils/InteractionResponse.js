class InteractionResponse {
  constructor(client) {
    this.client = client;
  }

  send(interaction, content, options = {}) {
    if (!interaction || !content) return null;

    this.client.api
      .interactions(interaction.id, interaction.token)
      .callback.post({
        data: {
          type: options.type ?? 4,
          data: {
            flags: options.flags ?? 0,
            content: content,
          },
        },
      });

    return true;
  }
}

module.exports = InteractionResponse;
