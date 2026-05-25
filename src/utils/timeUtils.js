function parseTime(timeString) {
  // Ejemplo: "2h 30m", "40m", "1h", "60s"
  const timeRegex = /(\d+)([smh])/gi;
  let totalMs = 0;
  let match;

  while ((match = timeRegex.exec(timeString)) !== null) {
    const amount = parseInt(match[1]);
    const unit = match[2].toLowerCase();

    switch (unit) {
      case 's':
        totalMs += amount * 1000;
        break;
      case 'm':
        totalMs += amount * 60 * 1000;
        break;
      case 'h':
        totalMs += amount * 60 * 60 * 1000;
        break;
    }
  }

  return totalMs;
}

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.join(' ') || '0s';
}

module.exports = {
  parseTime,
  formatDuration
};
