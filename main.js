const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
let mainWindow;
const inputFile = "input.csv";
const outputFile = "output.sql";
const writeStream = fs.createWriteStream(outputFile);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: false,
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile("src/index.html");
}

function processCSV() {
  fs.createReadStream(inputFile)
    .pipe(csv())
    .on("data", (row) => {      
      const values = Object.values(row)
        .map((value) => `'${value}'`)
        .join(", ");
      const insertStatement = `INSERT INTO your_table_name VALUES (${values});\n`;
      writeStream.write(insertStatement);
    })
    .on("end", () => {
      console.log("data has been written");
    });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.on("process-csv", (event) => {
  console.log("aaa");
  processCSV();
});
