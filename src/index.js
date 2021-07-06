const fsp = require('fs/promises');
const delay = require('delay');
const { spawn } = require('child_process');

module.exports = (hermione) => {
  let selenium;

  hermione.on(hermione.events.RUNNER_START, async () => {
    const file = await fsp.open('selenium.log', 'w');

    selenium = spawn('selenium-standalone', ['start'], {
      stdio: ['ignore', file, file],
    });

    await delay(2000);
  });

  hermione.on(hermione.events.RUNNER_END, () => {
    return new Promise((resolve) => {
      selenium.on('exit', () => resolve());

      selenium.kill();
    });
  });
};
