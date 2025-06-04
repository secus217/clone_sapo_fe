import { Form, Input, Select, Upload, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const FormFund = () => {
    return (
        <>
            <Card className="p-6 shadow-md rounded-xl">
                <h2 className="text-lg font-semibold mb-4">Thông tin chung</h2>
                <Form layout="vertical">
                    <div className="grid grid-cols-2 gap-4">
                        <Form.Item label="Chuyển từ" name="from" rules={[{ required: true }]}>
                            <Select defaultValue="Tiền mặt">
                                <Option value="Tiền mặt">Tiền mặt</Option>
                                <Option value="Tài khoản ngân hàng">Tài khoản ngân hàng</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Chuyển đến" name="to" rules={[{ required: true }]}>
                            <Select defaultValue="Tài khoản ngân hàng">
                                <Option value="Tiền mặt">Tiền mặt</Option>
                                <Option value="Tài khoản ngân hàng">Tài khoản ngân hàng</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Chi nhánh nộp tiền" name="branch" rules={[{ required: true }]}>
                            <Select placeholder="Chọn chi nhánh">
                                <Option value="Chi nhánh 1">Chi nhánh 1</Option>
                                <Option value="Chi nhánh 2">Chi nhánh 2</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Tài khoản nhận tiền" name="account" rules={[{ required: true }]}>
                            <Select placeholder="Chọn tài khoản">
                                <Option value="TK1">TK1</Option>
                                <Option value="TK2">TK2</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <Form.Item label="Giá trị" name="amount" rules={[{ required: true }]}>
                        <Input placeholder="Nhập giá trị" suffix="₫" />
                    </Form.Item>
                    <Form.Item label="Diễn giải" name="description">
                        <Input defaultValue="Chuyển quỹ nội bộ" />
                    </Form.Item>


                </Form>
                <h2 className="text-lg font-semibold mb-4">Ảnh chứng từ</h2>
                <Upload.Dragger maxCount={10} listType="picture-card" beforeUpload={() => false} >
                    <p className="ant-upload-drag-icon">
                        <UploadOutlined className="text-2xl" />
                    </p>
                    <p className="text-gray-600">Kéo thả hoặc <span className="text-blue-500 cursor-pointer">tải ảnh từ thiết bị</span></p>
                    <p className="text-gray-400">(Dung lượng tối đa 2MB/ảnh, hỗ trợ JPEG hoặc PNG. Tối đa 10 ảnh)</p>
                </Upload.Dragger>
            </Card>


        </>
    );
};

export default FormFund;
