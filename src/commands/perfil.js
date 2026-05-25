const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../database/database');
const { createProfileEmbed } = require('../utils/embedsExtended');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('perfil')
    .setDescription('Gestiona perfiles de usuarios')
    .addSubcommand(sub =>
      sub.setName('revisar')
        .setDescription('Revisa el perfil de un usuario')
        .addUserOption(opt => opt.setName('usuario').setDescription('Usuario a revisar').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('sancionar')
        .setDescription('Añade una sanción a un usuario')
        .addUserOption(opt => opt.setName('usuario').setDescription('Usuario').setRequired(true))
        .addStringOption(opt => opt.setName('tipo').setDescription('Tipo de sanción (warn, mute, etc)').setRequired(true))
        .addStringOption(opt => opt.setName('razon').setDescription('Razón de la sanción').setRequired(true))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({ content: '❌ No tienes permisos para usar este comando', ephemeral: true });
    }

    const subcommand = interaction.options.getSubcommand();
    const user = interaction.options.getUser('usuario');

    if (subcommand === 'revisar') {
      const profile = db.getProfile(user.id);
      const embed = createProfileEmbed(profile, user);
      await interaction.reply({ embeds: [embed] });
    } else if (subcommand === 'sancionar') {
      const type = interaction.options.getString('tipo');
      const reason = interaction.options.getString('razon');

      const profile = db.getProfile(user.id);
      profile.sanctions.push({
        type,
        reason,
        date: Date.now(),
        by: interaction.user.id
      });
      db.updateProfile(user.id, profile);

      const embed = createProfileEmbed(profile, user);
      await interaction.reply({ 
        content: `✅ Sanción añadida a ${user.tag}`,
        embeds: [embed]
      });
    }
  }
};
