import { Card, Table, Tag, Select, Image } from "antd";
import { formatRevenue } from "../../helper/utils";
import { useQuery } from "react-query";
import upstashService from "../../api/config/upstashService.ts";
import { useState } from "react";
import dayjs from "dayjs";

const { Option } = Select;

const getDate = (option: string) => {
    const today = dayjs();
    switch (option) {
        case "homqua":
            return today.subtract(1, "day").format("YYYY-MM-DD");
        case "homnay":
            return today.format("YYYY-MM-DD");
        case "tuantruoc":
            // Đổi tên value này thành "tuannay", logic dưới là tính thứ Hai đầu tuần này
            const startOfWeek = today.startOf("week").add(1, "day"); // Monday
            return startOfWeek.format("YYYY-MM-DD");
        default:
            return today.format("YYYY-MM-DD");
    }
};


const TopProducts = () => {
    const [filter, setFilter] = useState("homqua");
    const date = getDate(filter);
    const { data } = useQuery(
        ["av.getexportnotedetail", filter],
        () => upstashService?.getTopProduct(date),
        { enabled: !!filter }
    );

    const columns = [
        {
            title: "",
            dataIndex: "imageUrls",
            key: "imageUrls",
            width: 10,
            render: (img) => (
                <Tag className="w-[55px] h-[55px] flex items-center justify-center">
                    <Image
                        src={img}
                        className="w-full h-full object-cover"
                        alt="product"
                    />
                </Tag>
            ),
            onCell: () => ({ style: { paddingRight: 0 } })
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            key: "name",
            render: (text: any, record: any) => (
                <div className='grid gap-3'>
                    <div className="font-semibold flex justify-between">
                        <span>{text}</span>
                        <span className="text-gray-500">{(record.retailPrice * record?.quantity).toLocaleString()}/VND</span>
                    </div>
                    <div className="font-semibold flex justify-between">
                        <span className="text-gray-500">₫ {formatRevenue(record.retailPrice)}</span>
                        <span className="text-gray-400 text-xs">Lượt mua: {record.quantity}</span>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <Card
            bodyStyle={{ padding: 0 }}
            title="TOP SẢN PHẨM"
            extra={
                <Select defaultValue="homqua" className="w-32" onChange={setFilter}>
                    <Option value="homqua">Hôm qua</Option>
                    <Option value="homnay">Hôm nay</Option>
                    <Option value="tuannay">Tuần này</Option>
                </Select>
            }
        >
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                showHeader={false}
            />
        </Card>
    );
};

export default TopProducts;
