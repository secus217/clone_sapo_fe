import { Button, Table } from "antd";
import dayjs from "dayjs";
import { useQuery } from "react-query";
import upstashService from "../../api/config/upstashService.ts";
import { useState } from "react";
import DetailProduct from "./DetailProduct.tsx";
import { useUserInfo } from "../../config/states/user";

const GeneralWarehouse = () => {
    const [detailProducts, setDetailsProducts] = useState(false);
    const [datas, setData] = useState();
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const { data, refetch, isLoading } = useQuery<any, Error>(
        ['av.allproduct', pagination.current, pagination.pageSize],
        () =>
            upstashService.allproduct({
                page: pagination.current,
                limit: pagination.pageSize,
            }),
        {
            keepPreviousData: true,
        }
    );
        const { userInfo } = useUserInfo();

    const handleTableChange = (pag: any) => {
        setPagination({
            current: pag.current,
            pageSize: pag.pageSize,
        });
    };

    const columns = [
        {
            title: "Ảnh",
            dataIndex: "imageUrls",
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
            title: "Giá bán",
            dataIndex: "retailPrice",
            key: "retailPrice",
            width: 120,
            render: (price: number) => <span>{price?.toLocaleString()} VNĐ</span>,
        },
        {
            title: "Sku",
            dataIndex: "sku",
            key: "sku",
        },
        {
            title: "Sản phẩm",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Loại sản phẩm",
            dataIndex: ["category", "name"],
            key: "categoryName",
            filters: data?.data
                ?.map((item: any) => item.category?.name)
                ?.filter(
                    (value: string, index: number, self: string[]) =>
                        value && self.indexOf(value) === index
                )
                ?.map((value: string) => ({
                    text: value,
                    value: value,
                })),
            onFilter: (value: string, record: any) =>
                record.category?.name === value,
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
            {detailProducts ? (
                <DetailProduct
                    refetch={refetch}
                    setData={setData}
                    data={datas}
                    detailProducts={detailProducts}
                    onback={() => setDetailsProducts(false)}
                />
            ) : (
                <>
                    <div className="flex justify-end mb-3">
                        {userInfo?.role === "admin" && (
                            <Button
                                onClick={() => setDetailsProducts(true)}
                                type="primary"
                            >
                                Thêm sản phẩm
                            </Button>
                        )}
                    </div>
                    <Table
                        onRow={(record: any) => ({
                            onClick: () => {
                                setDetailsProducts(true);
                                setData(record);
                            },
                        })}
                        dataSource={data?.data || []}
                        columns={columns}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: data?.total || 0,
                            showSizeChanger: true,
                        }}
                        onChange={handleTableChange}
                        loading={isLoading}
                        rowKey="id"
                        className="ant-table-custom"
                    />
                </>
            )}
        </>
    );
};

export default GeneralWarehouse;
