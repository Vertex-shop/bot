const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

class Logger {
  constructor(client = null) {
    this.client = client;
    this.logDir = path.join(__dirname, '..', '..', 'logs');
    this.logChannelId = process.env.LOG_CHANNEL_ID;
    
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  setClient(client) {
    this.client = client;
  }

  getTimestamp() {
    return new Date().toLocaleString('es-ES');
  }

  async sendToDiscord(level, message, color = 0x5865F2) {
    if (!this.client || !this.logChannelId) return;

    try {
      const channel = await this.client.channels.fetch(this.logChannelId);
      if (!channel) return;

      const embed = new EmbedBuilder()
        .setTitle(`📋 [${level}]`)
        .setDescription(message)
        .setColor(color)
        .setTimestamp();

      await channel.send({ embeds: [embed] });
    } catch (err) {
      console.error('Error enviando log a Discord:', err.message);
    }
  }

  log(level, message, error = null) {
    const timestamp = this.getTimestamp();
    const logMessage = `[${timestamp}] [${level}] ${message}`;
    
    console.log(logMessage);
    
    const logFile = path.join(this.logDir, `bot-${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, logMessage + '\n');
    
    if (error) {
      fs.appendFileSync(logFile, `  Error: ${error.stack || error}\n`);
    }
  }

  info(message) {
    this.log('INFO', message);
    this.sendToDiscord('INFO', message, 0x5865F2);
  }

  warn(message) {
    this.log('WARN', message);
    this.sendToDiscord('WARN', message, 0xFAA61A);
  }

  error(message, error) {
    this.log('ERROR', message, error);
    this.sendToDiscord('ERROR', message, 0xED4245);
  }

  success(message) {
    this.log('SUCCESS', message);
    this.sendToDiscord('SUCCESS', message, 0x57F287);
  }
}

module.exports = { Logger };
