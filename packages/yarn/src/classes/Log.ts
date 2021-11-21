import dayjs from 'dayjs';
import chalk from 'chalk';

interface LogOptions {
  prefix: string;
  color?: string;
}

/**
 * Logging class
 */
export default class Log {
  private prefix: string;

  /**
   * Logging class for the API
   * @param {object} options Options object
   * @param {string} options.prefix Options object
   * @param {string} color Color
   */
  constructor({prefix, color = 'blue'}: LogOptions) {
    this.prefix = chalk`{${color}.bold [${prefix}]}`;
  }

  /**
   * Log some text to the console
   * @param {string} text
   */
  log(text: string) {
    const timestamp = '[' + dayjs().format('DD-MM-YYYY HH:mm:ss') + ']';
    const prefix = this.prefix;
    console.log(`${timestamp} ${prefix} ${text}`);
  }
}