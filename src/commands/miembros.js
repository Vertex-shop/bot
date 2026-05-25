const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('miembros')
    .setDescription('Muestra la cantidad de miembros del servidor'),

  async execute(interaction) {
    const memberCount = interaction.guild.memberCount;
    await interaction.reply({ content: `📊 Este servidor tiene **${memberCount}** miembros` });
  }
};
