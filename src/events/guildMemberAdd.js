module.exports = {
  name: 'guildMemberAdd',

  async execute(member, logger) {
    logger.info(`${member.user.tag} se unió al servidor ${member.guild.name}`);

    // Enviar embed de bienvenida
    const welcomeChannelId = process.env.WELCOME_CHANNEL_ID;
    if (welcomeChannelId) {
      const channel = member.guild.channels.cache.get(welcomeChannelId);
      if (channel && channel.isTextBased()) {
        const embedUtils = require('../utils/embeds');
        const embed = embedUtils.createWelcomeEmbed(member, member.guild.name);
        await channel.send({ embeds: [embed] });
      }
    }

    // Enviar DM de bienvenida
    try {
      const embedUtils = require('../utils/embeds');
      const dmEmbed = embedUtils.createSuccessEmbed(
        `¡Bienvenido a ${member.guild.name}!`,
        'Nos alegra que te unas a nuestra comunidad. Esperamos que disfrutes tu estadía.'
      );
      await member.send({ embeds: [dmEmbed] });
    } catch (error) {
      logger.warn(`No se pudo enviar DM a ${member.user.tag}`);
    }
  }
};
