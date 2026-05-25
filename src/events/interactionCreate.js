const { Events, ChannelType } = require('discord.js');

module.exports = {
  name: 'interactionCreate',

  async execute(interaction, logger) {
    if (!interaction.isChatInputCommand()) return;

    const client = interaction.client;
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      logger.warn(`Comando no encontrado: ${interaction.commandName}`);
      return;
    }

    try {
      const logMessage = `🔴 Comando ejecutado: **${interaction.commandName}** por **${interaction.user.tag}** en **${interaction.guild.name}**`;
      logger.info(logMessage);
      await command.execute(interaction, logger);
    } catch (error) {
      logger.error(`❌ Error en comando ${interaction.commandName}`, error);
      
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: '❌ Ocurrió un error al ejecutar el comando',
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: '❌ Ocurrió un error al ejecutar el comando',
          ephemeral: true
        });
      }
    }
  }
};
