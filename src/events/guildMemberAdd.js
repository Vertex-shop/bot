const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { createWelcomeEmbed } = require('../utils/embedsExtended');

module.exports = {
  name: 'guildMemberAdd',

  async execute(member, logger) {
    logger.info(`${member.user.tag} se unió al servidor ${member.guild.name}`);

    // Enviar embed de bienvenida en el canal
    const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
    if (welcomeChannelId) {
      try {
        const channel = member.guild.channels.cache.get(welcomeChannelId);
        if (channel && channel.isTextBased()) {
          const embed = createWelcomeEmbed();
          
          const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId('ticket_soporte')
              .setLabel('Abrir Ticket')
              .setStyle(ButtonStyle.Success)
              .setEmoji('🆘')
          );

          await channel.send({ 
            content: `¡Bienvenido ${member.user}!`,
            embeds: [embed],
            components: [row]
          });
        }
      } catch (error) {
        logger.error(`Error enviando mensaje de bienvenida a ${member.user.tag}:`, error);
      }
    }
  }
};
