const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../database/database');
const { createProfileEmbed } = require('../utils/embedsExtended');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nota')
    .setDescription('Gestiona notas administrativas')
    .addSubcommand(sub =>
      sub.setName('añadir')
        .setDescription('Añade una nota a un usuario')
        .addUserOption(opt => opt.setName('usuario').setDescription('Usuario').setRequired(true))
        .addStringOption(opt => opt.setName('nota').setDescription('Contenido de la nota').setRequired(true))
    )
    .addSubcommand(sub =>
      sub.setName('quitar')
        .setDescription('Quita una nota de un usuario')
        .addUserOption(opt => opt.setName('usuario').setDescription('Usuario').setRequired(true))
        .addIntegerOption(opt => opt.setName('numero').setDescription('Número de la nota a quitar').setRequired(true))
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    if (!interaction.memberPermissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({ content: '❌ No tienes permisos para usar este comando', ephemeral: true });
    }

    const subcommand = interaction.options.getSubcommand();
    const user = interaction.options.getUser('usuario');

    if (subcommand === 'añadir') {
      const noteText = interaction.options.getString('nota');
      db.addNote(user.id, noteText, interaction.user.id);

      const profile = db.getProfile(user.id);
      const embed = createProfileEmbed(profile, user);

      await interaction.reply({ 
        content: `✅ Nota añadida a ${user.tag}`,
        embeds: [embed]
      });
    } else if (subcommand === 'quitar') {
      const noteIndex = interaction.options.getInteger('numero') - 1;
      const profile = db.getProfile(user.id);

      if (noteIndex >= profile.notes.length || noteIndex < 0) {
        return interaction.reply({ content: '❌ Número de nota inválido', ephemeral: true });
      }

      db.removeNote(user.id, noteIndex);
      const updatedProfile = db.getProfile(user.id);
      const embed = createProfileEmbed(updatedProfile, user);

      await interaction.reply({ 
        content: `✅ Nota removida de ${user.tag}`,
        embeds: [embed]
      });
    }
  }
};
