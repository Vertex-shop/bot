const { Events, EmbedBuilder } = require('discord.js');
const db = require('../database/database');

module.exports = {
  name: Events.ClientReady,
  once: true,

  execute(client, logger) {
    logger.success(`✨ Bot conectado como ${client.user.tag}`);
    logger.info(`Servidor(s): ${client.guilds.cache.size}`);
    logger.info(`Usuarios totales: ${client.users.cache.size}`);
    
    client.user.setActivity('Vertex Shop', { type: 'WATCHING' });

    // Verificar usuarios encarcelados periódicamente
    setInterval(async () => {
      const jailedUsers = db.getAllJailedUsers();
      const now = Date.now();

      for (const [userId, jailData] of Object.entries(jailedUsers)) {
        if (jailData.releaseAt <= now) {
          try {
            const guild = client.guilds.cache.first();
            if (!guild) return;

            const member = await guild.members.fetch(userId).catch(() => null);
            if (member) {
              // Liberar usuario (se restaurarán los roles)
              const jailRole = guild.roles.cache.get('1369005158931103784');
              if (jailRole) {
                await member.roles.remove(jailRole);
              }
            }

            // Enviar notificación en canal de cárcel
            const jailChannel = await guild.channels.fetch('1369005579590172854').catch(() => null);
            if (jailChannel) {
              const user = await client.users.fetch(userId).catch(() => null);
              const releaseEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setTitle('🔓 USUARIO LIBERADO')
                .setDescription(`${user?.tag || 'Usuario'} ha sido liberado de la cárcel`)
                .addFields(
                  { name: 'Motivo del encarcelamiento', value: jailData.reason },
                  { name: 'Duración', value: jailData.duration },
                  { name: 'Liberado', value: 'Sistema automático' }
                )
                .setTimestamp();
              await jailChannel.send({ embeds: [releaseEmbed] });
            }

            db.unjailUser(userId);
            logger.info(`✅ Usuario ${userId} liberado de cárcel automáticamente`);
          } catch (error) {
            logger.error(`Error liberando usuario ${userId}:`, error);
          }
        }
      }
    }, 60000); // Verificar cada minuto
  }
};

