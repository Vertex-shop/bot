# Bot Vertex Shop 🤖

Bot de Discord completamente funcional con sistema de comandos, logs y panel de bienvenida.

## 🚀 Características

- ✅ Sistema de comandos Slash Commands
- ✅ Comando `/admin` (perfil, limpiar, ban)
- ✅ Panel de bienvenida con embeds
- ✅ Sistema de logs automático
- ✅ Manejo de eventos
- ✅ Estructura escalable

## 📦 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/Vertex-shop/bot.git
cd bot
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# Crear archivo .env
cat > .env << EOF
DISCORD_TOKEN=TU_TOKEN_AQUI
DISCORD_CLIENT_ID=1508505769224700024
DISCORD_GUILD_ID=TU_GUILD_ID_AQUI
LOG_CHANNEL_ID=TU_LOG_CHANNEL_ID
WELCOME_CHANNEL_ID=TU_WELCOME_CHANNEL_ID
EOF
```

> **⚠️ IMPORTANTE**: Nunca compartas tu token públicamente. Si lo hiciste, regenera uno nuevo en Discord Developer Portal.

### 4. Registrar comandos Slash
```bash
npm run register
```

### 5. Iniciar el bot
```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

## 📋 Comandos Disponibles

### `/admin perfil [usuario]`
Muestra el perfil de un usuario con información detallada.

**Uso:**
```
/admin perfil usuario:@Usuario
```

### `/admin limpiar [cantidad]`
Elimina múltiples mensajes del canal.

**Uso:**
```
/admin limpiar cantidad:10
```

### `/admin ban [usuario] [razón]`
Baña a un usuario del servidor.

**Uso:**
```
/admin ban usuario:@Usuario razón:Spam
```

### `/ping`
Muestra la latencia del bot.

**Uso:**
```
/ping
```

## 📁 Estructura del Proyecto

```
bot/
├── src/
│   ├── commands/          # Comandos Slash
│   │   ├── admin.js       # Comando admin
│   │   └── ping.js        # Comando ping
│   ├── events/            # Eventos del bot
│   │   ├── ready.js       # Bot conectado
│   │   ├── guildMemberAdd.js  # Miembro se une
│   │   ├── interactionCreate.js  # Interacciones
│   │   ├── messageCreate.js  # Mensajes
│   │   ├── guildCreate.js    # Bot agregado
│   │   └── error.js       # Errores
│   └── utils/             # Utilidades
│       ├── logger.js      # Sistema de logs
│       └── embeds.js      # Funciones de embeds
├── logs/                  # Archivos de log
├── index.js               # Archivo principal
├── registerCommands.js    # Registrador de comandos
├── .env                   # Variables de entorno
├── .gitignore             # Archivos ignorados
└── package.json           # Dependencias
```

## 🔧 Configuración Detallada

### Variables de Entorno (.env)

| Variable | Descripción | Obligatorio |
|----------|-------------|------------|
| `DISCORD_TOKEN` | Token del bot desde Developer Portal | ✅ |
| `DISCORD_CLIENT_ID` | ID del cliente del bot | ✅ |
| `DISCORD_GUILD_ID` | ID del servidor (para registro rápido) | ❌ |
| `LOG_CHANNEL_ID` | ID del canal para logs | ❌ |
| `WELCOME_CHANNEL_ID` | ID del canal de bienvenida | ❌ |

### Obtener IDs

1. **Token del bot:**
   - Ir a [Discord Developer Portal](https://discord.com/developers/applications)
   - Crear nueva aplicación
   - Ir a "Bot" → "Add Bot"
   - Copiar el token

2. **Client ID:**
   - En Developer Portal → General Information → Application ID

3. **Guild/Channel ID:**
   - Activar modo de desarrollador en Discord
   - Click derecho → "Copy User/Server/Channel ID"

## 📊 Sistema de Logs

Los logs se guardan automáticamente en la carpeta `logs/` con nombre: `bot-YYYY-MM-DD.log`

Ejemplo de log:
```
[25/5/2026 14:30:45] [INFO] Comando ping ejecutado por Usuario#1234
[25/5/2026 14:31:00] [SUCCESS] Bot conectado como NombreBot#0001
```

## 🎨 Panel de Bienvenida

El bot envía automáticamente:
1. **Embed en el canal de bienvenida** (si está configurado)
2. **Mensaje privado** al usuario

Personalización disponible en `src/utils/embeds.js`

## ⚙️ Desarrollo

### Agregar nuevo comando

1. Crear archivo en `src/commands/`
2. Usar estructura del archivo `admin.js`
3. Ejecutar `npm run register`

Ejemplo:
```javascript
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('nuevocomando')
    .setDescription('Descripción'),

  async execute(interaction, client, logger) {
    await interaction.reply('¡Hola!');
  }
};
```

### Agregar nuevo evento

1. Crear archivo en `src/events/`
2. Exportar con `name` y `execute`

Ejemplo:
```javascript
module.exports = {
  name: 'messageCreate',
  
  async execute(message, client, logger) {
    console.log(message.content);
  }
};
```

## 🐛 Troubleshooting

### Bot no responde
- Verificar que el token sea correcto
- Revisar permisos del bot en Discord
- Ver logs en `logs/bot-*.log`

### Comandos no aparecen
- Ejecutar `npm run register`
- Esperar hasta 1 hora (si son globales)
- Si usa GUILD_ID, verificar que sea correcto

### DM no se envía
- Verificar permisos del bot
- El usuario podría tener DM deshabilitados

## 📝 Licencia

MIT - Vertex Shop 2026

## 🤝 Soporte

Para soporte, crear un issue o contactar al equipo de Vertex Shop.
