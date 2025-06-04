import { useEffect, useState } from "react";
import axios from "axios";
import { Input, Select, Form, Modal } from "antd";

const { Option } = Select;

const ModalBankAccount = ({ open, onCancel }: any) => {
    const [banks, setBanks] = useState<{ code: string; name: string; logo: string }[]>([]);

    useEffect(() => {
        if (open) {
            axios
                .get("https://api.vietqr.io/v2/banks")
                .then((res) => setBanks(res.data.data))
                .catch((err) => console.error(err));
        }
    }, [open]);

    return (
        <Modal
            width={600}
            title="Thêm tài khoản ngân hàng"
            open={open}
            onCancel={onCancel}
            okText='Lưu'
            cancelText='Huỷ'
        >
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4" layout="vertical">
                <div>
                    <Form.Item
                        label={
                            <span className="font-medium">
                              Ngân hàng thụ hưởng
                             </span>
                        }
                        name="bank"
                    >
                        <Select className="w-full" placeholder="Chọn ngân hàng thụ hưởng">
                            {banks.map((bank) => (
                                <Option key={bank.code} value={bank.code}>
                                    <div className="flex items-center gap-2">
                                        <img src={bank.logo} alt={bank.name} className="w-12 h-12 object-contain" />
                                        <span>{bank.name}</span>
                                    </div>
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>
                <div>
                    <Form.Item
                        label={
                            <span className="font-medium">
                                 Số tài khoản
                            </span>
                        }
                        name="accountNumber"
                    >
                        <Input placeholder="Nhập số tài khoản thụ hưởng" />
                    </Form.Item>
                </div>
                <div>
                    <Form.Item
                        label={
                            <span className="font-medium">
                                 Tên chủ tài khoản
                         </span>
                        }
                        name="accountHolder"
                    >
                        <Input placeholder="Nhập tên chủ tài khoản" />
                    </Form.Item>
                </div>
                <div>
                    <Form.Item label={<span className="font-medium">Ghi chú</span>} name="note">
                        <Input placeholder="Nhập ghi chú" />
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};

export default ModalBankAccount;
