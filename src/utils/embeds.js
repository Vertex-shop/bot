const { EmbedBuilder } = require('discord.js');

const embedUtils = {
  createSuccessEmbed: (title, description, author = null) => {
    const embed = new EmbedBuilder()
      .setColor('#00AA00')
      .setTitle(title)
      .setDescription(description)
      .setTimestamp();
    
    if (author) embed.setAuthor({ name: author });
    return embed;
  },

  createErrorEmbed: (title, description, author = null) => {
    const embed = new EmbedBuilder()
      .setColor('#FF0000')
      .setTitle(title)
      .setDescription(description)
      .setTimestamp();
    
    if (author) embed.setAuthor({ name: author });
    return embed;
  },

  createInfoEmbed: (title, description, author = null) => {
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle(title)
      .setDescription(description)
      .setTimestamp();
    
    if (author) embed.setAuthor({ name: author });
    return embed;
  },

  createWelcomeEmbed: (member, guildName) => {
    return new EmbedBuilder()
      .setColor('#FFD700')
      .setTitle(`¡Bienvenido a ${guildName}!`)
      .setDescription(`Hola ${member.user.username}, nos alegra que te unas a nuestra comunidad.`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'Usuario', value: member.user.tag, inline: true },
        { name: 'Cuenta creada', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: 'Miembros totales', value: member.guild.memberCount.toString(), inline: true }
      )
      .setFooter({ text: 'Vertex Shop', iconURL: member.guild.iconURL() })
      .setTimestamp();
  }
};

module.exports = embedUtils;
