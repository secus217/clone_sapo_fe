import { Input, Button, Select, InputNumber } from "antd";
import {
    DeleteOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import TableOrder from "./TableOrder.tsx";
import upstashService from "../../../api/config/upstashService.ts";
import { toast } from "react-hot-toast";
import useGlobalApi from "../../../config/states/user";
import { useNavigate } from "react-router-dom";

export default function OrderPage({ listOrders, setListOrders, informationUer }: any) {
    const [discount, setDiscount] = useState(0);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
    const { getallorder } = useGlobalApi();
    const navigate = useNavigate();
    const storedStoreId = localStorage.getItem("selectedStore");
    const storeId = localStorage.getItem("selectedStore");

    const totalAmount = listOrders?.reduce(
        (total: number, order: any) =>
            total + (order?.product?.retailPrice * (order?.salesquantity || 1)),
        0
    ) || 0;

    const discountAmount = totalAmount * (discount / 100);
    const totalAfterDiscount = totalAmount - discountAmount;

    useEffect(() => {
        setPaymentMethods((prev) => {
            if (!prev.length) {
                return [{
                    paymentMethod: "cash",
                    amount: totalAfterDiscount,
                }];
            }

            const updated = [...prev];
            updated[0].amount = totalAfterDiscount;
            return updated;
        });
    }, [totalAfterDiscount]);

    const totalPaid = paymentMethods.reduce(
        (sum: number, pm: any) => sum + pm.amount,
        0
    );

    const remainingAmount = totalAfterDiscount - totalPaid;

    const addPaymentMethod = () => {
        setPaymentMethods([...paymentMethods, { paymentMethod: "", amount: 0 }]);
    };

    const updatePaymentMethod = (index: number, key: string, value: any) => {
        const updatedMethods = [...paymentMethods];
        updatedMethods[index][key] = value;
        setPaymentMethods(updatedMethods);
    };

    const removePaymentMethod = (index: number) => {
        setPaymentMethods(paymentMethods.filter((_, i) => i !== index));
    };

    const summaryItems = [
        {
            label: `Tổng tiền (${listOrders.length} sản phẩm)`,
            value: <div>{totalAmount.toLocaleString()}₫</div>,
        },
        {
            label: "Chiết khấu (F6)",
            value: (
                <div className="flex items-center gap-2">
                    <InputNumber
                        style={{ borderBottom: "1px solid gray", borderRadius: 0 }}
                        bordered={false}
                        min={0}
                        max={100}
                        value={discount}
                        onChange={(value) => setDiscount(value || 0)}
                        className="text-right w-36"
                        formatter={(value) => `${value}%`}
                        parser={(value) => value?.replace("%", "") || "0"}
                    />
                </div>
            ),
        },
        ...paymentMethods.map((pm: any, index) => ([{
            label: (
                <div className="flex gap-3">
                    <Button danger icon={<DeleteOutlined />} onClick={() => removePaymentMethod(index)} />
                    <Select
                        bordered={false}
                        className="w-40"
                        placeholder="Chọn phương thức"
                        value={pm.paymentMethod}
                        onChange={(value) => updatePaymentMethod(index, "paymentMethod", value)}
                        options={[
                            { value: "bank", label: "Chuyển khoản" },
                            { value: "cash", label: "Tiền mặt" },
                        ]}
                    />
                </div>
            ),
            value: (
                <InputNumber
                    bordered={false}
                    style={{ borderBottom: "1px solid gray", borderRadius: 0 }}
                    min={0}
                    className="w-24"
                    value={pm.amount}
                    onChange={(value) => updatePaymentMethod(index, "amount", value || 0)}
                />
            ),
        }])).flat(),
        {
            label: (
                <Button style={{ border: 'none', boxShadow: "none" }} icon={<PlusCircleOutlined />} onClick={addPaymentMethod}>
                    Thêm phương thức
                </Button>
            ),
            value: '',
        },
        {
            label: "Tổng chiết khấu",
            value: <div>{discountAmount.toLocaleString()}₫</div>,
        },
        {
            label: "Khách phải trả",
            value: <div>{totalAfterDiscount.toLocaleString()}₫</div>,
            isBold: true,
            dividerBefore: true,
        },
        {
            label: "Còn phải trả",
            value: <div>{remainingAmount.toLocaleString()}₫</div>,
            isBold: true,
        },
    ];

    const handSaveOrder = async () => {
        try {
            if (!Array.isArray(listOrders) || listOrders.length === 0) {
                toast.error("Danh sách đơn hàng trống!");
                return;
            }

            const items = listOrders.map(order => ({
                productId: order?.product?.id,
                quantity: order.salesquantity ?? 1,
                unitPrice: order?.product?.retailPrice
            }));

            await upstashService.postOrder({
                fromStoreId: Number(storeId),
                customerId: Number(informationUer),
                items,
                paymentData: paymentMethods,
                discount: discount
            });

            toast.success("Tạo đơn hàng thành công");
            navigate('/orderList');
            getallorder({
                page: 1,
                limit: 10,
                storeId: storedStoreId,
            });

        } catch (error: any) {
            console.log(error);
            toast.error(error?.message);
        }
    };

    return (
        <div className="p-4">
            <TableOrder
                setListOrders={setListOrders}
                listOrders={listOrders}
            />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-[300px]">
                <div className="space-y-4">
                    <div>
                        <Input placeholder="Nhập ký tự và ấn enter" />
                    </div>
                    <div>
                        <span className="block text-gray-600 text-sm mb-1">Ghi chú đơn hàng</span>
                        <TextArea rows={4} placeholder="VD: Hàng tặng gói riêng" defaultValue="VD: Hàng tặng gói riêng" />
                    </div>
                </div>
                <div>
                    {summaryItems.map((item: any, index) => (
                        <div key={index}>
                            {item.dividerBefore && <div className="border-t border-gray-200 my-3"></div>}
                            <div className="flex justify-between items-center py-1">
                                <span className={item.isBold ? "font-bold text-sm" : ""}>{item.label}</span>
                                <span className={item.isBold ? "font-bold" : ""}>
                                    {typeof item.value === "string" || typeof item.value === "number"
                                        ? item.value
                                        : <>{item.value}</>}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-center mt-4">
                <Button onClick={handSaveOrder} type="primary">
                    Tạo đơn hàng
                </Button>
            </div>
        </div>
    );
}
