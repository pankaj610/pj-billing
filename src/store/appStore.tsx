import { GoogleSignin, User } from "@react-native-google-signin/google-signin";
import { create } from "zustand";
import { AppStateType } from "../types";
import { Storage } from "../utils.js/utils";
import produce from 'immer';
import { getAllCustomer } from "../services/appService";
import { transformObjectToArray } from "../utils.js/helpers";


export const useAppStore = create<AppStateType>((set) => ({
    // App Related states
    isLoggedIn: false,
    loading: false,
    user: null,
    isRestoring: true,
    goldPrice: 49000,
    silverPrice: 52000,
    // Billing Related State
    customers: [],
    // App Related operations
    setLoggedIn: (value: boolean) => {
        set((state) => ({ ...state, isLoggedIn: value }))
    },
    login: async () => {
        try {
            set((state) => ({ ...state, loading: true }));
            const userInfo: User = await GoogleSignin.signIn();
            Storage.save('user', userInfo);
            set(produce((state: AppStateType) => {
                state.loading = false;
                state.user = userInfo;
                state.isLoggedIn = true;
            }));
        } catch (error) {
            set(produce((state: AppStateType) => {
                state.loading = false;
            }));
        }
    },
    restoreUser: async () => {
        try {
            set((state) => ({ ...state, isRestoring: true }));
            const userInfo = await Storage.get('user');
            if (userInfo) {
                set(produce((state: AppStateType) => {
                    state.isRestoring = false;
                    state.user = userInfo;
                    state.isLoggedIn = true;
                }));
            } else {
                set(produce(
                    (state: AppStateType) => {
                        state.isRestoring = false;
                        state.user = null;
                        state.isLoggedIn = false;
                    }
                ))
            }
        } catch (error) {
            set(produce(
                (state: AppStateType) => {
                    state.loading = false;
                }
            ))
        }
    },
    signOut: async () => {
        try {
            await GoogleSignin.signOut();
            Storage.remove('user');
            set(produce(
                (state: AppStateType) => {
                    state.user = null;
                    state.isLoggedIn = false;
                }
            ))
        } catch (error) {
            set(produce(
                (state: AppStateType) => {
                    state.loading = false;
                }
            ))
        }
    },
    getTodaysCustomers: () => {

    },
    getCustomer: (search: string) => {
        getAllCustomer().then((data) => {
            set(produce((state: AppStateType) => {
                const customers = transformObjectToArray(data);
                state.customers = [...customers];
            }));
        });
    },
    // Billing Related operations

}))