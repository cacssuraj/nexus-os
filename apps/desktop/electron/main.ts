import { app, BrowserWindow, ipcMain, session } from 'electron';
import { cpus, freemem, totalmem } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { Snapshot } from '../../../packages/contracts';
let window: BrowserWindow | null = null;
const development = !app.isPackaged && process.argv.includes('--dev');
const entry = path.join(app.getAppPath(), 'dist/index.html');
const trustedURL = development ? 'http://127.0.0.1:5173/' : pathToFileURL(entry).href;
function cpuTimes() { return cpus().reduce((sum, cpu) => ({ idle: sum.idle + cpu.times.idle, total: sum.total + Object.values(cpu.times).reduce((a, b) => a + b, 0) }), { idle: 0, total: 0 }); }
let previous = cpuTimes();
let snapshot: Snapshot;
function sample() {
  const current = cpuTimes();
  const elapsed = current.total - previous.total;
  snapshot = { cpuPercent: elapsed > 0 ? Math.max(0, Math.min(100, 100 * (1 - (current.idle - previous.idle) / elapsed))) : null, memoryUsed: totalmem() - freemem(), memoryTotal: totalmem(), sampledAt: Date.now(), platform: process.platform };
  previous = current;
}
app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((_web, _permission, respond) => respond(false));
  sample();
  const timer = setInterval(sample, 1000);
  app.once('before-quit', () => clearInterval(timer));
  ipcMain.handle('nexus:snapshot', event => {
    if (!window || event.sender !== window.webContents || event.senderFrame !== window.webContents.mainFrame || event.senderFrame.url !== trustedURL) throw new Error('Untrusted IPC sender');
    return snapshot;
  });
  window = new BrowserWindow({ width: 1180, height: 800, minWidth: 760, minHeight: 580, backgroundColor: '#eef1f6', webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false, sandbox: true } });
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  window.webContents.on('will-navigate', event => event.preventDefault());
  window.loadURL(trustedURL);
});
app.on('window-all-closed', () => app.quit());
