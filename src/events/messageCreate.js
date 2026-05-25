module.exports = {
  name: 'messageCreate',

  async execute(message, logger) {
    if (message.author.bot) return;

    logger.info(`Mensaje de ${message.author.tag} en #${message.channel.name}: ${message.content}`);

    // Aquí puedes agregar lógica de mensajes
  }
};
