import { useEffect, useState } from "react";
import { Input, Table, Tabs, Tag, DatePicker, Select } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { TabsProps } from "antd";
import ExpandedRowRender from "./ExpandedRowRender.tsx";
import dayjs, { Dayjs } from "dayjs";
const { RangePicker } = DatePicker;
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import useGlobalApi from "../../../config/states/user";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function TableListOrder({ setSelectedOrder, data, setStoreId }: any) {
    const [activeTab, setActiveTab] = useState("1");
    const [searchText, setSearchText] = useState("");
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { getStore, shop } = useGlobalApi();

    useEffect(() => {
        getStore();
    }, []);

    useEffect(() => {
        setCurrentPage(1); // reset trang khi thay đổi filter
    }, [searchText, dateRange]);

    const formattedOrders = data?.data?.map((order: any) => ({
        ...order,
        customerName: order?.customerOrder?.username || "Không có tên",
        createrName: order.creater?.username || "Không có tên",
    }));

    const filteredOrders = formattedOrders?.filter((order: any) => {
        const matchesName = order.customerName.toLowerCase().includes(searchText.toLowerCase());
        const matchesDate =
            !dateRange ||
            (!dateRange[0] && !dateRange[1]) ||
            (dayjs(order.createdAt).isSameOrAfter(dateRange[0]?.startOf("day")) &&
                dayjs(order.createdAt).isSameOrBefore(dateRange[1]?.endOf("day")));

        return matchesName && matchesDate;
    });

    // Cắt dữ liệu theo trang hiện tại
    const paginatedOrders = filteredOrders?.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const columns = [
        {
            title: "Mã đơn hàng",
            dataIndex: "id",
            key: "id",
            render: (text: string) => <a className="text-blue-500">SON{text}</a>,
        },
        {
            title: "Ngày tạo đơn",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (value: string) => dayjs(value).format("DD/MM/YYYY HH:mm:ss"),
        },
        {
            title: "Tên khách hàng",
            dataIndex: "customerName",
            key: "customerName",
            render: (text: string) => <a className="text-blue-500">{text}</a>,
        },
        {
            title: "Trạng thái đơn hàng",
            dataIndex: "orderStatus",
            key: "orderStatus",
            render: (
                status: "completed" | "cancelled" | "pending",
                record: any
            ) => {
                let colorClass = "";
                let label = "";

                if (record.isDeleted) {
                    colorClass = "bg-red-50 text-red-500";
                    label = "Đã hủy";
                } else {
                    switch (status) {
                        case "completed":
                            colorClass = "bg-green-50 text-green-600";
                            label = "Hoàn thành";
                            break;
                        case "pending":
                            colorClass = "bg-orange-50 text-orange-500";
                            label = "Đang xử lý";
                            break;
                        case "cancelled":
                            colorClass = "bg-red-50 text-red-500";
                            label = "Đã hủy";
                            break;
                        default:
                            colorClass = "bg-gray-50 text-gray-500";
                            label = "Không xác định";
                    }
                }

                return (
                    <Tag className={`border-0 rounded-full px-4 py-1 ${colorClass}`}>
                        {label}
                    </Tag>
                );
            },
        },
        {
            title: "Thanh toán",
            dataIndex: "paymentMethod",
            key: "paymentMethod",
            align: "center" as const,
            render: (_: string, record: any) => {
                if (record.isDeleted || record.orderStatus === "cancelled") {
                    return (
                        <div className="text-center">
                            <div className="font-medium text-red-500">(Đã hủy)</div>
                        </div>
                    );
                }

                return (
                    <div className="text-center">
                        <div
                            className={`font-medium ${
                                record.paymentStatus !== "pending"
                                    ? "text-green-500"
                                    : "text-red-500"
                            }`}
                        >
                            ({record.paymentStatus === "pending"
                            ? "Đang chờ thanh toán"
                            : "Đã thanh toán"})
                        </div>
                    </div>
                );
            },
        },
        {
            title: "Khách phải trả",
            dataIndex: "totalAmount",
            key: "totalAmount",
            align: "right" as const,
            render: (amount: number) => `${amount.toLocaleString()}/VND`,
        },
        {
            title: "Nhân viên tạo đơn",
            dataIndex: "createrName",
            key: "createrName",
        },
        {
            title: "Bán tại",
            dataIndex: ["storeInfo", "name"],
            key: ["storeInfo", "name"],
        },
    ];

    const items: TabsProps["items"] = [
        {
            key: "1",
            label: "Tất cả đơn hàng",
            children: (
                <Table
                    onRow={(record) => ({
                        onClick: () => setSelectedOrder(record),
                    })}
                    expandable={{
                        expandedRowRender: (record) =>
                            !record.isDeleted ? <ExpandedRowRender {...record} /> : null,
                        rowExpandable: (record) => !record.isDeleted,
                    }}
                    dataSource={paginatedOrders}
                    columns={columns}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: filteredOrders?.length || 0,
                        showSizeChanger: true,
                        pageSizeOptions: ["10", "20", "50", "100"],
                        onChange: (page, pageSize) => {
                            setCurrentPage(page);
                            setPageSize(pageSize);
                        },
                    }}
                    className="ant-table-custom"
                    rowKey="id"
                />
            ),
        },
    ];

    return (
        <div className="bg-white rounded-lg min-h-screen">
            <div className="p-4 flex flex-wrap gap-4 items-center">
                <Input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Tìm kiếm theo tên khách hàng"
                    prefix={<SearchOutlined className="text-gray-400" />}
                    className="flex-1 min-w-[300px]"
                />
                <RangePicker
                    onChange={(values) => setDateRange(values)}
                    className="min-w-[300px]"
                    format="DD/MM/YYYY"
                />
                <Select
                    allowClear={true}
                    placeholder="Chọn cửa hàng"
                    onChange={(value) => setStoreId(value)}
                    style={{ width: 200 }}
                >
                    {shop?.stores?.map((category: any) => (
                        <Select.Option key={category.id} value={category.id}>
                            {category.name}
                        </Select.Option>
                    ))}
                </Select>
            </div>

            <div className="border-b">
                <Tabs
                    activeKey={activeTab}
                    items={items}
                    onChange={setActiveTab}
                    className="order-tabs"
                />
            </div>
        </div>
    );
}
