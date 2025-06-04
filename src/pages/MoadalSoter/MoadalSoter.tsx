import { useEffect, useState } from "react";
import { Modal, Button, Select, Typography, Space, Divider, Form, Input } from "antd";
import useGlobalApi from "../../config/states/user";
import { useNavigate } from "react-router-dom";
import { JWT_LOCAL_STORAGE_KEY } from "../../config/constant";
import upstashService from "../../api/config/upstashService.ts";

const ModalStore = () => {
    const [modal, setModal] = useState(true);
    const [selectedStore, setSelectedStore] = useState<any>(null);
    const [form] = Form.useForm();
    const { getStore, shop } = useGlobalApi(); // add createStore if available
    const navigate = useNavigate();

    useEffect(() => {
        getStore();
    }, []);

    const handleStoreSelect = (value: any) => {
        setSelectedStore(value);
    };

    const handleOk = async () => {
        if (shop?.stores?.length === 0) {
            const values = await form.validateFields();
            const newStore = await upstashService.postStoredefault({
                ...values
            });
            localStorage.setItem("selectedStore", newStore.id);
        } else {
            localStorage.setItem("selectedStore", selectedStore);
        }
        setModal(false);
        navigate("/");
    };

    const handleCancel = () => {
        setModal(false);
        localStorage.removeItem(JWT_LOCAL_STORAGE_KEY);
        location.href = "/login";
    };

    const noStores = !shop?.stores || shop.stores.length === 0;

    return (
        <Modal
            title="Choose a Store"
            open={modal}
            onCancel={handleCancel}
            footer={null}
            width={400}
            closable={true}
            maskClosable={false}
        >
            <div className="py-4">
                {noStores ? (
                    <>
                        <Typography.Paragraph>
                            Bạn chưa có cửa hàng nào. Vui lòng tạo mới:
                        </Typography.Paragraph>
                        <Form form={form} layout="vertical">
                            <Form.Item
                                label="Tên cửa hàng"
                                name="name"
                                rules={[{ required: true, message: 'Vui lòng nhập tên cửa hàng' }]}
                            >
                                <Input placeholder="Nhập tên cửa hàng" />
                            </Form.Item>
                            <Form.Item
                                label="Địa chỉ"
                                name="address"
                                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                            >
                                <Input placeholder="Nhập địa chỉ" />
                            </Form.Item>
                        </Form>
                    </>
                ) : (
                    <>
                        <Typography.Paragraph>
                            Vui lòng chọn một cửa hàng từ danh sách bên dưới:
                        </Typography.Paragraph>
                        <Select
                            placeholder="Tìm kiếm một cửa hàng"
                            style={{ width: '100%' }}
                            onChange={handleStoreSelect}
                            optionFilterProp="children"
                            showSearch
                            value={selectedStore}
                        >
                            {shop.stores.map((store: any) => (
                                <Select.Option key={store.id} value={store.id}>
                                    <Typography.Text strong>{store.name}</Typography.Text>
                                </Select.Option>
                            ))}
                        </Select>
                    </>
                )}

                <Divider />

                <div className="flex justify-end">
                    <Space>
                        <Button onClick={handleCancel}>
                            Hủy
                        </Button>
                        <Button
                            type="primary"
                            disabled={!noStores && !selectedStore}
                            onClick={handleOk}
                        >
                            Xác nhận
                        </Button>
                    </Space>
                </div>
            </div>
        </Modal>
    );
};

export default ModalStore;
