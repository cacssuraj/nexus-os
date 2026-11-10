import { contextBridge, ipcRenderer } from 'electron';
import type { NexusAPI } from '../../../packages/contracts';
const api: NexusAPI = Object.freeze({ snapshot: () => ipcRenderer.invoke('nexus:snapshot') });
contextBridge.exposeInMainWorld('nexus', api);
