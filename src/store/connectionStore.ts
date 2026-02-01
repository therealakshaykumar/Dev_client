import {create} from 'zustand';

interface ConnectionState {
    connections: any[];
    setConnections: (connections: any[]) => void;
}

export const connectionStore = create<ConnectionState>((set)=>({
    connections: [] as any[],
    setConnections(connections: any[]) {
        set({ connections });
    }
}))