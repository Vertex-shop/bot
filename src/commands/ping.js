const { SlashCommandBuilder } = require('discord.js');
const embedUtils = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Verifica la latencia del bot'),

  async execute(interaction, logger) {
    const latency = Date.now() - interaction.createdTimestamp;
    const client = interaction.client;
    
    const embed = embedUtils.createInfoEmbed(
      '🏓 Pong!',
      `Latencia: ${latency}ms\nLatencia del WebSocket: ${client.ws.ping}ms`
    );

    await interaction.reply({ embeds: [embed] });
    logger.info(`Comando ping ejecutado por ${interaction.user.tag}`);
  }
};
