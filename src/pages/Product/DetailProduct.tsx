import {useEffect, useState} from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import {Input, Form, Typography, Button, InputNumber, message, Select} from "antd";
import RichTextEditor from "../../components/RichTextEditor.tsx";
import upstashService from "../../api/config/upstashService.ts";
import useGlobalApi, {useUserInfo} from "../../config/states/user";
import UploadImg from "../../components/UploadImg.tsx";
import {toast} from "react-hot-toast";
import {useParams} from "react-router-dom";

const { Title } = Typography;

export default function DetailProduct({onback , data , detailProducts , setData , refetch}: any) {
    const [form] = Form.useForm(); // Tạo instance của form
    const [editorValue, setEditorValue] = useState("");
    const idshop:any = localStorage.getItem("selectedStore");
    const {userInfo} = useUserInfo()
    const { getCategoryProduct , categoryProduct , getStore  , getAllProductShop } = useGlobalApi();
    const [urlimg, setUrlimg] = useState<string[]>([]);
    const {id} = useParams()
    useEffect(() => {
        getCategoryProduct({
            page: 1,
            limit:10000
        })
        getStore()
    }, []);
    useEffect(() => {
        if (data && detailProducts) {
            form.setFieldsValue({
                name: data?.name,
                categoryId: data?.category?.id,
                sku: data?.sku,
                retailPrice: data?.retailPrice,
                importPrice: data?.importPrice,
            });
            setEditorValue(data?.description || "");
            setUrlimg(
                data?.imageUrls
                    ? data.imageUrls.split(",").map((url) => ({
                        url,
                        fileName: url.split("/").pop() || "image",
                    }))
                    : []
            );


        }else {
            form.resetFields()
            setEditorValue("");
            setUrlimg([])
        }
    }, [data , detailProducts]);

    const handleSave = async () => {
        try {

            const values = await form.validateFields();
            const payload = {
                name : values.name,
                description: editorValue,
                sku: values.sku,
                retailPrice : values.retailPrice,
                importPrice: values.importPrice,
                isActive: true,
                categoryId : values.categoryId,
                imageUrls:urlimg.map((img: any) => img.url).join(","),
            };
            if (data) {
                await upstashService.putproduct({
                    data :{
                        ...payload
                    },
                    productId : data?.id
                });
            }else {
                await upstashService.postproduct(payload)
            }
                setEditorValue("");
                setUrlimg([]);
                onback()
                message.success(data ? "Sửa sản phẩm thành công!" : 'Thêm sản phẩm thành công!');
                refetch()
                form.resetFields();
        } catch (error: any) {
            toast.error(error.message);
            console.error( error?.message);
        }
    };
    const handdelete = async () => {
        try {
            await  upstashService.deleteproduct(data?.id)
            toast.success('Xoá sản phẩm thành công')
            onback()
            getAllProductShop(idshop)
            form.resetFields();
            setEditorValue("");
            setUrlimg([]);
        }catch (error: any) {
            toast.error(error.message);
            console.error( error?.message);
        }
    }
    return (
        <>

            <div className="mb-4 gap-3 flex items-center">
                <Button onClick={() => {
                    onback()
                    setData(undefined)
                    form.resetFields();
                    setEditorValue("");
                    setUrlimg([]);

                }} icon={<ArrowLeftOutlined />} size="large" />
                <Title style={{ margin: '0' }} level={3}>{data ? data?.name : 'Thêm sản phẩm'}</Title>
            </div>
            <div className="p-4 rounded-md mx-auto bg-white">
                <Title style={{ margin: '0' }} level={5}>Thông tin sản phẩm</Title>
                <Form
                    form={form} // Gắn form vào instance
                    className="grid grid-cols-1 md:grid-cols-3 gap-3"
                    layout="vertical"
                    disabled={userInfo?.role === 'staff'}
                >
                    <Form.Item
                        label="Tên sản phẩm"
                        name="name"
                        className="mb-6"
                        rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
                    >
                        <Input
                            placeholder='Nhập tên sản phẩm'
                            size="large" />
                    </Form.Item>

                    <Form.Item name="categoryId" label="Loại">
                        <Select size="large" placeholder="Chọn loại">
                            {categoryProduct?.data?.map((category: any) => (
                                <Select.Option key={category.id} value={category.id}>
                                    {category.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="Mã hàng" name="sku">
                        <Input
                            placeholder='Nhập mã hàng'
                            size="large" />
                    </Form.Item>

                    <Form.Item label="Giá bán lẻ" name="retailPrice">
                        <InputNumber size="large" className="w-full" placeholder="Nhập giá bán" />
                    </Form.Item>

                    <Form.Item label="Giá nhập" name="importPrice">
                        <InputNumber size="large" className="w-full" placeholder="Nhập giá vốn" />
                    </Form.Item>
                    <Form.Item label="Hình ảnh" className="col-span-3">
                        <UploadImg
                            urlimg={urlimg}
                            setUrlimg={setUrlimg}
                        />
                    </Form.Item>

                    <Form.Item label="Mô tả" className="md:col-span-3">
                        <RichTextEditor value={editorValue} setValue={setEditorValue}   disabled={userInfo?.role === 'staff'} />
                    </Form.Item>
                </Form>

                {!id && (
                    <div className="flex justify-end gap-3">
                        {userInfo?.role === 'admin' &&  (
                            <>
                                {data && (
                                    <Button type='dashed' onClick={handdelete}>
                                        Xóa sản phẩm
                                    </Button>
                                )}
                                <Button type="primary" onClick={handleSave}>
                                    {data ? 'Cập nhật':'Lưu'}
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
