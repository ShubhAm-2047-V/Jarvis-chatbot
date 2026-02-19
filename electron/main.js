const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;
let nextServer;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    const startUrl = 'http://localhost:3000';

    mainWindow.loadURL(startUrl);

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

function startNextServer() {
    return new Promise((resolve, reject) => {
        // Use shell execution to handle pnpm/npm command resolution on Windows
        const command = 'pnpm';

        console.log(`Starting Next.js server with command: ${command} run start`);

        nextServer = spawn(command, ['run', 'start'], {
            cwd: path.join(__dirname, '..'),
            env: process.env,
            stdio: 'inherit', // Pipe output to parent process
            shell: true
        });

        nextServer.on('error', (err) => {
            console.error('Failed to start Next.js server:', err);
            reject(err);
        });

        // Validating server availability
        let attempts = 0;
        const checkServer = () => {
            attempts++;
            // console.log(`Checking server availability (attempt ${attempts})...`);
            http.get('http://localhost:3000', (res) => {
                if (res.statusCode === 200) {
                    console.log('Server is ready!');
                    resolve();
                } else {
                    console.log(`Server responded with status ${res.statusCode}, retrying...`);
                    setTimeout(checkServer, 1000);
                }
            }).on('error', (err) => {
                // Only log every 5th attempt to reduce noise
                if (attempts % 5 === 0) {
                    console.log(`Server not ready yet: ${err.message}, retrying...`);
                }
                setTimeout(checkServer, 1000);
            });
        };

        checkServer();
    });
}

app.on('ready', async () => {
    try {
        await startNextServer();
        createWindow();
    } catch (err) {
        console.error('Error starting app:', err);
    }
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

app.on('will-quit', () => {
    if (nextServer) {
        console.log('Killing Next.js server...');
        // On Windows with shell: true, process.kill() might not work as expected to kill the full tree
        // But for now let's try standard kill
        nextServer.kill();
    }
});
