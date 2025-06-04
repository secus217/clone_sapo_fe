import { useState } from "react"
import { Card, Select, Button } from "antd"
import { DownOutlined, EyeInvisibleOutlined } from "@ant-design/icons"

export default function NeedToProcess() {
    const [timeRange, setTimeRange] = useState("90")

    // Order status data
    const orderStatuses = [
        { key: "pending", label: "Chờ duyệt", count: 0, value: 0 },
        { key: "awaiting-payment", label: "Chờ thanh toán", count: 36, value: 68071200 },
        { key: "awaiting-packaging", label: "Chờ đóng gói", count: 1, value: 630000 },
        { key: "awaiting-pickup", label: "Chờ lấy hàng", count: 0, value: 0 },
        { key: "in-delivery", label: "Đang giao hàng", count: 6, value: 19702000 },
        { key: "awaiting-redelivery", label: "Chờ giao lại", count: 0, value: 0 },
    ]

    // Format currency
    const formatCurrency = (value: number) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }

    return (
        <div>
            <Card bodyStyle={{ padding: '0px' }}>
                <div className="flex justify-between items-center px-4 borderBottom">
                    <div className="flex items-center">
                        <h2 className="text-lg font-bold mr-2 text-blue-900">ĐƠN HÀNG CẦN XỬ LÝ</h2>
                        <Select
                            bordered={false}
                            defaultValue="90"
                            onChange={setTimeRange}
                            className="w-40"
                            suffixIcon={<DownOutlined />}
                            options={[
                                { value: "30", label: "30 ngày gần nhất" },
                                { value: "60", label: "60 ngày gần nhất" },
                                { value: "90", label: "90 ngày gần nhất" },
                            ]}
                        />
                    </div>
                    <Button type="link" className="text-blue-500 font-medium" icon={<EyeInvisibleOutlined />}>
                        Ẩn đơn hàng cần xử lý
                    </Button>
                </div>

                <div className="grid grid-cols-6 gap-2 px-4">
                    {orderStatuses.map((status, index) => (
                        <div
                            key={status.key}
                            className={`p-2 ${index !== orderStatuses.length - 1 ? "borderRight" : ""}`}
                        >
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-700">{status.label}</span>
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs ${status.count > 0 ?
                                        "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-600"}`}
                                >
                                    {status.count}
                                </span>
                            </div>
                            <div className="text-sm font-semibold">{formatCurrency(status.value)}</div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}
