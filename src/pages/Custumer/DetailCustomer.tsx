import {Avatar, Card, Tag, Button, Pagination} from "antd"
import { ArrowLeftOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import {useNavigate, useParams} from "react-router-dom";
import ModalUpdateCustumer from "./ModalUpdateCustumer.tsx";
import {useState} from "react";
import {useQuery} from "react-query";
import upstashService from "../../api/config/upstashService.ts";
import {getFullAddress} from "../../config/utils/Index.ts";
import {Link} from "react-router-dom";

export default function DetailCustomer() {
    const navigate = useNavigate()
    const [modalDetailCustomer , setModalDetailCustomer] = useState<boolean>(false)
    const {id} = useParams();
    const { data , refetch } = useQuery<any, Error>(
        ['av.getuserID',id],
        () => {
            return upstashService.getuserID(id)
        })
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const { data: getorderuser } = useQuery<any, Error>(
        ['av.getorderuser', id, page],
        () => upstashService.getorderuser({ customerId: id, page, limit: pageSize }),
        {
            keepPreviousData: true,
        }
    );
    console.log('getorderuser' , getorderuser)
    const addressParts = (data?.address || data?.customer?.address)
        ? (data.address || data.customer.address).split(',').map((part:any) => part.trim())
        : [];
    const provinceCode = addressParts[0] || "";
    const districtCode = addressParts[1] || "";
    const wardCode = addressParts[2] || "";
    const addressDetail = addressParts[3] || "";

    const addressInfo = getFullAddress(provinceCode, districtCode, wardCode);
    const orders = getorderuser?.data || [];
    // Sắp xếp đơn hàng theo ngày tạo, lấy đơn mới nhất
    const sortedOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const latestOrder = sortedOrders[0];

    // Tính tổng chi tiêu
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    // Tính chi tiêu trung bình
    const averageSpent = orders.length ? totalSpent / orders.length : 0;
    return (
        <div className="max-w-5xl mx-auto p-4  min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                    <div className='flex gap-3 items-center'>
                        <Button
                            onClick={() => navigate('/custumer')}
                            icon={<ArrowLeftOutlined />}
                            size="large"
                        />
                        <h1 className="text-xl font-medium m-0">Quay lại</h1>
                    </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                    <Card className="mb-4 shadow-sm">
                        <div className="flex items-center borderBottom pb-2 gap-3">
                            <Avatar size={64}
                                    className="bg-blue-200 text-blue-700
                                    flex items-center justify-center pb">
                                <span className="text-xl">NG</span>
                            </Avatar>
                            <div>
                                <h2 className="text-xl font-medium m-0">{data?.username}</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-gray-500 mb-1">Đơn hàng mới nhất</p>
                                <p className="text-blue-500 font-medium text-lg m-0">
                                    #{latestOrder?.id }
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {latestOrder?.createdBy}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Tổng chi tiêu</p>
                                <p className="font-medium text-lg m-0">{totalSpent.toLocaleString()}đ</p>
                                <p className="text-gray-500 text-sm">{orders.length} đơn hàng</p>
                            </div>
                            <div>
                                <p className="text-gray-500 mb-1">Chi tiêu trung bình</p>
                                <p className="font-medium text-lg m-0">{averageSpent.toLocaleString(undefined, {maximumFractionDigits: 0})}đ</p>
                            </div>
                        </div>

                    </Card>

                    {/* Recent Orders */}
                    <Card className="shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium m-0">Đơn hàng gần đây({getorderuser?.data?.length})</h3>
                        </div>
                        {getorderuser?.data?.map((item: any, index: any) => (
                            <div key={index} className="borderBottom pb-4 mb-4">
                                <div className="flex justify-between items-center mb-1">
                                    <div className='flex gap-1'>
                                        <p className="text-blue-500 font-medium m-0">#{item?.id}</p>
                                        {item?.isDeleted ? (
                                            <Tag color="red" className="rounded-full border-none">
                                              <span className="flex items-center">
                                                <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                                                Đơn hàng đã hủy
                                              </span>
                                            </Tag>
                                        ) : (
                                            <Tag color={item?.orderStatus !== "processing" ? "green" : "orange"}
                                                 className="rounded-full border-none">
                                                {item?.orderStatus !== "processing" ? (
                                                    <span className="flex items-center">
                                                      <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                                      Đã giao hàng
                                                    </span>
                                                ) : (
                                                    <>
                                                        <ExclamationCircleOutlined className="mr-1"/>
                                                        Chưa giao hàng
                                                    </>
                                                )}
                                            </Tag>
                                        )}
                                    </div>

                                    <p className="font-medium m-0">{item?.totalAmount || 0}đ</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-500 text-sm m-0">
                                        {item?.createdAt ? new Date(item.createdAt).toLocaleString() : ''}
                                    </p>
                                    {item?.isDeleted ? (
                                        <Tag color="red" className="rounded-full border-none">
                                          <span className="flex items-center">
                                            <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                                            Đơn hàng đã hủy
                                          </span>
                                        </Tag>
                                    ) : (
                                        <Tag
                                            color={item?.paymentStatus !== "pending" ? "green" : "orange"}
                                            className="rounded-full border-none"
                                        >
                                            {item?.paymentStatus !== "pending" ? (
                                                <span className="flex items-center">
                                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                                  Đã thanh toán
                                                </span>
                                            ) : (
                                                <>
                                                    <ExclamationCircleOutlined className="mr-1"/>
                                                    Chưa thanh toán
                                                </>
                                            )}
                                        </Tag>
                                    )}
                                </div>
                                <div className='flex justify-end'>
                                    <Link to={`/detailOrder/${[item?.id]}`}
                                    >
                                        <p className="text-blue-500 text-sm m-0 hover:underline cursor-pointer">
                                            chi tiết đơn hàng
                                        </p>
                                    </Link>
                                </div>
                            </div>
                        ))}
                        <Pagination
                            current={page}
                            pageSize={pageSize}
                            total={getorderuser?.totalItems}
                            onChange={(page) => setPage(page)}
                            className="mt-4 text-center"
                        />
                    </Card>
                </div>

                <div className="lg:col-span-1 grid gap-3">
                    {/* Contact Info */}
                    <Card className="shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium m-0">Liên hệ</h3>
                            <Button
                                onClick={() => setModalDetailCustomer(true)}
                                type="text" icon={<EditOutlined/>}
                                className="flex items-center justify-center"
                            />
                        </div>

                        <div className="space-y-2">
                            <p className="m-0">{data?.username}</p>
                            <p className="m-0">{data?.phone}</p>
                            <div className="space-y-2">
                                <p className="m-0"> {addressDetail},{addressInfo?.ward} -  {addressInfo?.district} - {addressInfo?.province}  </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
            <ModalUpdateCustumer
                refetch={refetch}
                data={data}
                modalDetailCustomer={modalDetailCustomer}
                onCancel={() => setModalDetailCustomer(false)}
            />
        </div>
    )
}

