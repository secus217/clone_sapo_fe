import { useState } from "react";
import { Button, Card, DatePicker, Table, Tabs, Tag } from "antd";
import TableProducts from "../../components/TableProducts.tsx";
import CreateTicket from "./CreateTicket.tsx";
import { useQuery } from "react-query";
import upstashService from "../../api/config/upstashService.ts";
import dayjs from "dayjs";
import CreationListDetails from "./CreationListDetails.tsx";
import type { ColumnsType } from "antd/es/table";
import type { FilterDropdownProps } from "antd/es/table/interface";

const { TabPane } = Tabs;

const IndexWarehouseManagement = () => {
    const [isCreateVisible, setIsCreateVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("2");
    const [selectedRowData, setSelectedRowData] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    // const storedStoreId = localStorage.getItem("selectedStore");

    const { data: getallexport, refetch } = useQuery(
        ["av.getallexport" , currentPage , pageSize],
        () =>
            upstashService?.getallexport({
                // storeId: storedStoreId,
                page:currentPage,
                limit: pageSize
            }),

    );
    const handleCreateClick = () => {
        setIsCreateVisible(true);
    };

    const columns: ColumnsType<any> = [
        {
            title: "STT",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Từ kho",
            dataIndex: ["fromStore", "name"],
            key: "fromStore.name",
        },
        {
            title: "Đến kho",
            dataIndex: ["toStore", "name"],
            key: "toStore.name",
        },
        {
            title: "Ghi chú",
            dataIndex: ["note"],
            key: "note",
        },
        {
            title: "Kiểu",
            dataIndex: ["type"],
            key: "type",
            filters: [
                { text: "Nhập", value: "nhap" },
                { text: "Xuất", value: "xuat" },
            ],
            onFilter: (value, record) => record?.type === value,
            render: (type) => {
                if (type === "nhap") {
                    return <span style={{ color: "green" }}>Nhập</span>;
                }
                if (type === "xuat") {
                    return <span style={{ color: "red" }}>Xuất</span>;
                }
                return type;
            },
        },

        {
            title: "Trạng thái",
            dataIndex: ["status"],
            key: "status",
            filters: [
                { text: "Hoàn thành", value: "completed" },
                { text: "Đang xử lý", value: "processing" },
                { text: "Đã huỷ", value: "cancelled" },
            ],
            onFilter: (value, record) => record?.status === value,
            render: (status: string) => {
                let colorClass = "";
                let text = "";

                switch (status) {
                    case "completed":
                        colorClass = "bg-green-50 text-green-600";
                        text = "Hoàn thành";
                        break;
                    case "pending":
                        colorClass = "bg-orange-50 text-orange-500";
                        text = "Đang xử lý";
                        break;
                    case "cancelled":
                        colorClass = "bg-red-100 text-red-600";
                        text = "Đã huỷ";
                        break;
                    default:
                        colorClass = "bg-gray-200 text-gray-600";
                        text = status;
                }

                return (
                    <Tag className={`border-0 rounded-full px-4 py-1 ${colorClass}`}>
                        {text}
                    </Tag>
                );
            },
        },
        {
            title: "Ngày tạo",
            dataIndex: ["createdAt"],
            key: "createdAt",
            render: (value: string) =>
                dayjs(value).format("DD/MM/YYYY HH:mm:ss"),
            filterDropdown: ({
                                 setSelectedKeys,
                                 selectedKeys,
                                 confirm,
                                 clearFilters,
                             }: FilterDropdownProps) => (
                <div style={{ padding: 8 }}>
                    <DatePicker
                        style={{ width: "100%" }}
                        value={
                            selectedKeys[0]
                                ? dayjs(selectedKeys[0] as string)
                                : null
                        }
                        onChange={(date) => {
                            const val = date
                                ? date.startOf("day").toISOString()
                                : "";
                            setSelectedKeys(val ? [val] : []);
                            confirm();
                        }}
                    />
                    <Button
                        onClick={() => {
                            clearFilters?.();
                            confirm();
                        }}
                        size="small"
                        style={{ width: "100%", marginTop: 8 }}
                    >
                        Xoá lọc
                    </Button>
                </div>
            ),
            onFilter: (value, record) => {
                const recordDate = dayjs(record?.createdAt)?.format("YYYY-MM-DD");
                const filterDate = dayjs(value as string).format("YYYY-MM-DD");
                return recordDate === filterDate;
            },
        },
    ];

    // Cắt dữ liệu để phân trang client-side


    return (
        <>
            {isCreateVisible ? (
                <CreateTicket
                    onback={() => setIsCreateVisible(false)}
                    refetch={refetch}
                    setActiveTab={setActiveTab}
                />
            ) : (
                <div>
                    <div className="flex justify-end mb-3">
                        <Button type="primary" onClick={handleCreateClick}>
                            Chuyển Kho
                        </Button>
                    </div>
                    <Card bodyStyle={{ paddingTop: "0" }}>
                        <Tabs activeKey={activeTab} onChange={setActiveTab}>
                            <TabPane tab="Danh sách sản phẩm" key="1">
                                <TableProducts />
                            </TabPane>
                            <TabPane tab="Danh sách tạo phiếu" key="2">
                                {selectedRowData ? (
                                    <CreationListDetails
                                        refetch={refetch}
                                        selectedRowData={selectedRowData}
                                        onCancel={() => setSelectedRowData(null)}
                                    />
                                ) : (
                                    <Table
                                        dataSource={getallexport?.data}
                                        columns={columns}
                                        pagination={{
                                            current: currentPage,
                                            pageSize,
                                            total: getallexport?.total || 0,
                                            onChange: (page) => setCurrentPage(page),
                                        }}
                                        className="ant-table-custom"
                                        rowKey="id"
                                        onRow={(record) => ({
                                            onClick: () => {
                                                setSelectedRowData(record);
                                            },
                                        })}
                                    />
                                )}
                            </TabPane>
                        </Tabs>
                    </Card>
                </div>
            )}
        </>
    );
};

export default IndexWarehouseManagement;
