const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banea a un usuario del servidor')
    .addUserOption(option => option.setName('usuario').setDescription('Usuario a banear').setRequired(true))
    .addStringOption(option => option.setName('razon').setDescription('Razón del ban').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ content: '❌ No tienes permisos para banear usuarios', ephemeral: true });
    }

    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('razon') || 'Sin razón especificada';

    try {
      await interaction.guild.members.ban(user, { reason });

      // Log en canal de registro
      const logChannel = await interaction.guild.channels.fetch('1383884637067018410').catch(() => null);
      if (logChannel) {
        const embed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('🚫 Usuario Baneado')
          .addFields(
            { name: 'Usuario', value: `${user.tag} (${user.id})`, inline: true },
            { name: 'Moderador', value: `${interaction.user.tag}`, inline: true },
            { name: 'Razón', value: reason }
          )
          .setTimestamp();
        await logChannel.send({ embeds: [embed] });
      }

      await interaction.reply({ content: `✅ ${user.tag} ha sido baneado\n**Razón:** ${reason}` });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ No se pudo banear al usuario', ephemeral: true });
    }
  }
};
