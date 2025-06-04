import { Button, Input, Table } from "antd";
import { useState } from "react";
import ProductModal from "./ModalProducType.tsx";
import { useQuery } from "react-query";
import useGlobalApi, {useUserInfo} from "../../../config/states/user";

const { Search } = Input;

const ProductType = () => {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
    const { getCategoryProduct , categoryProduct } = useGlobalApi();
    const {userInfo} = useUserInfo()

    const {  refetch, isFetching } = useQuery(
        ['av.categoryProduct', searchText, pagination.current, pagination.pageSize],
        () => getCategoryProduct({
            page: pagination.current,
            limit: pagination.pageSize,
            search: searchText
        }),
        {
            keepPreviousData: true,
            onSuccess: (data: any) => {
                setPagination((prev) => ({
                    ...prev,
                    total: data?.meta?.totalItems || 0, // Cập nhật tổng số bản ghi
                }));
            },
        }
    );


    // Mở modal khi thêm mới hoặc chỉnh sửa
    const handleRowClick = (record?: any) => {
        setSelectedProduct(record || null);
        setIsModalVisible(true);
    };

    const columns = [
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
        },
    ];

    return (
        <>
            <div className='flex justify-between mb-3 gap-3'>
                <Search
                    value={searchText}
                    size='large'
                    placeholder='Tìm kiếm loại sản phẩm'
                    className='w-2/4'
                    onChange={(e) => setSearchText(e.target.value)}
                    onSearch={() => refetch()} // Khi tìm kiếm, refetch lại dữ liệu
                />
                {userInfo?.role === 'admin' &&  (

                    <Button
                        size='large'
                        type="primary"
                        onClick={() => handleRowClick()}
                    >
                        Thêm mới
                    </Button>
                )}

            </div>

            <Table
                dataSource={categoryProduct?.data}
                columns={columns}
                loading={isFetching}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: pagination.total,
                    showSizeChanger: true,
                    onChange: (page, pageSize) => {
                        setPagination({ current: page, pageSize, total: pagination.total });
                    },
                }}
                className="ant-table-custom"
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                })}
            />

            {isModalVisible && (
                <ProductModal
                    refetch={refetch}
                    visible={isModalVisible}
                    onClose={() => setIsModalVisible(false)}
                    product={selectedProduct}
                />
            )}
        </>
    );
};

export default ProductType;
