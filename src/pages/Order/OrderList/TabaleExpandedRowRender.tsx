import TabaleRender from "../../../components/Table.tsx";
import useGlobalApi from "../../../config/states/user";
import { useEffect, useMemo } from "react";
import {useQuery} from "react-query";
import upstashService from "../../../api/config/upstashService.ts";

const TabaleExpandedRowRender = ({ record , discount }: any) => {
    const { getAllProductShop } = useGlobalApi();
    useEffect(() => {
        if (record?.storeId) {
            getAllProductShop(record.storeId);
        }
    }, [record?.storeId]);
    const { data : productss } = useQuery<any, Error>(
        ['av.allproduct'],
        () => {
            return upstashService.allproduct({
                page: 1,
                limit: 1000000000000000,
            });
        }
    );

    const formattedData = useMemo(() => {
        return record?.orderDetails?.map((item: any, index: number) => {
            const product = productss?.data?.find((p: any) => p?.id === item.productId);
            return {
                ...item,
                key: index,
                name: product?.name || "Không xác định",
                imageUrls: product?.imageUrls || "",
                sku:product?.sku
            };
        }) || [];
    }, [record?.orderDetails , productss]);
    const columns = [
        {
            title: "STT",
            dataIndex: "id",
            key: "id",
            align: "center"
        },
        {
            title: "Sku",
            dataIndex: 'sku',
            key: 'sku'
        },
        {
            title: "Ảnh",
            dataIndex: "imageUrls",
            key: "imageUrls",
            render: (imageUrls: string) => {
                const images = imageUrls.split(","); // Tách chuỗi thành mảng URL
                return images.length > 0 ? (
                    <img src={images[0]} className="w-16 h-16 object-cover" alt="Ảnh sản phẩm" />
                ) : (
                    "Không có ảnh"
                );
            },
        },
        {
            title: "Sản phẩm",
            dataIndex: "name",
            key: "name",
            align: "center",
        },

        { title: "Số lượng", dataIndex: "quantity", key: "quantity", align: "center" },
        {
            title: "Giá bán",
            dataIndex: "unitPrice",
            key: "unitPrice",
            align: "center",
            render: (price: number) => <span>{price?.toLocaleString()}/VNĐ</span>,

        },
        { title: "Tổng giá", dataIndex: "totalPrice", key: "totalPrice", align: "center" },
    ];

    return (
        <div>
            <TabaleRender columns={columns} data={formattedData} discount ={discount} />
        </div>
    );
};

export default TabaleExpandedRowRender;
