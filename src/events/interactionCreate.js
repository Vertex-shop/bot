const { Events, ChannelType, EmbedBuilder, PermissionOverwrites } = require('discord.js');
const db = require('../database/database');
const { createTicketEmbed, createTicketButtons } = require('../utils/ticketUtils');

const TICKET_CATEGORY = '1333325006100238378';
const TICKET_ROLE = '1339117204410601624';

module.exports = {
  name: 'interactionCreate',

  async execute(interaction, logger) {
    const client = interaction.client;

    // Manejar comandos slash
    if (interaction.isChatInputCommand()) {
      const command = client.slashCommands.get(interaction.commandName);

      if (!command) {
        logger.warn(`Comando no encontrado: ${interaction.commandName}`);
        return;
      }

      try {
        const logMessage = `🔴 Comando ejecutado: **${interaction.commandName}** por **${interaction.user.tag}** en **${interaction.guild.name}**`;
        logger.info(logMessage);
        await command.execute(interaction, logger);
      } catch (error) {
        logger.error(`❌ Error en comando ${interaction.commandName}`, error);
        
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: '❌ Ocurrió un error al ejecutar el comando',
            ephemeral: true
          });
        } else {
          await interaction.reply({
            content: '❌ Ocurrió un error al ejecutar el comando',
            ephemeral: true
          });
        }
      }
    }

    // Manejar botones de tickets
    if (interaction.isButton()) {
      const buttonId = interaction.customId;

      if (buttonId.startsWith('ticket_')) {
        try {
          const ticketType = buttonId.replace('ticket_', '');
          const typeMap = {
            robux: 'robux',
            cuentas: 'cuentas',
            soporte: 'soporte',
            brainrots: 'brainrots',
            otros: 'otros'
          };

          const type = typeMap[ticketType] || ticketType;
          const category = await interaction.guild.channels.fetch(TICKET_CATEGORY);
          
          if (!category) {
            return interaction.reply({ content: '❌ Categoría de tickets no encontrada', ephemeral: true });
          }

          // Crear canal de ticket
          const ticketChannel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: TICKET_CATEGORY,
            permissionOverwrites: [
              {
                id: interaction.guild.id,
                deny: ['ViewChannel']
              },
              {
                id: interaction.user.id,
                allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
              },
              {
                id: TICKET_ROLE,
                allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
              }
            ]
          });

          // Guardar ticket en BD
          db.createTicket(ticketChannel.id, interaction.user.id, type, ticketChannel.id);

          // Crear embed y botones
          const embed = createTicketEmbed(type, interaction.user.id);
          const buttons = createTicketButtons();

          const ticketMsg = await ticketChannel.send({
            content: `<@&${TICKET_ROLE}>`,
            embeds: [embed],
            components: [buttons]
          });

          // Borrar ping después de 2 segundos
          setTimeout(() => {
            ticketMsg.edit({ content: '' }).catch(() => {});
          }, 2000);

          await interaction.reply({ 
            content: `✅ Ticket creado: ${ticketChannel}`, 
            ephemeral: true 
          });
          return;
        } catch (error) {
          logger.error('Error creando ticket:', error);
          await interaction.reply({ 
            content: '❌ Error al crear el ticket', 
            ephemeral: true 
          });
          return;
        }
      }

      // Reclamar ticket
      if (buttonId === 'claim_ticket') {
        try {
          if (!interaction.member.permissions.has('ModerateMembers')) {
            return interaction.reply({ 
              content: '❌ No tienes permisos para reclamar tickets', 
              ephemeral: true 
            });
          }

          const ticket = db.getTicket(interaction.channelId);
          if (!ticket) {
            return interaction.reply({ 
              content: '❌ Ticket no encontrado en la base de datos', 
              ephemeral: true 
            });
          }

          if (ticket.claimed) {
            return interaction.reply({ 
              content: '❌ Este ticket ya ha sido reclamado', 
              ephemeral: true 
            });
          }

          db.claimTicket(interaction.channelId, interaction.user.id);
          
          // Actualizar perfil
          const profile = db.getProfile(interaction.user.id);
          profile.ticketsHandled = (profile.ticketsHandled || 0) + 1;
          db.updateProfile(interaction.user.id, profile);

          const embed = new EmbedBuilder()
            .setColor('#00FF00')
            .setDescription(`✅ Ticket reclamado por ${interaction.user.tag}`);

          await interaction.reply({ embeds: [embed] });
          return;
        } catch (error) {
          logger.error('Error reclamando ticket:', error);
          await interaction.reply({ 
            content: '❌ Error al reclamar el ticket', 
            ephemeral: true 
          });
          return;
        }
      }

      // Cerrar ticket
      if (buttonId === 'close_ticket') {
        try {
          if (!interaction.member.permissions.has('ModerateMembers')) {
            return interaction.reply({ 
              content: '❌ No tienes permisos para cerrar tickets', 
              ephemeral: true 
            });
          }

          const ticket = db.getTicket(interaction.channelId);
          if (!ticket) {
            return interaction.reply({ 
              content: '❌ Ticket no encontrado en la base de datos', 
              ephemeral: true 
            });
          }

          db.closeTicket(interaction.channelId);

          const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setTitle('🚫 Ticket Cerrado')
            .setDescription(`Este ticket ha sido cerrado por ${interaction.user.tag}`)
            .setTimestamp();

          await interaction.reply({ embeds: [embed] });

          // Eliminar canal después de 5 segundos
          setTimeout(() => {
            interaction.channel.delete().catch(() => {});
          }, 5000);
          return;
        } catch (error) {
          logger.error('Error cerrando ticket:', error);
          await interaction.reply({ 
            content: '❌ Error al cerrar el ticket', 
            ephemeral: true 
          });
          return;
        }
      }
    }
  }
};

