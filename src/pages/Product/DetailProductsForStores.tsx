import { Form, InputNumber, Select, Button } from 'antd';
import useGlobalApi, {useUserInfo} from "../../config/states/user";
import {useEffect} from "react";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {useQuery} from "react-query";
import upstashService from "../../api/config/upstashService.ts";
import {toast} from "react-hot-toast";

const DetailProductsForStores = ({onBack} : any) => {
    const [form] = Form.useForm();
    const { getStore , shop  , getAllProductShop } = useGlobalApi();
    useEffect(() => {
        getStore()
    }, []);
    const onFinish =async (values) => {
        try {
            await upstashService.posttproducttoinventory(values)
            onBack()
            getAllProductShop()
            toast.success('Nhập sản phẩm thanh công')
        }catch (e){
            console.log(e)
        }
    };
    const { data : product   } = useQuery<any, Error>(
        ['av.allproduct'],
        () => {
            return upstashService.allproduct({
                page : 1,
                limit : 100000000
            })
        })
    return (
        <>
            <Button
                onClick={onBack}
                icon={<ArrowLeftOutlined/>}
                size="large"
            />

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ quantity: 1 }}
            >
                <Form.Item
                    rules={[{ required: true, message: 'Vui lòng chọn cửa hàng' }]}
                    name="storeId"
                    label="Cửa hàng"
                >
                    <Select
                        size="large"
                        placeholder="Chọn cửa hàng"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.children as string).toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {shop?.stores?.map((category: any) => (
                            <Select.Option key={category.id} value={category.id}>
                                {category.name}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Sản phẩm"
                    name="productId"
                    rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}
                >
                    <Select
                        size="large"
                        placeholder="Chọn sản phẩm"
                        showSearch
                        optionFilterProp="children"
                    >
                        {product?.data?.map((product: any) => (
                            <Select.Option key={product.id} value={product.id}>
                                {product.name} ({product?.sku})
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>


                <Form.Item
                    label="Số lượng"
                    name="quantity"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                >
                    <InputNumber
                        size='large'
                        min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Lưu
                    </Button>
                </Form.Item>
            </Form>
        </>

    );
};

export default DetailProductsForStores;
