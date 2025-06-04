import type React from "react"
import {Table, Button, Tag} from "antd"
import type { ColumnsType } from "antd/es/table"
import { RightOutlined } from "@ant-design/icons"
import {useNavigate} from "react-router-dom";
import {useQuery} from "react-query";
import upstashService from "../../api/config/upstashService.ts";
import dayjs from "dayjs";

interface OrderData {
    key: string
    orderId: string
    quantity: number
    date: string
    customer: {
        name: string
        initial: string
    }
    status: "pending" | "delivered"
    total: string
}
const RecentOrders: React.FC = () => {
    const navigate = useNavigate()
    const { data } = useQuery(
        ["av.getNearOrder"],
        () => upstashService?.getNearOrder(),
    );
    const columns: ColumnsType<OrderData> = [
        {
            title: "Mã đơn",
            dataIndex: "id",
            key: "id",
            render: (text) => <span className="text-gray-700">SON00{text}</span>,
        },
        {
            title: "Số lượng sản phẩm",
            dataIndex: "quantity",
            key: "quantity",
            align: "center",
            render: (quantity) => <span className="text-gray-700">{quantity}</span>,
        },
        {
            title: "Ngày đặt",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (value: string) => dayjs(value).format("DD/MM/YYYY HH:mm:ss")
        },
        // {
        //     title: "Tên khách hàng",
        //     dataIndex: "customer",
        //     key: "customer",
        //     render: (customer) => (
        //         <div className="flex items-center">
        //             <Avatar style={{ backgroundColor: "#f5222d" }} className="mr-2 flex items-center justify-center">
        //                 {customer.initial}
        //             </Avatar>
        //             <span className="text-gray-700">{customer.name}</span>
        //         </div>
        //     ),
        // },
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
            title: "Tổng tiền",
            dataIndex: "totalAmount",
            key: "totalAmount",
            render: (total) => <span className="text-gray-700 font-medium">{total.toLocaleString()}/VNĐ</span>,
        },
    ]

    return (
        <div className="bg-white rounded-lg shadow-sm px-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-800">Đơn Hàng Gần Đây</h2>
                <Button
                    onClick={() => navigate("/orderList")}
                    type="primary" className="flex items-center  hover:bg-[#1e293b]" size="small">
                    XEM TẤT CẢ
                    <RightOutlined className="ml-1" />
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={data}
                className="recent-orders-table"
                size="middle"
            />
        </div>
    )
}

export default RecentOrders

