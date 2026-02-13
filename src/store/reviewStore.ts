import {create} from 'zustand';

interface ReviewState {
    reviews: any[];
    setReviews: (requests: any[]) => void;
}

export const reviewStore = create<ReviewState>((set)=>({
    reviews: [] as any[],
    setReviews(reviews: any[]) {
        set({ reviews });
    }
}))