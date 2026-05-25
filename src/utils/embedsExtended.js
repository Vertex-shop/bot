const { EmbedBuilder } = require('discord.js');

function createWelcomeEmbed() {
  return new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle('🎉 ¡Bienvenido a Vertex Shop!')
    .setThumbnail('https://media.discordapp.net/attachments/1508502710796816424/1508549850308751420/log.png')
    .setDescription(`
Hola, soy **Vertex Bot**, tu asistente personal en **Vertex Shop** 🤖

**¿Qué es Vertex Shop?**
Somos una comunidad dedicada a proporcionar el mejor servicio en compra de Robux, cuentas y mucho más. Nuestro objetivo es brindarte la mejor experiencia posible con atención de calidad y precios competitivos.

**¿Cómo funcionamos?**
✨ **Acceso a tickets** - Abre un ticket para tus consultas
💎 **Productos de calidad** - Robux, cuentas verificadas
🔒 **Seguridad garantizada** - Transacciones seguras
⚡ **Atención rápida** - Nuestro equipo está siempre disponible

**¿Qué puedo hacer?**
- Comprar Robux con seguridad
- Consultar sobre cuentas disponibles
- Recibir soporte técnico
- Compartir tus brainrots favoritos

¿Tienes alguna pregunta? Abre un ticket haciendo clic en el botón de abajo o escribe cualquier duda. ¡Estamos aquí para ayudarte!

**Sitio web:** [Vertex Shop Web](https://vertex-shop.github.io/web/)
    `)
    .setFooter({ text: 'Vertex Shop © 2024', iconURL: 'https://media.discordapp.net/attachments/1508502710796816424/1508549850308751420/log.png' })
    .setTimestamp();
}

function createProfileEmbed(profile, user) {
  const sanctionsText = profile.sanctions.length > 0 
    ? profile.sanctions.map(s => `• ${s.type.toUpperCase()} - ${s.reason}`).join('\n')
    : 'Sin sanciones';

  const notesText = profile.notes.length > 0
    ? profile.notes.map((n, i) => `**${i + 1}.** ${n.text}\n*Añadido por <@${n.addedBy}>*`).join('\n')
    : 'Sin notas';

  return new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle(`👤 Perfil de ${user?.username || 'Usuario'}`)
    .setThumbnail(user?.avatarURL() || '')
    .addFields(
      { name: '📊 Tickets Atendidos', value: profile.ticketsHandled.toString(), inline: true },
      { name: '📝 Notas Administrativas', value: profile.notes.length.toString(), inline: true },
      { name: '⚠️ Sanciones', value: profile.sanctions.length.toString(), inline: true },
      { name: '📌 Notas', value: notesText },
      { name: '🚫 Sanciones', value: sanctionsText }
    )
    .setFooter({ text: 'Sistema de Perfiles Vertex' })
    .setTimestamp();
}

function createJailEmbed(user, jailData, formatDuration) {
  const remainingTime = jailData.releaseAt - Date.now();
  const timeLeft = remainingTime > 0 ? formatDuration(remainingTime) : '0s';

  return new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle('🔒 NOTIFICACIÓN DE ENCARCELAMIENTO')
    .setThumbnail(user?.avatarURL() || '')
    .addFields(
      { name: '👤 Usuario', value: `<@${jailData.userId}>`, inline: true },
      { name: '⏰ Duración', value: jailData.duration, inline: true },
      { name: '⏳ Tiempo Restante', value: timeLeft, inline: true },
      { name: '📋 Motivo', value: jailData.reason },
      { name: '👨‍⚖️ Enviado por', value: `<@${jailData.jailedBy}>`, inline: true },
      { name: '📅 Fecha', value: `<t:${Math.floor(jailData.jailedAt / 1000)}:F>`, inline: true }
    )
    .setFooter({ text: 'Sistema de Seguridad Vertex' })
    .setTimestamp();
}

function createInfoEmbed(commands) {
  const commandTypes = {};
  commands.forEach(cmd => {
    if (!commandTypes[cmd.type]) commandTypes[cmd.type] = 0;
    commandTypes[cmd.type]++;
  });

  const typeText = Object.entries(commandTypes)
    .map(([type, count]) => `• **${type}**: ${count} comandos`)
    .join('\n');

  return new EmbedBuilder()
    .setColor('#FF6B35')
    .setTitle('🤖 Información del Bot')
    .setThumbnail('https://media.discordapp.net/attachments/1508502710796816424/1508549850308751420/log.png')
    .setDescription(`
Soy **Vertex Bot**, tu asistente inteligente de Vertex Shop 🚀

**Funcionalidades principales:**
⚙️ Sistema de tickets completo
👤 Gestión de perfiles administrativos
🔒 Sistema de seguridad y cárcel
📊 Comandos de moderación
📡 Información en tiempo real

**Visita nuestro sitio web:** [Vertex Shop Web](https://vertex-shop.github.io/web/)
    `)
    .addFields(
      { name: '📊 Total de Comandos', value: commands.length.toString(), inline: true },
      { name: '📂 Tipos de Comandos', value: typeText }
    )
    .setFooter({ text: 'Vertex Bot © 2024' })
    .setTimestamp();
}

module.exports = {
  createWelcomeEmbed,
  createProfileEmbed,
  createJailEmbed,
  createInfoEmbed
};
