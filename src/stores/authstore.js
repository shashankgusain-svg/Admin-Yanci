import { create } from "zustand";

export const useAuthStore = create((set)=>({
    user:null,
    token:null,
    loading:null,

    setUser: (userData) => set({user:userData, loading: false}),
    setToken: (token) => set({token}),

    logout: ()=>({user:null, token:null, loading:false}),
    setLoading: (loading) => set({loading}),
}));