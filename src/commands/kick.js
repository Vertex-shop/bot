const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsa a un usuario del servidor')
    .addUserOption(option => option.setName('usuario').setDescription('Usuario a expulsar').setRequired(true))
    .addStringOption(option => option.setName('razon').setDescription('Razón de la expulsión').setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.KickMembers)) {
      return interaction.reply({ content: '❌ No tienes permisos para expulsar usuarios', ephemeral: true });
    }

    const user = interaction.options.getUser('usuario');
    const reason = interaction.options.getString('razon') || 'Sin razón especificada';

    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.kick(reason);

      // Log en canal de registro
      const logChannel = await interaction.guild.channels.fetch('1383884637067018410').catch(() => null);
      if (logChannel) {
        const embed = new EmbedBuilder()
          .setColor('#FFA500')
          .setTitle('👢 Usuario Expulsado')
          .addFields(
            { name: 'Usuario', value: `${user.tag} (${user.id})`, inline: true },
            { name: 'Moderador', value: `${interaction.user.tag}`, inline: true },
            { name: 'Razón', value: reason }
          )
          .setTimestamp();
        await logChannel.send({ embeds: [embed] });
      }

      await interaction.reply({ content: `✅ ${user.tag} ha sido expulsado\n**Razón:** ${reason}` });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ No se pudo expulsar al usuario', ephemeral: true });
    }
  }
};
