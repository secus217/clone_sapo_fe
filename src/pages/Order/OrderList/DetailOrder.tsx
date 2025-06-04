import {Button, Card, Steps, Typography, Table , Tag , Popconfirm } from "antd"
import { CheckCircleFilled, ArrowLeftOutlined} from "@ant-design/icons"
import FormCustumer from "../../../components/FormCustumer.tsx"
import moment from "moment";
import upstashService from "../../../api/config/upstashService.ts";
import {toast} from "react-hot-toast";
import useGlobalApi, {useUserInfo} from "../../../config/states/user";
import TabaleExpandedRowRender from "./TabaleExpandedRowRender.tsx";
const {Text } = Typography
import dayjs from "dayjs";
import {useQuery} from "react-query";
import { Form, InputNumber, Select, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";
export default function DetailOrder({ order, onBack  }: any) {
    const {getallorder  } = useGlobalApi();
    const newStoreId = localStorage.getItem("selectedStore");
    const getStepStatus = (orderStatus: any, stepIndex: number) => {
        if (orderStatus === "pending") {
            if (stepIndex === 0) return "finish";
            if (stepIndex === 1) return "process";
            return "wait";
        }
        if (orderStatus === "completed") {
            return "finish";
        }

        if (orderStatus === true) {
            if (stepIndex === 2) return "error";
            return "finish";
        }

        return "wait";
    };
    const [form] = Form.useForm();
    const {id} = useParams();
    const { data: getOrderid } = useQuery(
        ['av.getOrderid', id],
        () => upstashService.getOrderid(id),

    );
    console.log(id)
    const navigate = useNavigate();
    const isDeleted = id ? getOrderid?.order?.isDeleted : order?.isDeleted;
    const orderStatus = id ? getOrderid?.order?.orderStatus : order?.orderStatus;
    const steps = [
        { title: "Đặt hàng" },
        { title: "Đang xử lý" },
        { title: isDeleted ? "Đã hủy" : "Hoàn thành" },
    ].map((step, index) => ({
        ...step,
        status: getStepStatus(isDeleted ? true : orderStatus, index),
    }));

    useEffect(() => {
        if (order?.remainAmount && order?.paymentStatus === "pending") {
            form.setFieldsValue({
                payments: [{
                    amount: order?.remainAmount,
                    paymentMethod: 'cash',
                }],
            });
        }
    }, [order]);

    const handleSteps = async (status : any) => {
        try {
            if (status ==='completed') {
                await upstashService?.putStatusOrder({
                    orderId:id ? id :order?.id,
                    status: status ,
                });
            }else {
                await upstashService.deletOrder({
                    orderId : id ? id :order?.id,
                })
            }
            onBack()
            getallorder({
                page: 1,
                limit: 10000000,
                storeId: newStoreId,
            })
            toast.success("Xuất kho thành công thành công:");
        } catch (e) {
            console.log("Lỗi khi cập nhật trạng thái:", e);
        }
    };
    const handpaymentStatus = async (paymentData) => {
        try {
            await upstashService?.addnewpayment({
                orderId : order.id,
                paymentData:paymentData
            })
            toast.success("Đã cập nhật thanh toán");
            onBack()
            getallorder({
                page: 1,
                limit: 10,
                storeId: newStoreId,
            })
        }catch (e) {
            console.log(e)
        }
    }
    const orderId = id ? getOrderid?.order?.id : order?.id;

    const { data: getNoteByOrder } = useQuery(
        ['av.getNoteByOrder', order?.id, id],
        () => upstashService.getNoteByOrder(orderId),
        {
            enabled: !!orderId,
        }
    );

    const columns = [
        {
            title: 'Mã phiếu chi',
            render: (_: any, __: any, index: number) => `PVN00${index + 1}`,
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethod',
            render: (value: any) => value === 'cash' ? 'Tiền mặt' : 'Chuyển khoản',
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalAmount',
            render: (value: any, record : any) => (
                <span className={record.type === "THU" ? 'text-green-500' : 'text-red-500'}>
                {new Intl.NumberFormat('vi-VN').format(Math.abs(value))}đ
            </span>
            ),
        },
        {
            title:'Cửa hàng',
            dataIndex: ['store' ,'name']
        },
        {
            title: 'Kiểu',
            dataIndex: 'type',
        },
        {
            title: "Trạng thái",
            dataIndex: ["status"],
            key: "status",
            render: (status: string) => (
                <Tag
                    className={`border-0 rounded-full px-4 py-1 ${
                        status === "completed"
                            ? "bg-green-50 text-green-600"
                            : status === "processing"
                                ? "bg-orange-50 text-orange-500"
                                : status === "cancelled"
                                    ? "bg-gray-100 text-gray-500"
                                    : "bg-red-50 text-red-500"
                    }`}
                >
                    {status === "completed"
                        ? "Hoàn thành"
                        : status === "processing"
                            ? "Đang xử lý"
                            : status === "cancelled"
                                ? "Đã huỷ"
                                : "Thất bại"}
                </Tag>
            ),
        },
        {
            title: "Ngày tạo đơn",
            dataIndex: "createAt",
            key: "createAt",
            render: (value: string) => dayjs(value).format("DD/MM/YYYY HH:mm:ss")
        },
    ];
    const discount = id
        ? (getOrderid?.totalAmount ?? 0) * ((getOrderid?.discount ?? 0) / 100)
        : (order?.totalAmount ?? 0) * ((order?.discount ?? 0) / 100);

    const {userInfo} = useUserInfo()
    const paymentStatus = id ? getOrderid?.order?.paymentStatus : order?.paymentStatus;

    return (
        <div className='grid gap-4 '>
            <div className="flex md:flex-row md:items-center justify-between mb-2 border-b pb-2">
                <div className='flex items-center gap-2'>
                    <Button
                        onClick={() => {
                            if (id) {
                                navigate('/custumer')
                            }else {
                                onBack()
                            }
                        }}
                        icon={<ArrowLeftOutlined/>}
                        size="large"
                    />
                    <div className="flex items-center gap-2 mt-1">
                        <span
                            className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">#SON{id ? getOrderid?.order?.id :order?.id}</span>
                    </div>
                </div>
                <div className="mt-4">
                    <Steps
                        className="gap-2"
                        size="small"
                        labelPlacement="vertical"
                        items={steps}
                    />

                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 ">
                <div className="col-span-2 flex flex-col justify-between ">
                    <Card style={{padding: 0}}>
                        <FormCustumer data={id ? getOrderid?.order?.customer : order}/>
                    </Card>
                    <Card style={{padding: 0}}>

                        {paymentStatus !== 'pending' && (
                            <div className="flex items-center">
                                <CheckCircleFilled className="text-green-500 text-lg mr-1" />
                                <Text className="text-base font-medium">Đã thanh toán toàn bộ</Text>
                            </div>
                        )}
                        <div className="bg-gray-50 p-2  rounded-md ">
                            <div className="flex justify-between items-center mb-1">
                                <Text className="font-medium">Khách phải trả: {id  ? getOrderid?.order?.totalAmount.toLocaleString() : order?.totalAmount.toLocaleString()}/VNĐ</Text>

                                <Text className="font-medium">
                                    {order?.paymentStatus==='pending' ? 'Đã thanh toán' :'Đã thanh toán'} :
                                    {(
                                        (id
                                                ? getOrderid?.order?.totalAmount - getOrderid?.order?.remainAmount
                                                : order?.totalAmount - order?.remainAmount
                                        ) || (id ? getOrderid?.order?.totalAmount : order?.totalAmount)
                                    )?.toLocaleString()} / VNĐ
                                </Text>
                                <Text className="font-medium text-red-500">Còn phải trả: {id ? getOrderid?.order?.remainAmount?.toLocaleString() : order?.remainAmount?.toLocaleString() || 0}/VNĐ</Text>

                                {order?.isDeleted !== true && order?.paymentStatus === "pending" && (
                                    <Form
                                        onFinish={async (values) => {
                                            try {
                                                const paymentData = values.payments.map((payment) => ({
                                                    paymentMethod: payment.paymentMethod,
                                                    amount: Number(payment.amount),
                                                }));

                                                await handpaymentStatus(paymentData);
                                            } catch (e) {
                                                console.error(e);
                                                toast.error("Lỗi khi xác nhận thanh toán");
                                            }
                                        }}
                                        form={form}
                                        layout="vertical"
                                    >

                                    <Form.List name="payments">
                                            {(fields, { add, remove }) => (
                                                <>
                                                    {fields.map(({ key, name, ...restField }) => (
                                                        <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'amount']}
                                                                rules={[{ required: true, message: 'Nhập số tiền!' }]}
                                                            >
                                                                <InputNumber
                                                                    placeholder="Số tiền"
                                                                    min={0}
                                                                    formatter={(value) =>
                                                                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                                                    }
                                                                    parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                                                />
                                                            </Form.Item>
                                                            <Form.Item
                                                                {...restField}
                                                                name={[name, 'paymentMethod']}
                                                                rules={[{ required: true, message: 'Chọn hình thức!' }]}
                                                            >
                                                                <Select placeholder="Hình thức">
                                                                    <Select.Option value="cash">Tiền mặt</Select.Option>
                                                                    <Select.Option value="bank">Chuyển khoản</Select.Option>
                                                                </Select>
                                                            </Form.Item>
                                                            <MinusCircleOutlined onClick={() => remove(name)} />
                                                        </Space>
                                                    ))}
                                                    <Form.Item>
                                                        <Button
                                                            type="dashed"
                                                            onClick={() => add()}
                                                            block
                                                            icon={<PlusOutlined />}
                                                        >
                                                            Thêm khoản thanh toán
                                                        </Button>
                                                    </Form.Item>
                                                </>
                                            )}
                                        </Form.List>

                                        <Form.Item>
                                            <Button type="primary" htmlType="submit">
                                                Xác nhận thanh toán và xuất kho
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                )}

                            </div>

                            {order?.paymentArrays?.map((item, index) => (
                                <div key={index} className="  ">
                                    <Text>Đã trả bằng </Text>
                                    <Text>
                                        {item.paymentMethod === 'bank' ? 'chuyển khoản' : 'tiền mặt'}:
                                    </Text>
                                    <Text className=" font-semibold text-green-600">
                                        {Number(item.amount).toLocaleString("vi-VN")}/VNĐ
                                    </Text>
                                </div>
                            ))}


                        </div>
                    </Card>
                </div>
                <div className="col-span-1">
                    <Card title="Thông tin đơn hàng" className="mb-2 ">
                        <div className="space-y-1">
                            <div className="flex justify-between"><Text className="font-medium">Chính sách
                                giá:</Text><Text>Giá bán lẻ</Text></div>
                            <div className="flex justify-between">
                                <Text className="font-medium">Bán tại:</Text>
                                <Text>{id ? getOrderid?.order?.storeInfo?.name : order?.storeInfo?.name}</Text>
                            </div>
                            <div className="flex justify-between"><Text className="font-medium">Bán
                                bởi:</Text><Text>{id ? getOrderid?.order?.creater?.username : order?.creater?.username}</Text></div>
                                {/*<div className="flex justify-between"><Text className="font-medium">Hẹn giao*/}
                                {/*    hàng:</Text><Text>---</Text></div>*/}

                            <div className="flex justify-between"><Text className="font-medium">Ngày bán:</Text>
                                    <Text>
                                        {id
                                            ? moment(getOrderid?.order?.createdAt).format('DD-MM-YYYY HH:mm')
                                            : moment(order?.createdAt).format('DD-MM-YYYY HH:mm')}
                                    </Text>
                            </div>
                        </div>
                    </Card>

                </div>
            </div>
            {(id ? getOrderid?.order.orderStatus : order?.orderStatus) === "completed" && (
                <div className="bg-white rounded-lg shadow-lg">
                    <div className="mt-3 mr-4 pb-2 flex justify-between items-center borderBottom">
                        <div>
                            <h2 className="text-blue-500 px-4 m-0 text-xl font-bold drop-shadow-md">
                                Thông tin phiếu thu/chi
                            </h2>
                        </div>
                    </div>
                    <Table columns={columns} dataSource={getNoteByOrder} />
                </div>
            )}

            <div className="bg-white  rounded-lg shadow-lg">
                <div className=' mt-3 mr-4 pb-2 flex justify-between items-center borderBottom'>
                    <div>
                        <h2 className="text-blue-500 px-4 m-0 text-xl font-bold  drop-shadow-md">
                            Thông tin sản phẩm
                        </h2>
                    </div>
                </div>
                <TabaleExpandedRowRender
                    discount={discount}
                    record={id ? getOrderid?.order : order}
                />
            </div>

            {(id ? getOrderid?.orderId?.isDeleted !== true : order?.isDeleted !== true) && (
                <div className='flex justify-end gap-3 mb-3'>
                    <div>
                        {userInfo?.role === 'admin' && (
                            <Popconfirm
                                title="Bạn có chắc muốn hủy đơn hàng này?"
                                onConfirm={() => handleSteps("cancelled")}
                                okText="Đồng ý"
                                cancelText="Hủy"
                            >
                                <Button
                                    type='dashed'
                                    className='bg-red-500 text-white'
                                >
                                    Hủy đơn hàng
                                </Button>
                            </Popconfirm>
                        )}
                    </div>
                </div>
            )}

        </div>
    )
}
