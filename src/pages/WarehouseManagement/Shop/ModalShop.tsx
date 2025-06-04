import { Modal, Form, Input, Button } from "antd";
import upstashService from "../../../api/config/upstashService.ts";
import {toast} from "react-hot-toast";
import useGlobalApi from "../../../config/states/user";
const ModalShop = ({ open, onClose }: any) => {
    const [form] = Form.useForm();
    const {getStore } =useGlobalApi()

    const handleOk = async () => {
        try {
            const values = form.getFieldsValue();
            await  upstashService.postStore({
                ...values
            })
            toast.success("Thêm cửa hàng thành công")
            onClose()
            getStore()
        }catch (err) {
            console.log(err);
        }

    };


    return (
        <Modal
            title="Thêm cửa hàng"
            open={open}
            onCancel={onClose}
            onOk={handleOk}
            footer={[
                <Button key="cancel" onClick={onClose}>
                    Đóng
                </Button>,
                <Button key="submit" type="primary" onClick={handleOk}>
                    Xác nhận
                </Button>,
            ]}
        >
            <Form
                form={form}
                layout="vertical"

            >
                <Form.Item
                    label="Tên cửa hàng"
                    name="name"
                    rules={[{ required: true, message: "Please enter shop name!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: "Please enter address!" }]}
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalShop;
