const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createTicketPanelEmbed, createTicketPanelButtons } = require('../utils/ticketUtils');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('panel')
    .setDescription('Sube el panel de tickets')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ Solo administradores pueden usar este comando', ephemeral: true });
    }

    const embed = createTicketPanelEmbed();
    const buttons = createTicketPanelButtons();

    await interaction.channel.send({ 
      embeds: [embed], 
      components: buttons
    });

    await interaction.reply({ content: '✅ Panel de tickets enviado', ephemeral: true });
  }
};
