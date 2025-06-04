import {Table, Select, Button, Card, Input, Empty} from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-hot-toast";

import upstashService from "../../api/config/upstashService";
import useGlobalApi, {useUserInfo} from "../../config/states/user";

const { Option } = Select;
const { Search } = Input;

const roleOptions = ["admin", "staff"];

const StaffList = () => {
    const [searchText, setSearchText] = useState("");
    const [selectedValues, setSelectedValues] = useState<{ [key: string]: { role?: string; storeId?: any } }>({});
    const [pagination, setPagination] = useState({ current: 1, pageSize: 20, total: 0 });
    const { getStore, shop } = useGlobalApi();
    useEffect(() => {
        getStore();
    }, []);

    const { data: staffData, refetch } = useQuery(
        ["av.getuserID", "staff", pagination.current , searchText],
        () => upstashService?.getalluserrol({
            page: pagination?.current,
            limit: pagination?.pageSize,
            search: searchText
        }),
        { enabled: true }
    );
    const handleSelectChange = (userId: string, key: "role" | "storeId", value: any) => {
        setSelectedValues((prev) => ({
            ...prev,
            [userId]: { ...prev[userId], [key]: value },
        }));
    };

    const handleConfirm = async (record: any) => {
        const { id, role, storeId } = record;
        const newRole = selectedValues[id]?.role ?? role;
        const newStoreId = selectedValues[id]?.storeId ?? storeId;

        try {
            await upstashService.updateRole({
                userId: id,
                role: newRole,
                storeId: Number(newStoreId),
            });
            toast.success("Cập nhật thành công");
            setSelectedValues((prev) => {
                const updated = { ...prev };
                delete updated[id];
                return updated;
            });
            refetch();
        } catch (err) {
            console.log(err);
            toast.error("Cập nhật thất bại");
        }
    };

    const columnsStaff = [
        { title: "Tên nhân viên", dataIndex: "username" },
        {
            title: "Chức Vụ",
            dataIndex: "role",
            render: (role: any, record: any) => (
                <Select
                    onClick={(e) => e.stopPropagation()}
                    className="w-[150px]"
                    defaultValue={role}
                    onChange={(value) => handleSelectChange(record.id, "role", value)}
                >
                    {roleOptions.map((option) => (
                        <Option key={option} value={option}>
                            {option}
                        </Option>
                    ))}
                </Select>
            ),
        },
        {
            title: "Cửa hàng",
            dataIndex: "storeId",
            render: (storeId: any, record: any) => (
                <Select
                    size="large"
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Chọn cửa hàng"
                    className="rounded-lg !border-none bg-[rgb(245,245,245)] hover:bg-[#f3f4f5] w-60"
                    options={
                        shop?.stores?.map((store: any) => ({
                            value: store.id,
                            label: store.name,
                        })) || []
                    }
                    value={selectedValues[record.id]?.storeId ?? storeId}
                    onChange={(value) => handleSelectChange(record.id, "storeId", value)}
                />
            ),
        },
        {
            title: "Xác nhận",
            dataIndex: "confirm",
            render: (_: any, record: any) => {
                const hasChanges = selectedValues[record.id] !== undefined;
                return (
                    <Button
                        type="primary"
                        disabled={!hasChanges}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleConfirm(record);
                        }}
                    >
                        Xác nhận
                    </Button>
                );
            },
        },
    ];
    const {userInfo} = useUserInfo()

    return (
        <div>
            <div className="flex justify-between items-center">
                <h1>Nhân viên</h1>
            </div>
            {userInfo?.role === 'admin' ? (
                <Card>
                    <Search
                        size="large"
                        placeholder="Tìm nhân viên..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ width: 300, marginBottom: 16 }}
                        allowClear
                    />

                    <Table
                        dataSource={Array.isArray(staffData) ? staffData : []}
                        columns={columnsStaff}
                        // onRow={(record) => ({
                        //     onClick: () => navigate(`/detailCustomer/${record.id}`),
                        // })}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: staffData?.meta?.totalItems || 0,
                            showSizeChanger: true,
                            onChange: (page, pageSize) => {
                                setPagination({ current: page, pageSize, total: staffData?.meta?.totalItems || 0 });
                            },
                        }}
                        className="ant-table-custom cursor-pointer"
                        rowKey="id"
                    />
                </Card>

            ) : (
                <Empty description="Nhân viên không có quyền" />

            )}


        </div>
    );
};

export default StaffList;
