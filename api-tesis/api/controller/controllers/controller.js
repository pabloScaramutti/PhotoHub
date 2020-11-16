module.exports = {
  async find(ctx) {
    const { promisify } = require('util');
    const exec = promisify(require("child_process").exec);

    const data = await exec("sudo iwlist wlan0 scan|grep SSID");

    let ssid = data.stdout.split('"');
    ssid = ssid.filter((item) => { return !(item.includes('ESSID:') || item.includes('\n')) });

    // ---- Para conectarme a una red ----
    //  iwconfig wlan0 essid name key password

    console.log("Data:", ssid);
    return ssid;
  },
};
