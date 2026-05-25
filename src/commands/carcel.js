const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../database/database');
const { parseTime, formatDuration } = require('../utils/timeUtils');
const { createJailEmbed } = require('../utils/embedsExtended');

const JAIL_ROLE_ID = '1369005158931103784';
const JAIL_CHANNEL_ID = '1369005579590172854';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('carcel')
    .setDescription('Gestiona usuarios en cárcel')
    .addSubcommand(sub =>
      sub.setName('enviar')
        .setDescription('Envía a un usuario a la cárcel')
        .addUserOption(opt => opt.setName('usuario').setDescription('Usuario a encarcelar').setRequired(true))
        .addStringOption(opt => opt.setName('duracion').setDescription('Duración (ej: 2h 30m, 1h, 40m)').setRequired(true))
        .addStringOption(opt => opt.setName('razon').setDescription('Razón del encarcelamiento').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('remover')
        .setDescription('Remueve a un usuario de la cárcel')
        .addUserOption(opt => opt.setName('usuario').setDescription('Usuario a liberar').setRequired(true))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({ content: '❌ No tienes permisos para usar este comando', ephemeral: true });
    }

    const subcommand = interaction.options.getSubcommand();
    const user = interaction.options.getUser('usuario');

    try {
      const member = await interaction.guild.members.fetch(user.id);
      const jailRole = interaction.guild.roles.cache.get(JAIL_ROLE_ID);

      if (!jailRole) {
        return interaction.reply({ content: '❌ El rol de cárcel no existe', ephemeral: true });
      }

      if (subcommand === 'enviar') {
        const durationStr = interaction.options.getString('duracion');
        const reason = interaction.options.getString('razon');

        const duration = parseTime(durationStr);
        if (duration === 0) {
          return interaction.reply({ content: '❌ Formato de duración inválido. Usa: 2h 30m, 1h, 40m, etc.', ephemeral: true });
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
            msg.edit({ content: '' }).catch(() => {});
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
      } 
      else if (subcommand === 'remover') {
        const jailData = db.getJailedUser(user.id);

        if (!jailData) {
          return interaction.reply({ content: '❌ Este usuario no está en cárcel', ephemeral: true });
        }

        // Restaurar roles (vacíos por ahora, solo se remueve rol de cárcel)
        await member.roles.remove(jailRole);
        
        // Eliminar de la base de datos
        db.unjailUser(user.id);

        // Enviar notificación en canal de cárcel
        const jailChannel = await interaction.guild.channels.fetch(JAIL_CHANNEL_ID).catch(() => null);
        if (jailChannel) {
          const releaseEmbed = new EmbedBuilder()
            .setColor('#00FF00')
            .setTitle('🔓 USUARIO LIBERADO MANUALMENTE')
            .setDescription(`${user.tag} ha sido liberado de la cárcel`)
            .addFields(
              { name: 'Motivo original', value: jailData.reason },
              { name: 'Liberado por', value: interaction.user.tag },
              { name: 'Liberado por ID', value: interaction.user.id }
            )
            .setTimestamp();
          await jailChannel.send({ embeds: [releaseEmbed] });
        }

        await interaction.reply({ content: `✅ ${user.tag} ha sido liberado de la cárcel manualmente` });
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ Ocurrió un error', ephemeral: true });
    }
  }
};
