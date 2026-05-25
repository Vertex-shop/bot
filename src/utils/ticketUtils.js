const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

function createTicketEmbed(type, userId) {
  const typeEmojis = {
    robux: '💎',
    cuentas: '👤',
    soporte: '🆘',
    brainrots: '🧠',
    otros: '❓'
  };

  const typeNames = {
    robux: 'Comprar Robux',
    cuentas: 'Comprar Cuentas',
    soporte: 'Soporte Interno',
    brainrots: 'Brainrots',
    otros: 'Otros'
  };

  return new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle(`${typeEmojis[type] || '📋'} Ticket - ${typeNames[type] || type}`)
    .setDescription(`**Creado por:** <@${userId}>\n**Estado:** Abierto`)
    .setFooter({ text: 'Bienvenido al equipo de soporte', iconURL: 'https://media.discordapp.net/attachments/1508502710796816424/1508549850308751420/log.png' })
    .setTimestamp();
}

function createTicketButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('claim_ticket')
      .setLabel('Reclamar')
      .setStyle(ButtonStyle.Success)
      .setEmoji('👤'),
    new ButtonBuilder()
      .setCustomId('close_ticket')
      .setLabel('Cerrar Ticket')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('🚫')
  );
}

function createTicketPanelEmbed() {
  return new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle('📋 Sistema de Tickets')
    .setDescription('Selecciona el tipo de ticket que deseas abrir para recibir atención personalizada.')
    .addFields(
      { name: '💎 Comprar Robux', value: 'Solicita información sobre la compra de Robux', inline: true },
      { name: '👤 Comprar Cuentas', value: 'Consulta sobre cuentas disponibles', inline: true },
      { name: '🆘 Soporte Interno', value: 'Resuelve problemas y dudas generales', inline: true },
      { name: '🧠 Brainrots', value: 'Sección para brainrots y diversión', inline: true },
      { name: '❓ Otros', value: 'Cualquier otro asunto', inline: true }
    )
    .setFooter({ text: 'Vertex Shop', iconURL: 'https://media.discordapp.net/attachments/1508502710796816424/1508549850308751420/log.png' })
    .setTimestamp();
}

function createTicketPanelButtons() {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ticket_robux')
        .setLabel('Comprar Robux')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('💎'),
      new ButtonBuilder()
        .setCustomId('ticket_cuentas')
        .setLabel('Comprar Cuentas')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('👤'),
      new ButtonBuilder()
        .setCustomId('ticket_soporte')
        .setLabel('Soporte Interno')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🆘')
    ),
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('ticket_brainrots')
        .setLabel('Brainrots')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🧠'),
      new ButtonBuilder()
        .setCustomId('ticket_otros')
        .setLabel('Otros')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('❓')
    )
  ];
}

module.exports = {
  createTicketEmbed,
  createTicketButtons,
  createTicketPanelEmbed,
  createTicketPanelButtons
};
