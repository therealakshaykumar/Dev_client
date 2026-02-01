import {create} from 'zustand';

interface FeedState {
    feed: any[];
    setFeed: (feed: any[]) => void;
    removeFromFeed: (userId: string) => void; 
    clearFeed: (userId: string) => void; 
}

export const feedStore = create<FeedState>((set)=>({
    feed: [] as any[],
    setFeed(feed: any[]) {
        set({ feed });
    },
    removeFromFeed(userId: string) {
        set((state) => ({
            feed: state.feed.filter(user => user._id !== userId)
        }));
    },
    clearFeed: () => set({ feed: [] }),
}))