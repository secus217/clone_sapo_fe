import { Modal, Input, Button , Popconfirm } from "antd";
import { useEffect, useState } from "react";
import upstashService from "../../../api/config/upstashService.ts";
import {toast} from "react-hot-toast";
import {useUserInfo} from "../../../config/states/user"; // Đảm bảo import axiosClient đúng

const ProductModal = ({ visible, onClose, product  , refetch}: any) => {
    const [formData, setFormData] = useState({ name: "", description: "" });
    const {userInfo} = useUserInfo()

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                description: product.description || "",
            });
        } else {
            setFormData({ name: "", description: "" });
        }
    }, [product]);


    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSave = async () => {
        try {
            if (product?.id) {
                await upstashService.pustcategoryProduct({
                    id: product.id,
                    data: formData,
                });
                toast.success("Cập nhật loại sản phẩm thành công!");
            } else {
                await upstashService.postcategoryProduct(formData);
                toast.success("Thêm loại sản phẩm mới thành công!");
            }
            refetch();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Có lỗi xảy ra!");
        }
    };

    const handleDelete = async () => {
        try {
           const res = await upstashService?.deletecategoryProduct({ id: product.id });
           if (res?.success === true) {
               toast.success("Xóa loại sản phẩm thành công!");
           }else {
               toast.error(res?.message);
           }
            onClose();
            refetch();

        } catch (error) {
            console.log(error);
            toast.error("Có lỗi xảy ra khi xóa!");
        }
    };


    return (
        <Modal
            title={product ? "Chỉnh sửa loại sản phẩm" : "Thêm loại sản phẩm"}
            open={visible}
            onCancel={onClose}
            footer={[
                userInfo?.role === "admin" && product && ( // Kiểm tra nếu là admin
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa sản phẩm này không?"
                        onConfirm={handleDelete}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button key="delete" danger>
                            Xóa
                        </Button>
                    </Popconfirm>
                ),

                <Button key="save" type="primary" onClick={handleSave}>
                    {product ? "Lưu" : "Thêm mới"}
                </Button>,
            ].filter(Boolean)}
        >
            <label>Tên loại sản phẩm:</label>
            <Input name="name" value={formData.name} onChange={handleChange} />

            <label style={{ marginTop: 10 }}>Mô tả:</label>
            <Input.TextArea name="description" value={formData.description} onChange={handleChange} />
        </Modal>
    );
};

export default ProductModal;
