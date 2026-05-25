const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../database/database');
const { parseTime, formatDuration } = require('../utils/timeUtils');
const { createJailEmbed } = require('../utils/embedsExtended');

const JAIL_ROLE_ID = '1369005158931103784';
const JAIL_CHANNEL_ID = '1369005579590172854';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('carcel')
    .setDescription('Envía a un usuario a la cárcel')
    .addUserOption(opt => opt.setName('usuario').setDescription('Usuario a encarcelar').setRequired(true))
    .addStringOption(opt => opt.setName('duracion').setDescription('Duración (ej: 2h 30m, 1h, 40m)').setRequired(true))
    .addStringOption(opt => opt.setName('razon').setDescription('Razón del encarcelamiento').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({ content: '❌ No tienes permisos para usar este comando', ephemeral: true });
    }

    const user = interaction.options.getUser('usuario');
    const durationStr = interaction.options.getString('duracion');
    const reason = interaction.options.getString('razon');

    const duration = parseTime(durationStr);
    if (duration === 0) {
      return interaction.reply({ content: '❌ Formato de duración inválido. Usa: 2h 30m, 1h, 40m, etc.', ephemeral: true });
    }

    try {
      const member = await interaction.guild.members.fetch(user.id);
      const jailRole = interaction.guild.roles.cache.get(JAIL_ROLE_ID);

      if (!jailRole) {
        return interaction.reply({ content: '❌ El rol de cárcel no existe', ephemeral: true });
      }

      // Guardar roles anteriores
      const previousRoles = member.roles.cache.map(r => r.id).filter(id => id !== interaction.guild.id);

      // Quitar todos los roles excepto el de cárcel
      await member.roles.set([JAIL_ROLE_ID]);

      // Guardar en base de datos
      db.jailUser(user.id, durationStr, reason, interaction.user.id);

      // Enviar embed en el canal de cárcel
      const jailChannel = await interaction.guild.channels.fetch(JAIL_CHANNEL_ID).catch(() => null);
      if (jailChannel) {
        const jailData = db.getJailedUser(user.id);
        const embed = createJailEmbed(user, jailData, formatDuration);
        const msg = await jailChannel.send({ content: `<@${user.id}>`, embeds: [embed] });
        
        // Borrar el ping después de 2 segundos
        setTimeout(() => {
          msg.edit({ content: '' });
        }, 2000);
      }

      await interaction.reply({ content: `✅ ${user.tag} ha sido encarcelado por ${durationStr}` });

      // Liberar después del tiempo especificado
      setTimeout(async () => {
        try {
          const member = await interaction.guild.members.fetch(user.id).catch(() => null);
          if (member) {
            await member.roles.set(previousRoles);
          }
          db.unjailUser(user.id);

          if (jailChannel) {
            const releaseEmbed = new EmbedBuilder()
              .setColor('#00FF00')
              .setTitle('🔓 USUARIO LIBERADO')
              .setDescription(`${user.tag} ha sido liberado de la cárcel`)
              .addFields(
                { name: 'Motivo del encarcelamiento', value: reason },
                { name: 'Liberado por', value: 'Sistema automático' }
              )
              .setTimestamp();
            await jailChannel.send({ embeds: [releaseEmbed] });
          }
        } catch (error) {
          console.error('Error al liberar usuario:', error);
        }
      }, duration);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ No se pudo encarcelar al usuario', ephemeral: true });
    }
  }
};
