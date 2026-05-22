const chalk = require('chalk');
const moment = require('moment-timezone');
const fs = require('fs-extra');
const path = require('path');

const logDir = path.join(__dirname, '../system/database/botdata/logs');
fs.ensureDirSync(logDir);

const getTime = () => moment().tz('Asia/Karachi').format('hh:mm:ss A');
const getDate = () => moment().tz('Asia/Karachi').format('DD/MM/YYYY');

const writeLog = (type, message) => {
  try {
    const date = moment().tz('Asia/Karachi').format('YYYY-MM-DD');
    const logFile = path.join(logDir, `${date}.log`);
    fs.appendFileSync(logFile, `[${getTime()} || ${getDate()}] [${type}] ${message}\n`);
  } catch (e) {}
};

const printBanner = () => {
  process.stdout.write('\n');
  process.stdout.write(chalk.hex('#FF4D4D').bold('  ███████╗ █████╗ ██████╗ ██████╗  █████╗ ██████╗     ██████╗ ██████╗ ██╗  ██╗\n'));
  process.stdout.write(chalk.hex('#FF6B6B').bold('  ██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗    ██╔══██╗██╔══██╗╚██╗██╔╝\n'));
  process.stdout.write(chalk.hex('#FF8E8E').bold('  ███████╗███████║██████╔╝██║  ██║███████║██████╔╝    ██████╔╝██║  ██║ ╚███╔╝\n'));
  process.stdout.write(chalk.hex('#FF4D4D').bold('  ╚════██║██╔══██║██╔══██╗██║  ██║██╔══██║██╔══██╗    ██╔══██╗██║  ██║ ██╔██╗\n'));
  process.stdout.write(chalk.hex('#FF2020').bold('  ███████║██║  ██║██║  ██║██████╔╝██║  ██║██║  ██║    ██║  ██║██████╔╝██╔╝ ██╗\n'));
  process.stdout.write(chalk.hex('#CC0000').bold('  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝\n'));
  process.stdout.write('\n');
  process.stdout.write(chalk.green('  Developer : ') + chalk.white.bold('SARDAR RDX\n'));
  process.stdout.write(chalk.green('  WhatsApp  : ') + chalk.white.bold('+923301068874\n'));
  process.stdout.write(chalk.green('  Email     : ') + chalk.white.bold('sardarrdx@gmail.com\n'));
  process.stdout.write('\n');
};

const logs = {
  banner: printBanner,

  info: (title, ...args) => {
    const msg = args.join(' ');
    process.stdout.write(`${chalk.gray(`[${getTime()}]`)} ${chalk.cyan.bold(`◈ ${title.toUpperCase()} ◈`)} ${chalk.white(msg)}\n`);
    writeLog('INFO', `[${title}] ${msg}`);
  },

  success: (title, ...args) => {
    const msg = args.join(' ');
    const colors = [chalk.cyanBright, chalk.magentaBright, chalk.yellowBright, chalk.blueBright, chalk.greenBright];
    const c = colors[Math.floor(Math.random() * colors.length)];
    process.stdout.write(`${chalk.gray(`[${getTime()}]`)} ${c.bold(`✔ ${title.toUpperCase()} ✔`)} ${c(msg)}\n`);
    writeLog('SUCCESS', `[${title}] ${msg}`);
  },

  error: (title, ...args) => {
    const msg = args.join(' ');
    process.stdout.write(`${chalk.gray(`[${getTime()}]`)} ${chalk.red.bold(`✘ ${title.toUpperCase()} ✘`)} ${chalk.redBright(msg)}\n`);
    writeLog('ERROR', `[${title}] ${msg}`);
  },

  warn: (title, ...args) => {
    const msg = args.join(' ');
    process.stdout.write(`${chalk.gray(`[${getTime()}]`)} ${chalk.yellow.bold(`⚠ ${title.toUpperCase()} ⚠`)} ${chalk.yellowBright(msg)}\n`);
    writeLog('WARN', `[${title}] ${msg}`);
  },

  command: (name, user, threadID, client) => {
    if (!client) return;
    const exists = client.commands.has(name.toLowerCase()) ||
      Array.from(client.commands.values()).some(c => c.config?.aliases?.includes(name.toLowerCase()));
    if (!exists) return;
    process.stdout.write(
      `${chalk.gray(`[${getTime()}]`)} ` +
      `${chalk.blue.bold('⚡ CMD ⚡')} ` +
      `${chalk.cyan.bold(name)} ` +
      `${chalk.gray('by')} ${chalk.white.bold(user)} ` +
      `${chalk.gray('in')} ${chalk.blue(threadID)}\n`
    );
    writeLog('COMMAND', `${name} by ${user} in ${threadID}`);
  },

  event: (type, threadID) => {
    process.stdout.write(
      `${chalk.gray(`[${getTime()}]`)} ${chalk.magenta.bold('☄ EVENT ☄')} ` +
      `${chalk.white.bold(type)} ${chalk.gray('in')} ${chalk.blue(threadID)}\n`
    );
    writeLog('EVENT', `${type} in ${threadID}`);
  }
};

module.exports = logs;
