const { ipcRenderer } = require('electron');

document.getElementById('processButton').addEventListener('click', () => {
  ipcRenderer.send('process-csv');
});

ipcRenderer.on('process-csv-reply', (event, message) => {
  console.log(message);
});


