import { Card, Row, Col } from "antd"
import upstashService from "../../api/config/upstashService.ts";
import {useQuery} from "react-query";
// const { Option } = Select
const BusinessResults = () => {
    const { data  : getrevenues} = useQuery(
        ['av.getrevenues'],
        () => upstashService.getrevenues(),
    );
    console.log('getrevenues' , getrevenues)
    // const { data  : getCountPendingOrder} = useQuery(
    //     ['av.getCountPendingOrder'],
    //     () => upstashService.getCountPendingOrder(),
    // );
    const { data  : getCountCancelOrder} = useQuery(
        ['av.getCountCancelOrder'],
        () => upstashService.getCountCancelOrder(),
    );
    const { data  : getCountAllNewOrder} = useQuery(
        ['av.getCountAllNewOrder'],
        () => upstashService.getCountAllNewOrder(),
    );
    const stats = [
        {
            icon: '/public/iconmony.svg',
            label: "Doanh thu",
            value: getrevenues?.toLocaleString('vi-VN') || getrevenues?.data || 0,
            color: "text-blue-500",
            bgColor: "bg-blue-500",
        },
        {
            icon: '/public/iconorder.svg',
            label: "Đơn hàng mới",
            value: getCountAllNewOrder?.count?.toString() || "0",
            color: "text-green-500",
            bgColor: "bg-green-500",
        },
        // {
        //     icon: '/public/iconReturn.svg',
        //     label: "Đơn trả hàng",
        //     value: getCountPendingOrder?.count?.toString() || "0",
        //     color: "text-yellow-500",
        //     bgColor: "bg-yellow-500",
        // },
        {
            icon: '/public/iconCancellation.svg',
            label: "Đơn hủy",
            value: getCountCancelOrder?.count?.toString() || "0",
            color: "text-red-500",
            bgColor: "bg-red-500",
        },
    ]

    return (
        <Card bodyStyle={{padding: '0'}} className="rounded-lg shadow-sm">
            {/*<div className="flex justify-between items-center p-4 borderBottom" >*/}
            {/*    <h3 className="text-lg font-bold text-gray-800">KẾT QUẢ KINH DOANH TRONG NGÀY</h3>*/}
            {/*    <Select defaultValue="Tất cả chi nhánh" className="w-44 border-none">*/}
            {/*        <Option value="all">Tất cả chi nhánh</Option>*/}
            {/*        <Option value="branch1">Chi nhánh 1</Option>*/}
            {/*        <Option value="branch2">Chi nhánh 2</Option>*/}
            {/*    </Select>*/}
            {/*</div>*/}
            <div className="p-4 px-10">
                <Row gutter={[16, 16]}>
                    {stats.map((stat, index) => (
                        <Col xs={24} sm={12} md={8} key={index}>
                            <div className="flex items-center gap-3 py-2 borderRight" >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bgColor}`}>
                                    <img src={stat?.icon}/>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 m-0">{stat.label}</p>
                                    <h2 className={`text-lg font-bold m-0 ${stat.color}`}>{stat.value}</h2>
                                </div>
                            </div>
                        </Col>
                    ))}
                </Row>
            </div>
        </Card>
    )
}

export default BusinessResults
