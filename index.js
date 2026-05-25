require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { Logger } = require('./src/utils/logger');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const logger = new Logger(client);
client.logger = logger;
client.commands = new Collection();
client.slashCommands = new Collection();

// Cargar comandos
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  if (command.data && command.execute) {
    client.commands.set(command.data.name, command);
    client.slashCommands.set(command.data.name, command);
    logger.info(`✅ Comando cargado: ${command.data.name}`);
  }
}

// Cargar eventos
const eventsPath = path.join(__dirname, 'src', 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  
  if (event.name && event.execute) {
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, logger));
    } else {
      client.on(event.name, (...args) => event.execute(...args, logger));
    }
    logger.info(`✅ Evento cargado: ${event.name}`);
  }
}

// Login
client.login(process.env.DISCORD_TOKEN);
