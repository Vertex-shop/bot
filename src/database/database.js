const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data');

// Crear directorio si no existe
if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath, { recursive: true });
}

class Database {
  constructor() {
    this.ticketsFile = path.join(dbPath, 'tickets.json');
    this.profilesFile = path.join(dbPath, 'profiles.json');
    this.jailFile = path.join(dbPath, 'jail.json');
    this.timerFile = path.join(dbPath, 'timers.json');
    
    this.initFiles();
  }

  initFiles() {
    [this.ticketsFile, this.profilesFile, this.jailFile, this.timerFile].forEach(file => {
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify({}, null, 2));
      }
    });
  }

  read(file) {
    try {
      return JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch (e) {
      return {};
    }
  }

  write(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }

  // TICKETS
  getTicket(ticketId) {
    const data = this.read(this.ticketsFile);
    return data[ticketId] || null;
  }

  createTicket(ticketId, userId, type, channelId) {
    const data = this.read(this.ticketsFile);
    data[ticketId] = {
      id: ticketId,
      userId,
      type,
      channelId,
      createdAt: Date.now(),
      claimed: false,
      claimedBy: null,
      claimedAt: null,
      messages: []
    };
    this.write(this.ticketsFile, data);
  }

  claimTicket(ticketId, staffId) {
    const data = this.read(this.ticketsFile);
    if (data[ticketId]) {
      data[ticketId].claimed = true;
      data[ticketId].claimedBy = staffId;
      data[ticketId].claimedAt = Date.now();
    }
    this.write(this.ticketsFile, data);
  }

  closeTicket(ticketId) {
    const data = this.read(this.ticketsFile);
    if (data[ticketId]) {
      delete data[ticketId];
    }
    this.write(this.ticketsFile, data);
  }

  // PROFILES
  getProfile(userId) {
    const data = this.read(this.profilesFile);
    return data[userId] || {
      userId,
      ticketsHandled: 0,
      notes: [],
      sanctions: [],
      createdAt: Date.now()
    };
  }

  updateProfile(userId, profile) {
    const data = this.read(this.profilesFile);
    data[userId] = profile;
    this.write(this.profilesFile, data);
  }

  addNote(userId, note, addedBy) {
    const profile = this.getProfile(userId);
    profile.notes.push({
      text: note,
      addedBy,
      date: Date.now()
    });
    this.updateProfile(userId, profile);
  }

  removeNote(userId, noteIndex) {
    const profile = this.getProfile(userId);
    if (profile.notes[noteIndex]) {
      profile.notes.splice(noteIndex, 1);
      this.updateProfile(userId, profile);
    }
  }

  // JAIL
  getJailedUser(userId) {
    const data = this.read(this.jailFile);
    return data[userId] || null;
  }

  jailUser(userId, duration, reason, jailedBy) {
    const data = this.read(this.jailFile);
    data[userId] = {
      userId,
      reason,
      jailedBy,
      jailedAt: Date.now(),
      duration,
      releaseAt: Date.now() + duration
    };
    this.write(this.jailFile, data);
  }

  unjailUser(userId) {
    const data = this.read(this.jailFile);
    if (data[userId]) {
      delete data[userId];
    }
    this.write(this.jailFile, data);
  }

  getAllJailedUsers() {
    return this.read(this.jailFile);
  }
}

module.exports = new Database();
