import { create } from "zustand";
import upstashService from "../../../api/config/upstashService.ts";

interface IUserState {
    userInfo: any;
    setUserInfo: (userInfo: any) => void;
}

// Store quản lý userInfo
export const useUserInfo = create<IUserState>((set) => ({
    userInfo: null,
    setUserInfo: (userInfo) => set({ userInfo }),
}));

// Interface cho store dùng chung
interface ICombinedState {
    user: any;
    categoryProduct: any;
    shop: any;
    products: any;
    allorder : any;
    getallorder: (params: { page: number; limit: number; storeId?: any }) => Promise<void>;
    getUser: (params: { page: number; limit: number; search?: string }) => Promise<void>;
    getCategoryProduct: (params: { page: number; limit: number; search?: string }) => Promise<void>;
    getStore: () => Promise<void>;
    getAllProductShop: (params?:{storeId?: string , search?: string}) => Promise<void>;
}


// Store dùng chung
const useCombinedStore = create<ICombinedState>((set) => ({
    user: null,
    categoryProduct: null,
    shop: null,
    products: null,
    allorder: null,

    getUser: async ({ page, limit, search }) => {
        try {
            const user = await upstashService.getalluser({ page, limit, search });
            set({ user });
        } catch (error) {
            console.error("Error getting user info:", error);
        }
    },

    getCategoryProduct: async ({ page, limit, search }) => {
        try {
            const categoryProduct = await upstashService.categoryProduct({ page, limit, search });
            set({ categoryProduct });
        } catch (error) {
            console.error("Error getting category products:", error);
        }
    },

    getStore: async () => {
        try {
            const shop = await upstashService.getStore();
            set({ shop });
        } catch (error) {
            console.error("Error getting shop info:", error);
        }
    },

    getAllProductShop: async ({storeId ,search} : any) => {
        try {
            const products = await upstashService.getallProductShop({
                storeId,
                search
            });
            set({ products });
        } catch (error) {
            console.error("Error getting all products for shop:", error);
        }
    },
    getallorder: async ({ page, limit, storeId }) => {
        try {
            const resorder = await upstashService?.getallOrder({ page, limit, storeId });
            set({ allorder: resorder });
        } catch (error) {
            console.error("Error getting all orders:", error);
        }
    },


}));

export default function useGlobalApi() {
    return useCombinedStore();
}
