/**
 * Logger.js - Logging centralisé
 * Niveaux : DEBUG < INFO < WARN < ERROR
 *
 * @version 0.0.1
 * @author FITA - TECH_LEAD
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO:  1,
  WARN:  2,
  ERROR: 3,
  NONE:  4
};

const LOG_PREFIXES = {
  DEBUG: '🔍',
  INFO:  'ℹ️ ',
  WARN:  '⚠️ ',
  ERROR: '❌'
};

let currentLevel = LOG_LEVELS[process.env.LOG_LEVEL] !== undefined
  ? process.env.LOG_LEVEL
  : 'INFO';

class Logger {
  static setLevel(level) {
    if (LOG_LEVELS[level] !== undefined) {
      currentLevel = level;
    }
  }

  static debug(message, data = null) {
    this._log('DEBUG', message, data);
  }

  static info(message, data = null) {
    this._log('INFO', message, data);
  }

  static warn(message, data = null) {
    this._log('WARN', message, data);
  }

  static error(message, data = null) {
    this._log('ERROR', message, data);
  }

  static _log(level, message, data = null) {
    if (LOG_LEVELS[level] < LOG_LEVELS[currentLevel]) return;

    const timestamp = new Date().toISOString();
    const prefix = LOG_PREFIXES[level] || '📝';
    const formatted = `[${timestamp}] ${prefix} [${level}] ${message}`;

    if (data) {
      console.log(formatted, typeof data === 'object' ? JSON.stringify(data) : data);
    } else {
      console.log(formatted);
    }
  }

  /** Mesure de performance */
  static time(label) {
    console.time(`⏱️  ${label}`);
  }

  static timeEnd(label) {
    console.timeEnd(`⏱️  ${label}`);
  }
}

module.exports = Logger;
