import { Select, Input, Button, Table, Card, Typography, InputNumber } from "antd"
import { SaveOutlined, ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import useGlobalApi, { useUserInfo } from "../../config/states/user"
import { useEffect, useState } from "react"
import FilterProducts from "../Order/CreateOrder/FilterProducts.tsx"
import upstashService from "../../api/config/upstashService.ts"
import { toast } from "react-hot-toast"
import {useQuery} from "react-query";

const { TextArea } = Input
const { Option } = Select
const { Title } = Typography

interface DataType {
    id: string
    productCode: string
    productName: string
    canTransfer: boolean
    quantity: number
    error: string
}

interface OrderItem extends DataType {
    numbertransfers: number
}

export default function CreateTicket({ onback, refetch, setActiveTab }: any) {
    const { getStore, shop } = useGlobalApi()
    const { userInfo } = useUserInfo()

    const [listOrders, setListOrders] = useState<OrderItem[]>([])
    const [store, setStore] = useState<any>({
        fromStoreId: userInfo?.storeId || 0,
        toStoreId: 0,
    })
    const [note, setNotes] = useState('')

    useEffect(() => {
        getStore()
    }, [])
    const { data : products } = useQuery<any, Error>(
        ['av.getAllProductShop' , store.fromStoreId],
        () => {
            return upstashService.getallProductShop({
                storeId : store?.fromStoreId
            })
        })

    // useEffect(() => {
    //     console.log(store?.fromStoreId)
    //     if (store?.fromStoreId) {
    //         getAllProductShop(store?.fromStoreId)
    //     }
    // }, [store?.fromStoreId])
    //


    const columns: ColumnsType<OrderItem> = [
        {
            title: "Mã vạch SP",
            dataIndex: ["product" , 'sku'],
            key: ["product" , 'sku'],
            width: "15%",
        },
        {
            title: "Tên SP",
            dataIndex: ["product", "name"],
            key: "name",
            width: "30%",
        },
        {
            title: "Có thể chuyển",
            dataIndex: "quantity",
            key: "quantity",
            width: "25%",
        },
        {
            title: "Số lượng chuyển",
            width: "20%",
            render: (_, record: OrderItem) => (
                <div className="flex items-center">
                    <InputNumber
                        className="w-full"
                        min={1}
                        value={record.numbertransfers}
                        onChange={(value: number | null) => {
                            setListOrders((prevOrders) =>
                                prevOrders.map((order) =>
                                    order.id === record.id
                                        ? { ...order, numbertransfers: value || 0 }
                                        : order
                                )
                            )
                        }}
                    />
                </div>
            ),
        },
        {
            key: "action",
            width: "10%",
            render: (_: any, record: OrderItem) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    className="flex items-center justify-center"
                    onClick={() => {
                        setListOrders((prevOrders) =>
                            prevOrders.filter((order) => order.id !== record.id)
                        )
                    }}
                />
            ),
        },
    ]

    const handSave = async () => {
        if (!store?.fromStoreId || !store?.toStoreId) {
            toast.error("Vui lòng chọn cả 'Từ kho' và 'Đến kho'")
            return
        }

        if (store?.fromStoreId === store?.toStoreId) {
            toast.error("Kho nguồn và kho đích không được trùng nhau!")
            return
        }

        for (const item of listOrders) {
            if (item.numbertransfers > item.quantity) {
                toast.error(`Số lượng chuyển của sản phẩm "${item.productName}" vượt quá số lượng có thể chuyển!`)
                return
            }
        }
        console.log('listOrders' , listOrders)
        const products: any = listOrders.map((item: any) => ({
            productId: item?.productId,
            quantity: item?.numbertransfers
        }))

        try {
            await upstashService?.postCreateExportNote({
                fromStoreId: store?.fromStoreId,
                toStoreId: store?.toStoreId,
                note: note,
                product: products
            })
            toast.success('Chuyển kho thành công')
            onback()
            setActiveTab("2")
            refetch()
        } catch (e: any) {
            toast.error(e.message)
        }
    }

    return (
        <div>
            <div className="mb-4 gap-3 flex items-center">
                <Button onClick={onback} icon={<ArrowLeftOutlined />} size="large" />
                <Title style={{ margin: 0 }} level={3}>
                    Tạo phiếu chuyển kho
                </Title>
            </div>

            <div className="mb-4">
                <Card
                    title={
                        <div className="flex items-center">
                            <span className="mr-2">📦</span>
                            <span>Kho hàng</span>
                        </div>
                    }
                    bordered={true}
                    className="shadow-sm"
                >
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <label className="mb-1">Từ kho</label>
                            <Select
                                value={store?.fromStoreId || undefined}
                                disabled={userInfo?.role !== "admin"}
                                className="w-full"
                                suffixIcon={<span>▼</span>}
                                onChange={(value) => {
                                    setStore({
                                        fromStoreId: value,
                                        toStoreId: 0, // Reset "Đến kho"
                                    })
                                    setNotes('') // Reset ghi chú
                                    setListOrders([]) // Reset danh sách sản phẩm đã chọn
                                }}
                            >
                                {shop?.stores?.map((item: any) => (
                                    <Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1">Đến kho</label>
                            <Select
                                className="w-full"
                                suffixIcon={<span>▼</span>}
                                onChange={(value) =>
                                    setStore((prev: any) => ({ ...prev, toStoreId: value }))
                                }
                                value={store?.toStoreId || undefined}
                            >
                                {shop?.stores
                                    ?.filter((item: any) => item.id !== store?.fromStoreId)
                                    .map((item: any) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                            </Select>
                        </div>

                        <div className="flex flex-col">
                            <label className="mb-1">Ghi chú:</label>
                            <TextArea
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                value={note}
                            />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="bg-white p-4 border rounded-md shadow-sm mb-4">
                {(userInfo?.storeId || store?.fromStoreId) ? (
                    <>
                        <div className="flex justify-between mb-4">
                            <FilterProducts
                                store={store?.fromStoreId}
                                products={products}
                                listOrders={listOrders}
                                setListOrders={setListOrders}
                            />
                        </div>
                        <Table
                            columns={columns}
                            dataSource={listOrders}
                            pagination={false}
                            bordered
                            size="middle"
                            className="mb-4"
                            rowKey="id"
                        />
                    </>
                ) : null}
            </div>

            <div className="flex justify-end">
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handSave}
                    className="bg-green-600 hover:bg-green-700"
                >
                    Lưu
                </Button>
            </div>
        </div>
    )
}
