import {
    DashboardPage,
    ForgotPasswordPage,
    IndexCreateOrder,
    IndexOrderList,
    IndexProduct,
    LoginPage,
    RegisterPage,
    DetailProduct,
    DetailCustomer,
    AddCustumer,
    IndexFund,
    IndexWarehouseManagement,
    ProductType, IndexShop, DetailOrder, MoadalSoter, CustomerList, StaffList
} from "../../pages";

const appRoute = {
    dashboard: {
        path: '/',
        component: DashboardPage,
        requiredLogin: true,
    },
    login: {
        path: '/login',
        component: LoginPage,
        requiredLogin: false,
    },
    register: {
        path: '/register',
        component: RegisterPage,
        requiredLogin: false,
    },
    forgotPassword: {
        path: '/forgot-password',
        component: ForgotPasswordPage,
        requiredLogin: false,
    },
    IndexCreateOrder :{
        path: '/createOrder',
        component: IndexCreateOrder,
        requiredLogin: true,
    },
    DetailOrder: {
        path: '/detailOrder/:id',
        component: DetailOrder,
        requiredLogin: true,

    },
    IndexOrderList :{
        path: '/orderList',
        component: IndexOrderList,
        requiredLogin: true,
    },
    DetailProduct: {
        path: '/detailProduct/:id',
        component: DetailProduct,
        requiredLogin: true,
    },
    AddProduct: {
        path: '/addProduct',
        component: DetailProduct,
        requiredLogin: true,
    },
    IndexProduct :{
        path: '/product',
        component: IndexProduct,
        requiredLogin: true,
    },
    IndexProductID :{
        path: '/product/:id',
        component: IndexProduct,
        requiredLogin: true,
    },
    ProductType:{
        path: '/productType',
        component: ProductType,
        requiredLogin: true,
    },
    IndexCustumer : {
        path: '/custumer',
        component: CustomerList,
        requiredLogin: true,
    },
    DetailCustomer : {
        path:'/detailCustomer/:id',
        component: DetailCustomer,
        requiredLogin: true,
    },
    AddCustumer: {
        path: '/addCustumer',
        component: AddCustumer,
        requiredLogin: true,
    },
    IndexFund : {
        path: '/fund',
        component: IndexFund,
        requiredLogin: true,
    },
    IndexWarehouseManagement :{
        path:'/warehouseManagement',
        component: IndexWarehouseManagement,
        requiredLogin: true,
    },
    IndexShop : {
        path: '/shop',
        component: IndexShop,
        requiredLogin: true,
    },
    MoadalSoter:{
        path  : '/moadalSoter',
        component: MoadalSoter,
        requiredLogin: true,
    },
    StaffList: {
        path : '/staff',
        component: StaffList,
        requiredLogin: true,
    }
}

export default appRoute;
