import { InfoCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button, InputNumber, Tooltip } from "antd";

interface Order {
    id: string;
    imageUrls: string;
    name: string;
    variant?: string;
    code?: string;
    quantity: number;
    retailPrice: number;
    info?: boolean;
    salesquantity : number
}

interface GetColumnsProps {
    setListOrders: (orders: Order[] | ((prevOrders: Order[]) => Order[])) => void;
}

export const getColumns = ({ setListOrders }: GetColumnsProps) => [
    {
        title: "Ảnh",
        dataIndex: ["product", "imageUrls"],
        key: ["product", "imageUrls"],
        width: 80,
        render: (image: string) => (
            <img
                src={image}
                alt="Product"
                className="w-12 h-12 rounded-lg object-cover"
            />
        ),
    },
    {
        title: "Tên sản phẩm",
        dataIndex: ["product", "name"],
        key: "name",
        render: (text: string, record: Order) => (
            <div>
                <div className="font-medium">
                    {text}{" "}
                    {record.info && (
                        <Tooltip title="Thông tin sản phẩm">
                            <InfoCircleOutlined className="text-blue-500 ml-1" />
                        </Tooltip>
                    )}
                </div>
                <div className="text-gray-500 text-sm">{record.variant}</div>
                <div className="text-blue-500 text-sm cursor-pointer">
                    {record.code}
                </div>
            </div>
        ),
    },
    {
        title: "Số lượng trong kho",
        dataIndex: "quantity",
        key: "quantity",
    },
    {
        title: "Số lượng",
        dataIndex: "salesquantity",
        key: "salesquantity",
        width: 150,
        render: (_: number, record: Order) => (
            <InputNumber
                value={record.salesquantity ?? 1}
                style={{ borderBottom: '1px solid gray', borderRadius: '0px' }}
                bordered={false}
                min={1}
                onChange={(value) => {
                    setListOrders((prevOrders) =>
                        prevOrders.map((order) =>
                            order.id === record.id
                                ? { ...order, salesquantity: value ?? 1 }
                                : order
                        )
                    );
                }}
                className="mx-1 w-16 text-center"
            />

        ),
    },
    {
        title: "Giá bán",
        dataIndex: ["product", "retailPrice"],
        key: "product.retailPrice",
        width: 120,
        render: (price: number) => <span>{price?.toLocaleString()}/VNĐ</span>,

    },
    {
        key: "action",
        width: 50,
        render: (_: any, record: Order) => (
            <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                className="flex items-center justify-center"
                onClick={() => {
                    setListOrders((prevOrders) =>
                        prevOrders.filter(order => order.id !== record.id)
                    );
                }}
            />
        ),
    },
];
