const { Events } = require('discord.js');

module.exports = {
  name: Events.ClientReady,
  once: true,

  execute(client, logger) {
    logger.success(`✨ Bot conectado como ${client.user.tag}`);
    logger.info(`Servidor(s): ${client.guilds.cache.size}`);
    logger.info(`Usuarios totales: ${client.users.cache.size}`);
    
    client.user.setActivity('Vertex Shop', { type: 'WATCHING' });
  }
};
