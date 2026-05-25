const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('Haz que el bot diga algo')
    .addStringOption(opt => opt.setName('mensaje').setDescription('Mensaje a enviar').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ Solo administradores pueden usar este comando', ephemeral: true });
    }

    const message = interaction.options.getString('mensaje');
    await interaction.reply({ content: '✅ Mensaje enviado' });
    await interaction.channel.send(message);
  }
};
