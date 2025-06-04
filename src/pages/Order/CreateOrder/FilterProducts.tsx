import { Input, List } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {  useRef, useState } from "react";

const FilterProducts = ({ setListOrders, listOrders , products }: any) => {
    const [search, setSearch] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const listRef: any = useRef(null);
    const inputRef = useRef<any>(null); // Ref để blur input
    const handleBlur = () => {
        setTimeout(() => {
            if (!listRef.current?.contains(document.activeElement)) {
                setIsSearching(false);
            }
        }, 200);
    };
    const handleSelectProduct = (product: any) => {
        const isSelected = listOrders.some((order: any) => order.id === product.id);
        let updatedProducts;
        if (isSelected) {
            updatedProducts = listOrders.filter((order: any) => order.id !== product.id); // Bỏ chọn
        } else {
            updatedProducts = [...listOrders, product]; // Thêm vào danh sách
        }

        setIsSearching(false);
        setListOrders(updatedProducts);

        // Mất focus khỏi input sau khi chọn
        inputRef.current?.blur();
    };

    const handleMouseDown = (e: any) => {
        e.preventDefault(); // Giữ dropdown không mất khi click
    };

    // const filteredProducts = products?.filter((product: any) =>
    //     product?.product?.name?.toLowerCase().includes(search.toLowerCase())
    // );
    return (
        <div className="relative w-full p-4">
            <h2 className="text-lg font-semibold mb-2">Thông tin sản phẩm</h2>
            <Input
                ref={inputRef}
                placeholder="Tìm theo tên, mã SKU..."
                prefix={<SearchOutlined />}
                value={search}
                onFocus={() => setIsSearching(true)}
                onChange={(e) => setSearch(e.target.value)}
                onBlur={handleBlur}
                className="mb-4"
            />
            {isSearching && (
                <div
                    ref={listRef}
                    onMouseDown={handleMouseDown}
                    className="absolute top-full left-0 w-3/4 max-h-96 overflow-x-hidden bg-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] rounded-lg z-50 -translate-y-4 ml-3"
                >
                    <List
                        itemLayout="horizontal"
                        dataSource={products}
                        renderItem={(item: any) => {
                            const images = item?.product?.imageUrls?.split(",").map((img: any) => img.trim());
                            return (
                                <List.Item
                                    className={`hover:bg-[#87c7ff] ${listOrders.some((order: any) => order.id === item.id) ? "bg-blue-200" : ""}`}
                                    onClick={() => handleSelectProduct(item)}
                                >
                                    <List.Item.Meta
                                        className="px-4"
                                        avatar={<img width={50} height={50} src={images?.[0]} />}
                                        title={
                                            <div className="flex justify-between items-center w-full">
                                                <span className="font-medium">{item?.product?.name || item?.productId}</span>
                                                <span className="text-lg font-semibold">{item?.retailPrice?.toLocaleString()}</span>
                                            </div>
                                        }
                                        description={
                                            <div className='flex justify-between'>
                                                <span className="text-gray-500 block">
                                                    Tồn: <span className="text-blue-500">{item?.quantity}</span> | Có thể bán: <span className="text-blue-500">{item?.quantity}</span>
                                                </span>
                                                <span className='text-red-600'>Cửa hàng : {item?.store?.name}</span>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            );
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default FilterProducts;
