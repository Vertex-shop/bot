#!/usr/bin/env node

require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const GUILD_ID = process.env.DISCORD_GUILD_ID;

const commands = [];
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if (command.data) {
    commands.push(command.data.toJSON());
    console.log(`✅ Comando registrado: ${command.data.name}`);
  }
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    console.log(`Registrando ${commands.length} comandos...`);

    if (GUILD_ID) {
      // Registrar solo en un servidor (desarrollo rápido)
      await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
        { body: commands }
      );
      console.log('✨ Comandos registrados en el servidor');
    } else {
      // Registrar globalmente (puede tardar hasta 1 hora)
      await rest.put(
        Routes.applicationCommands(CLIENT_ID),
        { body: commands }
      );
      console.log('✨ Comandos registrados globalmente');
    }
  } catch (error) {
    console.error('❌ Error registrando comandos:', error);
  }
})();
