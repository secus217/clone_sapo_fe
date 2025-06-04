import {
    Card,
    Row,
    Col,
    Form,
    Input,
    Select,
    InputNumber,
    Button, Tag,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import moment from "moment/moment";
import useGlobalApi from "../../config/states/user";
import upstashService from "../../api/config/upstashService.ts";
import {toast} from "react-hot-toast";

const DetailsAdventure = ({ onback, data  ,refetch}: any) => {
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const { getStore, shop } = useGlobalApi();
    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                cuahang: data.storeId,
                tuNguoiNop: data.nameOfCustomer,
                loaiPhieu:  data?.typeOfNote === "string" ? "Tự tạo" : 'Tự động',
                maPhieu: 'PVN00' + data.id,
            });

            form2.setFieldsValue({
                giaTri: data.totalAmount,
                hinhThuc: data.paymentMethod,
            });
        }
        getStore()
    }, [data, form, form2]);
    const handdelete =async () => {
        try {
            await upstashService.deletereceiptnote({
                receipNoteId: data.id,
            })
            toast.success('Huỷ phiếu thành công')
            refetch()
            onback()
        }catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra!");
        }
    }


    return (
        <div style={{ padding: 24 }}>
            <div className="mb-3">
                <Button onClick={onback} icon={<ArrowLeftOutlined />} size="large" />
            </div>

            <Row gutter={16}>
                <Col span={16}>
                    <Card title="Thông tin chung" style={{ marginBottom: 16 }}>
                        <Form layout="vertical" form={form}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Cửa hàng" name="cuahang">
                                        <Select
                                            disabled={true}
                                            placeholder="Chọn cửa hàng"
                                        >
                                            {shop?.stores?.map((category: any) => (
                                                <Select.Option key={category.id} value={category.id}>
                                                    {category.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>


                                {/*<Col span={12}>*/}
                                {/*    <Form.Item*/}
                                {/*        label={`Từ người ${data?.type === "THU" ? 'nộp' : 'nhận'}`}*/}
                                {/*        name="tuNguoiNop"*/}
                                {/*    >*/}
                                {/*        <Input disabled />*/}
                                {/*    </Form.Item>*/}
                                {/*</Col>*/}
                                <Col span={12}>
                                    <Form.Item
                                        label={`Người nộp/nhận`}
                                        name="tuNguoiNop"
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>


                                <Col span={12}>
                                    <Form.Item label={`Kiểu phiếu  ${data?.type === "THU" ? 'thu' : 'chi'}`} name="loaiPhieu">
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Mã phiếu" name="maPhieu">
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                    <Card title="Giá trị ghi nhận">
                        <Form layout="vertical" form={form2}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Giá trị" name="giaTri">
                                        <InputNumber disabled style={{ width: "100%" }} />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item label="Hình thức thanh toán" name="hinhThuc">
                                        <Input disabled />
                                    </Form.Item>
                                </Col>

                            </Row>
                        </Form>
                    </Card>
                </Col>

                <Col span={8}>
                    <Card title="Thông tin hệ thống" style={{marginBottom: 16}}>
                        <div
                            className='flex justify-end'
                        >
                            <Tag
                                className={`border-0 rounded-full px-4 py-1 ${
                                    data?.status === "completed"
                                        ? "bg-green-50 text-green-600"
                                        : data?.status === "processing"
                                            ? "bg-orange-50 text-orange-500"
                                            : data?.status === "cancelled"
                                                ? "bg-gray-100 text-gray-500"
                                                : "bg-red-50 text-red-500"
                                }`}
                            >
                                {data?.status === "completed"
                                    ? "Hoàn thành"
                                    : data?.status === "processing"
                                        ? "Đang xử lý"
                                        : data?.status === "cancelled"
                                            ? "Đã huỷ"
                                            : "Thất bại"}
                            </Tag>
                        </div>

                        <p><strong>Ghi chú:</strong> {data?.note || '...'}</p>
                        {data?.orderId && (
                            <p><strong>Mã chứng từ:</strong>SON{data?.orderId || '...'}</p>
                        )}
                        {/*<p><strong>Loại ghi chú:</strong> {data?.typeOfNote || '...'}</p>*/}
                        {/*<p><strong>Tên khách hàng:</strong> {data?.nameOfCustomer || '...'}</p>*/}
                        <p><strong>Người tạo:</strong> {data?.creater?.username ||'Không tim thấy'}</p>
                        <p><strong>Loại phiếu thu/chi: </strong> {data?.type}</p>
                        <p><strong>Ngày ghi nhận:</strong> {moment(data?.createdAt).format('DD-MM-YYYY HH:mm')}</p>
                        <p><strong>Ngày cập nhật:</strong> {moment(data?.updatedAt).format('DD-MM-YYYY HH:mm')}</p>
                    </Card>
                    {data?.typeOfNote !== "auto" && (
                        <div
                            className='flex justify-end'
                        >
                            <Button
                                onClick={handdelete}
                                key="delete" danger>
                                Hủy Phiếu
                            </Button>
                        </div>
                    )}

                </Col>
            </Row>
        </div>
    );
};

export default DetailsAdventure;
