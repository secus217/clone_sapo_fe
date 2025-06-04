import {Select, Avatar, Empty, Button} from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import ModalClientOrder from "../CreateOrder/ModalClientOrder.tsx";
import FormCustumer from "../../../components/FormCustumer.tsx";
import useGlobalApi from "../../../config/states/user";

const { Option } = Select;

const ClientOrder = ({ serinformationUer }: any) => {
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const { getUser, user } = useGlobalApi();
    useEffect(() => {
        getUser({ page: 1, limit: 10 });
    }, []);

    const handleChange = (value: any) => {
        const customer = user?.data?.find((c: any) => c.username === value);
        setSelectedCustomer(customer || null);
        serinformationUer(customer?.id || null);
    };

    const handleCustomerAdded = (newCustomer: any) => {
        setSelectedCustomer(newCustomer);
        serinformationUer(newCustomer.id);
        setModalVisible(false);
        getUser({ page: 1, limit: 10 });
    };

    return (
        <div>
            <Select
                allowClear
                showSearch
                style={{ width: "100%", marginBottom: 16 }}
                placeholder="Tìm theo tên, SDT, mã khách hàng..."
                optionFilterProp="title"
                onChange={handleChange}
                filterOption={(input: any, option: any) =>
                    option?.title?.toLowerCase().includes(input.toLowerCase())
                }
                value={
                    selectedCustomer
                        ? `${selectedCustomer.username} - ${selectedCustomer.phone}`
                        : undefined
                }
                dropdownRender={(menu) => (
                    <div>
                        <div className="flex justify-center p-2">
                            <Button type="link" onClick={() => setModalVisible(true)}>
                                + Thêm khách hàng
                            </Button>
                        </div>
                        {menu}
                    </div>
                )}
            >
                {user?.data?.map((customer: any) => (
                    <Option
                        key={customer.id}
                        value={customer.username}
                        title={`${customer.username} ${customer.phone}`}
                    >
                        <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                        {customer.username} <b>{customer.phone}</b>
                    </Option>
                ))}
            </Select>


            {selectedCustomer ? (
                <FormCustumer data={selectedCustomer}/>
            ) : (
                <Empty description="Chưa có thông tin khách hàng"/>
            )}

            <ModalClientOrder
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onCustomerAdded={handleCustomerAdded}
            />
        </div>
    );
};

export default ClientOrder;
