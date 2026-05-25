module.exports = {
  name: 'guildCreate',

  async execute(guild, logger) {
    logger.success(`Bot agregado al servidor: ${guild.name} (${guild.id})`);
    logger.info(`Miembros: ${guild.memberCount}`);
  }
};
