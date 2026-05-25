const { EmbedBuilder } = require('discord.js');

async function logJailAction(guild, action, user, data = {}) {
  const LOG_CHANNEL_ID = '1383884637067018410';
  
  try {
    const logChannel = await guild.channels.fetch(LOG_CHANNEL_ID).catch(() => null);
    if (!logChannel) return;

    let embed = new EmbedBuilder()
      .setTimestamp()
      .setFooter({ text: 'Vertex Logs' });

    if (action === 'jail') {
      embed
        .setColor('#FF0000')
        .setTitle('🔒 USUARIO ENCARCELADO')
        .setDescription(`${user.tag} ha sido encarcelado`)
        .addFields(
          { name: 'Usuario', value: `<@${user.id}> (${user.id})`, inline: true },
          { name: 'Duración', value: data.duration || 'N/A', inline: true },
          { name: 'Motivo', value: data.reason || 'Sin especificar' },
          { name: 'Encarcelado por', value: `<@${data.by}> (${data.by})`, inline: true }
        );
    } else if (action === 'release_auto') {
      embed
        .setColor('#00FF00')
        .setTitle('🔓 USUARIO LIBERADO AUTOMÁTICAMENTE')
        .setDescription(`${user.tag} ha sido liberado automáticamente`)
        .addFields(
          { name: 'Usuario', value: `<@${user.id}> (${user.id})`, inline: true },
          { name: 'Motivo original', value: data.reason || 'N/A' },
          { name: 'Liberado por', value: 'Sistema automático', inline: true }
        );
    } else if (action === 'release_manual') {
      embed
        .setColor('#00AA00')
        .setTitle('🔓 USUARIO LIBERADO MANUALMENTE')
        .setDescription(`${user.tag} ha sido liberado manualmente de cárcel`)
        .addFields(
          { name: 'Usuario', value: `<@${user.id}> (${user.id})`, inline: true },
          { name: 'Motivo original', value: data.reason || 'N/A' },
          { name: 'Liberado por', value: `<@${data.by}> (${data.by})`, inline: true },
          { name: 'Razón de liberación', value: data.release_reason || 'Sin especificar' }
        );
    } else if (action === 'ticket_created') {
      embed
        .setColor('#FF6B35')
        .setTitle('🎫 TICKET CREADO')
        .setDescription(`Nuevo ticket abierto`)
        .addFields(
          { name: 'Usuario', value: `<@${user.id}> (${user.id})`, inline: true },
          { name: 'Tipo', value: data.type || 'N/A', inline: true },
          { name: 'Canal', value: data.channel || 'N/A', inline: true }
        );
    } else if (action === 'ticket_claimed') {
      embed
        .setColor('#0099FF')
        .setTitle('👤 TICKET RECLAMADO')
        .setDescription(`Ticket reclamado por staff`)
        .addFields(
          { name: 'Staff', value: `<@${user.id}> (${user.id})`, inline: true },
          { name: 'Canal', value: data.channel || 'N/A', inline: true }
        );
    } else if (action === 'ticket_closed') {
      embed
        .setColor('#FF0000')
        .setTitle('🚫 TICKET CERRADO')
        .setDescription(`Ticket cerrado`)
        .addFields(
          { name: 'Cerrado por', value: `<@${user.id}> (${user.id})`, inline: true },
          { name: 'Canal', value: data.channel || 'N/A', inline: true }
        );
    }

    await logChannel.send({ embeds: [embed] });
  } catch (error) {
    console.error('Error enviando log:', error);
  }
}

module.exports = {
  logJailAction
};
