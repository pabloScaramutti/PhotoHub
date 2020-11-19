module.exports = {
  async find(ctx) {
    const { promisify } = require('util');
    const exec = promisify(require("child_process").exec);

    //const data = await exec("sudo iwlist wlan0 scan|grep SSID");
    const data = await exec("sudo iwlist wlan0 scan | grep -oE '(Cell|ESSID:|Encryption key:).*'");

    let split = data.stdout.split('Cell ');
    split = split.map(item => item.split('\n'));

    let result = [];

    for (let i = 0; i < split.length; i++) {
      let encryptionKey = undefined;
      let ESSID = undefined;
      for (let k = 0; k < split[i].length; k++) {
        if (split[i][k].includes('Encryption key:')) {
          encryptionKey = split[i][k];
          encryptionKey = encryptionKey.replace('Encryption key:', '');
        }
        if (split[i][k].includes('ESSID:')) {
          ESSID = split[i][k];
          ESSID = ESSID.replace('ESSID:', '');
          ESSID = ESSID.replace(/"/g, '');
        }
      }
      if (ESSID && encryptionKey) {
        result.push({ encryptionKey: encryptionKey, ESSID: ESSID });
      }
    }

    // ---- Para conectarme a una red ----
    //  iwconfig wlan0 essid name key password

    console.log("Data:", result);
    return result;
  },
};
