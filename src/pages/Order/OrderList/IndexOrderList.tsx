import { useState, useEffect } from "react";
import TableLisrOrder from "./TableLisrOrder.tsx";
import DetailOrder from "./DetailOrder.tsx";
import useGlobalApi from "../../../config/states/user";

const IndexOrderList = () => {
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const {getallorder , allorder} = useGlobalApi();
    const [storeId, setStoreId] = useState<string | null>(null);
    console.log('selectedOrder' , selectedOrder)
    useEffect(() => {
        getallorder({
            page: 1,
            limit: 1000000000000000,
            storeId: storeId,
        })
    }, [storeId]);

    return (
        <>
            {selectedOrder ? (
                <DetailOrder
                    order={selectedOrder}
                    onBack={() => setSelectedOrder(null)}
                />
            ) : (
                <div className='space-y-4'>
                    {/*<NeedToProcess />*/}
                    <TableLisrOrder
                        setStoreId={setStoreId}
                        storeId={storeId}
                        data={allorder}
                        setSelectedOrder={setSelectedOrder}
                    />
                </div>
            )}
        </>
    );
};

export default IndexOrderList;
