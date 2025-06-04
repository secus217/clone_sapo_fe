import FilterProducts from "./FilterProducts.tsx";
import OrderPage from "./OrderSummary.tsx";
import ClientOrder from "../Components/ClientOrder.tsx";

import { useEffect, useState } from "react";
import {useQuery} from "react-query";
import upstashService from "../../../api/config/upstashService.ts";

// Inside ProductList component
export default function ProductList() {
    const [informationUer , serinformationUer] = useState({ data: {} });
    const [listOrders, setListOrders] = useState<[]>([]);
    const [store, setStore] = useState(localStorage.getItem("selectedStore"));
    const { data : products } = useQuery<any, Error>(
        ['av.getAllProductShop' , store],
        () => {
            return upstashService.getallProductShop({
                storeId : store
            })
        })

    useEffect(() => {
        const interval = setInterval(() => {
            const currentStore = localStorage.getItem("selectedStore");
            if (currentStore !== store) {
                window.location.reload();
            }
        }, 500); // kiểm tra mỗi 500ms

        return () => clearInterval(interval);
    }, [store]);

    return (
        <div className='gap-3 grid'>
            <div className='p-4 bg-white rounded-lg shadow-lg'>
                <ClientOrder
                    informationUer={informationUer}
                    serinformationUer={serinformationUer}
                />
            </div>
            <div className="bg-white rounded-lg shadow-lg">
                <FilterProducts
                    products={products}
                    listOrders={listOrders}
                    setListOrders={setListOrders}
                />
                <OrderPage
                    informationUer={informationUer}
                    listOrders={listOrders}
                    setListOrders={setListOrders}
                />
            </div>
        </div>
    );
}
