import axiosClient from "./axiosClient";
const upstashService = {
    Login: async (data: any): Promise<any> => {
        const url = '/users/login';
        return await axiosClient.post(url, data)
    },
    register: async (data: any): Promise<any> => {
        const url = '/users/register';
        return await axiosClient.post(url, data)
    },
    getme : async (): Promise<any> => {
        const url = '/users/me';
        return await axiosClient.get(url)
    },
    getalluserrol : async (data: any): Promise<any> => {
        const url = '/manage/get-all-staff';
        return await axiosClient.get(url , {params: data})
    },
    getalluser : async (data: any): Promise<any> => {
        const url = '/shared/get-all-customer';
        return await axiosClient.get(url , {params: data})
    },
    updateRole : async (data: any): Promise<any> => {
        const url = '/manage/update-role-for-user';
        return await axiosClient.put(url, data)
    },
    deleteuser : async (data: any): Promise<any> => {
        const url = '/manage/delete-user-by-id';
        return await axiosClient.delete(url, { data });
    },
    getuserID : async (userId : any): Promise<any> => {
        const url = `/shared/get-user-by-id?userId=${userId }`;
        return await axiosClient.get(url)
    },
    updateuser : async (data: any): Promise<any> => {
        const url = '/manage/update-user';
        return await axiosClient.post(url, data)
    },
    createuser: async (data: any): Promise<any> => {
        const url = '/shared/add-customer';
        return await axiosClient.post(url, data)
    },
    getorderuser : async (data: any): Promise<any> => {
        const url = '/shared/get-order-by-customer-id';
        return await axiosClient.get(url , {params:data})
    },
    // putproduct
    allproduct : async (data : any): Promise<any> => {
        const url = '/shared/get-all-product-of-admin';
        return await axiosClient.get(url, {params: data})
    },

    categoryProduct: async (data: any): Promise<any> => {
        const url = '/category/get-all-category';
        return await axiosClient.get(url , {params : data})
    },
    pustcategoryProduct: async (data: any): Promise<any> => {
        const url = '/category/update-category';
        return await axiosClient.put(url, data)
    },
    deletecategoryProduct: async (data: any): Promise<any> => {
        const url = `/category/delete-category`;
        return await axiosClient.delete(url, { data });
    },
    postcategoryProduct: async (data: any): Promise<any> => {
        const url = '/category/create-category';
        return await axiosClient.post(url, data)
    },
    postproduct : async (data: any): Promise<any> => {
        const url = '/shared/create-new-product';
        return await axiosClient.post(url, data)
    },
    posttproducttoinventory : async (data: any): Promise<any> => {
        const url = '/shared/provide-product-to-inventory';
        return await axiosClient.post(url, data)
    },
    getallProductShop : async (data?: any): Promise<any> => {
        const url = `/shared/get-all-product-by-store-id`;
        return await axiosClient.get(url , {params: data})
    },
    putproduct : async (data: any): Promise<any> => {
        const url = '/product/update-product';
        return await axiosClient.put(url, data)
    },
    deleteproduct : async (id: any): Promise<any> => {
        const url = `/shared/delete-product?productId=${id}`;
        return await axiosClient.put(url)
    },
    getNearOrder : async  () : Promise<any> => {
        const url = '/shared/near-order';
       return  await  axiosClient.get(url)
    },
    getTopProduct : async (date: any): Promise<any> => {
        const url = `/shared/top-product?date=${date}`;
        return await axiosClient.get(url)
    },
//Manage store
    getStore : async (): Promise<any> => {
        const url = '/shared/get-all-store-of-admin';
        return await axiosClient.post(url)
    },
    postStore : async (data: any): Promise<any> => {
        const url = '/store/create-new-store';
        return await axiosClient.post(url, data)
    },
    postStoredefault : async (data: any): Promise<any> => {
        const url = 'store/create-default-store';
        return await axiosClient.post(url, data)
    },
//
    postOrder : async (data: any): Promise<any> => {
        const url = '/shared/create-new-order';
        return await axiosClient.post(url, data)
    },
    getallOrder :async (data : any): Promise<any> => {
        const url = '/shared/get-all-order';
        return await axiosClient.get(url ,  {params : data})
    },
    deletOrder : async (data : any)  : Promise<any> => {
        const url = '/order/delete-order';
        return await axiosClient.delete(url, {
            data: data // truyền body dữ liệu
        });
    },
    getOrderid : async (id: any): Promise<any> => {
        const url = `/order/get-order-detail?orderId=${id}`;
        return await axiosClient.get(url )
    },
    putStatusOrder : async (data: any): Promise<any> => {
        const url = '/shared/update-shipping-status';
        return await axiosClient.put(url, data)
    },
    updateRemainAmount : async (data: any): Promise<any> => {
        const url ='shared/update-remain-amount'
        return await  axiosClient.put(url,data)
    },
    putOrderStatus : async (data: any): Promise<any> => {
        const url = '/order/update-order-status';
        return await axiosClient.put(url, data)
    },
    postCreateExportNote : async (data: any): Promise<any> => {
        const url = '/shared/create-new-export-note';
        return await axiosClient.post(url, data)
    },
    getallexport : async (data : any): Promise<any> => {
        const url = '/shared/get-all-export-note';
        return await axiosClient.get(url , {params : data})
    },
    getexportnotedetail: async   (id: any): Promise<any> => {
        const url = `/shared/get-export-note-detail-by-id?exportNoteId=${id}`;
        return await axiosClient.get(url)
    },
    postnotimport : async (data: any): Promise<any> => {
        const url = '/manage/approve-import-note';
        return await axiosClient.post(url, data)
    },
//     phieu thu chi
    getreceiptnote : async (data: any): Promise<any> => {
        const url = '/shared/get-all-receipt-note-for-admin';
        return await axiosClient?.get(url, {params: data})
    },


    postreceipt : async (data: any): Promise<any> => {
        const url = '/shared/create-new-receipt';
        return await axiosClient.post(url, data)
    },
    getallthuchi: async (): Promise<any> => {
        const url ='/shared/get-tong-thu-chi'
        return await axiosClient.get(url)
    },
//     lay so lieu
    getrevenues: async (): Promise<any> => {
        const url = '/shared/get-revenues';
        return await axiosClient.get(url)
    },
    getCountAllNewOrder : async (): Promise<any> => {
        const url = '/shared/get-count-all-new-order';
        return await axiosClient.get(url)
    },
    getCountPendingOrder : async () : Promise<any> => {
        const url = '/shared/get-count-pending-order';
        return await axiosClient.get(url)
    },
    getbuyday : async  (data: any) : Promise<any> => {
        const url = '/shared/get-revenue-by-day';
        return await axiosClient.get(url , {params : data})
    },
    getCountCancelOrder : async () : Promise<any> => {
        const url = '/shared/get-count-cancel-order';
        return await axiosClient.get(url)
    },
    getNoteByOrder : async (orderId : any) : Promise <any> => {
        const url = `/shared/get-all-receipt-note-by-order-id?orderId=${orderId}`;
        return await axiosClient.get(url)
    },
    deletereceiptnote : async (data: any) : Promise <any> => {
        const url = '/shared/delete-receipt-note';
        return await axiosClient.delete(url, {data})
    },
    addnewpayment : async (data: any) : Promise <any> => {
        const url ='/shared/add-new-payment'
        return  await axiosClient.put(url, data)
    }
}
export default upstashService;
