import {useEffect, useState} from 'react';
import {Form, Select, Input, Button, InputNumber} from 'antd';
import { Check } from "lucide-react";
import { ArrowLeftOutlined } from "@ant-design/icons";
// import ModalBankAccount from "./ModalBankAccount.tsx";
import useGlobalApi, {useUserInfo} from "../../config/states/user";
import upstashService from "../../api/config/upstashService.ts";
import {toast} from "react-hot-toast";

export default function CollectSpend({ type, onback , refetch }: any) {
    const [form] = Form.useForm(); // Khai báo form instance
    const [paymentMethod, setPaymentMethod] = useState<string>('cash');
    const {userInfo} =  useUserInfo()

    // const [modalbank, setModalbank] = useState(false);
    const {getStore, shop} = useGlobalApi();
    useEffect(() => {
        getStore();
    }, []);
    const handlsave = async (values: any) => {
        try {
            await upstashService?.postreceipt({
                ...values,
                storeId: userInfo?.role !== "admin" ? userInfo?.storeId : values?.storeId,
                paymentMethod:paymentMethod,
                type: type === "collect" ? "THU" : "CHI"
            })
            toast?.success(`Tạo phiếu${type === "collect" ? "THU" : "CHI"} thành công`)
            onback()
            refetch()
            form.resetFields()
        }catch(err:any) {
            console.log(err)
            toast.error(err.message)
        }
    };


    return (
        <div>
            <div className='flex gap-3 items-center'>
                <Button
                    onClick={onback}
                    icon={<ArrowLeftOutlined />}
                    size="large"
                />
                <h2 className="text-xl font-medium mb-4">
                    Tạo {type === "collect" ? "phiếu thu" : "phiếu chi"}
                </h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex gap-7 borderBottom pb-3 mb-3">
                    {["cash", "bank"].map((method) => (
                        <div key={method} className="relative">
                            <Button
                                onClick={() => {
                                    setPaymentMethod(method);
                                    form.setFieldsValue({ paymentMethod: method });
                                }}
                                className={`flex items-center justify-start gap-3 py-2 px-8 rounded-md h-auto border-2 ${
                                    paymentMethod === method
                                        ? "bg-blue-50 border-blue-500 text-blue-700"
                                        : "bg-white border-gray-200"
                                }`}
                            >
                                <span className="text-base font-medium">
                                    {method === "cash" ? "Tiền mặt" : "Tài khoản ngân hàng"}
                                </span>
                            </Button>

                            <div
                                className={`absolute left-[-10px] top-[22%] -translate-y-1/2 -translate-x-1/3 w-6 h-6 rounded-full flex items-center justify-center ${
                                    paymentMethod === method
                                        ? "bg-blue-500 text-white"
                                        : "bg-[#F9F9F9] border-2 border-gray-300"
                                }`}
                            >
                                {paymentMethod === method && <Check className="h-4 w-4" />}
                            </div>
                        </div>
                    ))}
                </div>

                <Form
                    form={form} // Gán form vào Ant Design Form
                    onFinish={handlsave} // Hàm xử lý khi submit
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    layout="vertical"
                >
                    <Form.Item name="storeId" label="Chi nhánh">
                        <Select
                            placeholder="Chọn chi nhánh"
                            defaultValue={userInfo?.role !== "admin" ? userInfo?.storeId : undefined}
                            disabled={userInfo?.role !== "admin"}
                        >
                            {shop?.stores?.map((branch: any) => (
                                <Select.Option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>


                    <Form.Item
                        name="totalAmount" label="Giá trị">
                        <InputNumber
                            className='w-full'
                            placeholder="Nhập giá trị" suffix="đ" />
                    </Form.Item>

                    {/*<Form.Item*/}
                    {/*    name='object'*/}
                    {/*    label='Sự vật'*/}
                    {/*>*/}
                    {/*    <Input*/}
                    {/*        placeholder='Nhập Sự vật'*/}
                    {/*    />*/}
                    {/*</Form.Item>*/}
                    <Form.Item
                        name='nameOfCustomer'
                        label='Tên Khách Hàng'
                    >
                        <Input
                            placeholder='Nhập Tên Khách Hàng'
                        />
                    </Form.Item>
                    <Form.Item
                        name='typeOfNote'
                        label='Loại phiếu thu/chi'
                    >
                        <Input
                            placeholder='Nhập Loại phiếu thu/chi'
                        />
                    </Form.Item>
                    <Form.Item name="note" className="col-span-2" label="Diễn giải">
                        <Input.TextArea placeholder="Nhập diễn giải" rows={3} />
                    </Form.Item>

                    <div className="flex justify-end col-span-2">
                        <Button htmlType="submit" type="primary">
                            {type === "collect" ? "Tạo phiếu thu" : "Tạo phiếu chi"}
                        </Button>
                    </div>
                </Form>
            </div>

            {/*<ModalBankAccount open={modalbank} onCancel={() => setModalbank(false)} />*/}
        </div>
    );
}
