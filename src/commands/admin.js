const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const embedUtils = require('../utils/embeds');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('admin')
    .setDescription('Comandos de administrador')
    .addSubcommand(subcommand =>
      subcommand
        .setName('perfil')
        .setDescription('Ver perfil de un usuario')
        .addUserOption(option =>
          option
            .setName('usuario')
            .setDescription('Usuario a verificar')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('limpiar')
        .setDescription('Limpiar mensajes')
        .addIntegerOption(option =>
          option
            .setName('cantidad')
            .setDescription('Cantidad de mensajes a eliminar')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('ban')
        .setDescription('Banear un usuario')
        .addUserOption(option =>
          option
            .setName('usuario')
            .setDescription('Usuario a banear')
            .setRequired(true)
        )
        .addStringOption(option =>
          option
            .setName('razon')
            .setDescription('Razón del ban')
            .setRequired(false)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, logger) {
    const client = interaction.client;
    const subcommand = interaction.options.getSubcommand();

    try {
      switch (subcommand) {
        case 'perfil':
          await handlePerfil(interaction, logger);
          break;
        case 'limpiar':
          await handleLimpiar(interaction, logger);
          break;
        case 'ban':
          await handleBan(interaction, logger);
          break;
      }
    } catch (error) {
      logger.error('Error en comando admin', error);
      await interaction.reply({
        embeds: [embedUtils.createErrorEmbed('❌ Error', 'Ocurrió un error al ejecutar el comando')],
        ephemeral: true
      });
    }
  }
};

async function handlePerfil(interaction, logger) {
  const usuario = interaction.options.getUser('usuario');
  const member = await interaction.guild.members.fetch(usuario.id);

  const embed = embedUtils.createInfoEmbed(
    '👤 Perfil de Usuario',
    `Información del usuario ${usuario.username}`,
    usuario.tag
  )
    .addFields(
      { name: 'ID', value: usuario.id, inline: true },
      { name: 'Cuenta creada', value: `<t:${Math.floor(usuario.createdTimestamp / 1000)}:R>`, inline: true },
      { name: 'Se unió al servidor', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
      { name: 'Roles', value: member.roles.cache.map(r => r.toString()).join(', ') || 'Ninguno', inline: false }
    )
    .setThumbnail(usuario.displayAvatarURL({ dynamic: true }));

  await interaction.reply({
    embeds: [embed],
    ephemeral: true
  });

  logger.info(`Comando admin perfil ejecutado por ${interaction.user.tag} sobre ${usuario.tag}`);
}

async function handleLimpiar(interaction, logger) {
  const cantidad = interaction.options.getInteger('cantidad');

  await interaction.deferReply({ ephemeral: true });

  const messages = await interaction.channel.bulkDelete(cantidad, true);

  const embed = embedUtils.createSuccessEmbed(
    '✅ Mensajes eliminados',
    `Se han eliminado ${messages.size} mensajes`
  );

  await interaction.editReply({ embeds: [embed] });
  logger.info(`${cantidad} mensajes eliminados por ${interaction.user.tag}`);
}

async function handleBan(interaction, logger) {
  const usuario = interaction.options.getUser('usuario');
  const razon = interaction.options.getString('razon') || 'Sin razón especificada';

  await interaction.deferReply({ ephemeral: true });

  try {
    await interaction.guild.members.ban(usuario, { reason: razon });

    const embed = embedUtils.createSuccessEmbed(
      '✅ Usuario baneado',
      `${usuario.tag} ha sido baneado\n**Razón:** ${razon}`
    );

    await interaction.editReply({ embeds: [embed] });
    logger.info(`${usuario.tag} baneado por ${interaction.user.tag}. Razón: ${razon}`);
  } catch (error) {
    const embed = embedUtils.createErrorEmbed(
      '❌ Error',
      'No se pudo banear al usuario'
    );
    await interaction.editReply({ embeds: [embed] });
    logger.error('Error al banear usuario', error);
  }
}
