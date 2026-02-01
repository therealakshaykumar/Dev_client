import {create} from 'zustand';

interface RequestState {
    requests: any[];
    setRequests: (requests: any[]) => void;
}

export const requestStore = create<RequestState>((set)=>({
    requests: [] as any[],
    setRequests(requests: any[]) {
        set({ requests });
    }
}))