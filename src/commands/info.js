const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Muestra información del bot y sus comandos'),

  async execute(interaction) {
    const commands = interaction.client.slashCommands;
    const commandList = Array.from(commands.values());
    
    // Agrupar comandos por tipo
    const generalCmds = commandList.filter(cmd => cmd.category === 'general' || !cmd.category);
    const adminCmds = commandList.filter(cmd => cmd.category === 'admin');
    const ticketCmds = commandList.filter(cmd => cmd.category === 'tickets');

    const embed = new EmbedBuilder()
      .setColor('#FF6B35')
      .setTitle('🤖 Información del Bot - Vertex')
      .setThumbnail('https://media.discordapp.net/attachments/1508502710796816424/1508549850308751420/log.png')
      .setDescription(`
Soy **Vertex Bot**, tu asistente inteligente de Vertex Shop 🚀

Estoy aquí para ayudarte con:
⚙️ Sistema de tickets completo
👤 Gestión de perfiles administrativos
🔒 Sistema de seguridad
📊 Comandos de moderación

**Visita nuestro sitio:** [Vertex Shop Web](https://vertex-shop.github.io/web/)
      `)
      .addFields(
        { name: '📊 Estadísticas', value: `
• **Total de comandos:** ${commandList.length}
• **Comandos generales:** ${generalCmds.length}
• **Comandos admin:** ${adminCmds.length}
• **Comandos de tickets:** ${ticketCmds.length}
        ` },
        { name: '📂 Tipos de Comandos', value: `
• Generales: ping, info, say, help
• Admin: ban, kick, warn, perfil
• Tickets: ticket panel
        ` }
      )
      .setFooter({ text: 'Vertex Bot © 2024 | Mantén este servidor seguro' })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
