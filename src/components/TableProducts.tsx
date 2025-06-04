import { Button, Input, Select, Table } from "antd";
import useGlobalApi, { useUserInfo } from "../config/states/user";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {useQuery} from "react-query";
import upstashService from "../api/config/upstashService.ts";

export const groupProducts = (products: any[] = []) => {
    return products.reduce((acc: any[], product: any) => {
        if (!product?.product?.id || !product?.store?.id) return acc;

        const existingProductIndex = acc.findIndex(
            (item) =>
                item.product?.id === product.product.id &&
                item.store?.id === product.store.id
        );

        if (existingProductIndex >= 0) {
            acc[existingProductIndex].quantity += product.quantity;
        } else {
            acc.push({ ...product });
        }

        return acc;
    }, []);
};


export const groupByStore = (products: any[] = []) => {
    const storeMap: Record<string, any> = {};
    for (const product of products) {
        if (!product?.store?.id || !product?.product?.id) continue;
        const storeId = product.store.id;
        if (!storeMap[storeId]) {
            storeMap[storeId] = {
                ...product.store,
                totalProducts: new Set([product.product.id]),
                createdAt: product.createdAt,
            };
        } else {
            storeMap[storeId].totalProducts.add(product.product.id);
        }
    }
    return Object.values(storeMap).map((store: any) => ({
        ...store,
        totalProducts: store.totalProducts.size,
    }));
};


const TableProducts = ({ setData }: any) => {
    const { products, getAllProductShop, getStore, shop } = useGlobalApi();
    const [selectedStore, setSelectedStore] = useState<any>("");
    const [nameproducts, setNameproducts] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedStoreForView, setSelectedStoreForView] = useState<any>(null);
    const { id } = useParams();
    const { userInfo } = useUserInfo();

    // Lấy dữ liệu sản phẩm và cửa hàng
    useEffect(() => {
        const data: Record<string, any> = {};
        if (userInfo?.role === "staff") {
            data.storeId = userInfo.storeId;
        } else if (selectedStore) {
            data.storeId = selectedStore;
        }

        getAllProductShop(data);
        getStore();
        setCurrentPage(1);
    }, [selectedStore]);

    // Debounce cho tìm kiếm
    useEffect(() => {
        const timeout = setTimeout(() => {
            setCurrentPage(1);
        }, 300);

        return () => clearTimeout(timeout);
    }, [nameproducts]);
    const filteredProducts = products?.filter((p) => {
        const matchStore = selectedStoreForView ? p.store?.id === selectedStoreForView : true;
        const matchName = nameproducts
            ? p.product?.name?.toLowerCase().includes(nameproducts.toLowerCase())
            : true;
        return matchStore && matchName;
    });

    const groupedProducts = groupProducts(filteredProducts || []);
    const groupedStores = groupByStore(products || []);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedData = selectedStoreForView
        ? groupedProducts.slice(startIndex, endIndex)
        : groupedStores.slice(startIndex, endIndex);
    const { data } = useQuery<any, Error>(
        ['av.allproduct'],
        () => {
            return upstashService.allproduct({
                page: 1,
                limit: 1000000000000000,
            });
        }
    );
    const columns = selectedStoreForView
        ? [
            {
                title: "Ảnh",
                dataIndex: ["product", "imageUrls"],
                key: "imageUrls",
                width: 80,
                render: (imageUrls: string) => {
                    const images = imageUrls?.split(",");
                    return images?.length > 0 ? (
                        <img
                            src={images[0]}
                            className="w-16 h-16 object-cover"
                            alt="Ảnh sản phẩm"
                        />
                    ) : (
                        "Không có ảnh"
                    );
                },
            },
            {
                title: "Loại sản phẩm",
                dataIndex: ["product", "category", "name"],
                key: "categoryName",
                filters: data?.data
                    ?.map((item: any) => item.category?.name)
                    ?.filter((value: string, index: number, self: string[]) => value && self.indexOf(value) === index)
                    ?.map((value: string) => ({
                        text: value,
                        value: value,
                    })),
                onFilter: (value: string, record: any) => record.product?.category?.name === value,
            },
            {
                title: "Sản phẩm",
                dataIndex: ["product", "name"],
                key: "name",
            },
            {
                title: "Giá bán",
                dataIndex: ["product", "retailPrice"],
                key: ["product", "retailPrice"],
                render: (price: number) => <span>{price?.toLocaleString()}/VNĐ</span>,

            },
            {
                title: "Sku",
                dataIndex: ["product", "sku"],
                key: "sku",
            },
            {
                title: "Tồn kho",
                dataIndex: "quantity",
                key: "quantity",
            },
            {
                title: "Ngày tạo",
                dataIndex: "updatedAt",
                key: "updatedAt",
                render: (value: string) =>
                    dayjs(value).format("DD/MM/YYYY HH:mm:ss"),
            },
        ]
        : [
            {
                title: "Cửa hàng",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "Tổng sản phẩm",
                dataIndex: "totalProducts",
                key: "totalProducts",
            },
            {
                title: "Ngày tạo",
                dataIndex: "createdAt",
                key: "createdAt",
                render: (value: string) =>
                    dayjs(value).format("DD/MM/YYYY HH:mm:ss"),
            },


        ];

    return (
        <>
            {!id && !selectedStoreForView ? (
                <div className="flex gap-2 mb-2">
                    {userInfo?.role !== "staff" && (
                        <Select
                            allowClear
                            size="large"
                            placeholder="Chọn cửa hàng"
                            className="rounded-lg !border-none bg-[rgb(245,245,245)] hover:bg-[#f3f4f5] w-60"
                            options={
                                shop?.stores?.map((store: any) => ({
                                    value: store.id.toString(),
                                    label: store.name,
                                })) || []
                            }
                            value={selectedStore === "" ? undefined : selectedStore}
                            onChange={(value: any) => setSelectedStore(value)}
                        />
                    )}
                </div>
            ) : (
                <div className="mb-3">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => setSelectedStoreForView(null)}
                        type="default"
                    />
                </div>
            )}

            {selectedStoreForView && (
                <div className="mb-3">
                    <Input
                        value={nameproducts}
                        onChange={(e) => setNameproducts(e.target.value)}
                        className="w-[400px]"
                        placeholder="Tên sản phẩm"
                    />
                </div>
            )}

            <Table
                onRow={(record) => ({
                    onClick: () => {
                        if (selectedStoreForView) {
                            setData(record);
                        } else {
                            setSelectedStoreForView(record.id);
                        }
                    },
                })}
                dataSource={paginatedData}
                columns={columns}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: selectedStoreForView
                        ? groupedProducts.length
                        : groupedStores.length,
                    onChange: (page, size) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    },
                    showSizeChanger: true,
                }}
                className="ant-table-custom"
                rowKey={(record) =>
                    selectedStoreForView
                        ? `${record.product.id}-${record.store.id}`
                        : `${record.id}`
                }
            />
        </>
    );
};

export default TableProducts;
