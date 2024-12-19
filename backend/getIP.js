import os from 'os';

function getLocalIP() {
  const networkInterfaces = os.networkInterfaces();
  let localIP;

  for (const iface in networkInterfaces) {
    networkInterfaces[iface].forEach(details => {
      if (details.family === 'IPv4' && !details.internal) {
        localIP = details.address;
      }
    });
  }
  return localIP;
}

const localIP = getLocalIP();

//console.log(localIP);
export default localIP;