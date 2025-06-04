import { Form, Input, Select, Button } from 'antd';
import { useNavigate, useParams } from "react-router-dom";
import { getListDistrictsOf, getListWardsOf } from "../../../config/utils/Index.ts";
import VIET_NAME_LOCATION from '../../../data/vietnam-location.json';
import { useEffect, useState } from "react";
import upstashService from "../../../api/config/upstashService.ts";
import { toast } from "react-hot-toast";
import { ArrowLeftOutlined } from "@ant-design/icons";
import useGlobalApi from "../../../config/states/user";

const CustomForm = ({ form, onCancel, data, refetch, path = false, onCustomerAdded }: any) => {
    const navigate = useNavigate();
    const [listDistrict, setListDistrict] = useState<any>([]);
    const [listWard, setListWard] = useState<any>([]);
    const { id } = useParams();

    useEffect(() => {
        const initForm = async () => {
            if (data) {
                const values: any = {
                    username: data.username,
                    phone: data.phone,
                };

                if (data.address) {
                    const [provinceCodeStr, districtCodeStr, wardCodeStr, addressDetail] = data.address
                        .split(',')
                        .map((item) => item.trim());

                    const provinceCode = Number(provinceCodeStr);
                    const districtCode = Number(districtCodeStr);
                    const wardCode = Number(wardCodeStr);
                    console.log(provinceCode , districtCode , wardCode)
                    // Lấy province
                    const province = VIET_NAME_LOCATION.find((p) => p.code === provinceCode);

                    // Lấy districts từ province
                    const districts = province?.districts || [];

                    // Lấy district theo districtCode
                    const district = districts.find((d) => d.code === districtCode);

                    // Lấy wards từ district
                    const wards = district?.wards || [];

                    // Lấy ward theo wardCode
                    const ward = wards.find((w) => w.code === wardCode);

                    // Cập nhật danh sách dropdown
                    setListDistrict(districts);
                    setListWard(wards);

                    // Set giá trị form
                    values.provinceCode = provinceCode;
                    values.districtCode = districtCode;
                    values.wardCode = wardCode;
                    values.address = addressDetail;

                    // Debug tên location
                    console.log('Tên tỉnh/thành phố:', province?.name);
                    console.log('Tên quận/huyện:', district?.name);
                    console.log('Tên phường/xã:', ward?.name);
                }

                form.setFieldsValue(values);
            } else {
                form.resetFields();
                setListDistrict([]);
                setListWard([]);
            }
        };

        initForm();
    }, [data]);


    const onFinish = async (values: any) => {
        try {
            const payload = {
                username: values.username,
                phone: values.phone,
                address: `${values.provinceCode || ""}, ${values.districtCode || ""}, ${values.wardCode || ""}, ${values.address || ""}`.trim(),
            };
            if (id) {
                await upstashService.updateuser({ id: Number(id),data:payload });
                toast.success("Sửa thông tin thành công");
                onCancel();
                refetch();
            } else {
                const newCustomer = await upstashService.createuser({
                    username: values.username,
                    phone: values.phone,
                    addresses: `${values.provinceCode || ""}, ${values.districtCode || ""}, ${values.wardCode || ""}, ${values.address || ""}`.trim(),
                });
                toast.success("Thêm người dùng mới thành công");
                navigate('/custumer');
                if (path !== true) {
                    onCustomerAdded(newCustomer);
                }
            }
        } catch (e: any) {
            console.log(e);
            toast.error(e?.message);
        }
    };

    return (
        <div>
            {path && (
                <div className='flex gap-2 mb-3 items-center'>
                    <Button
                        onClick={() => {
                            navigate(path === true ? '/custumer' : '/addCustumer');
                        }}
                        icon={<ArrowLeftOutlined />}
                        size="large"
                    />
                    <h1 className="text-xl font-medium m-0">Thêm mới khách hàng</h1>
                </div>
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item
                        label="Tên khách hàng"
                        name="username"
                        rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng' }]}
                    >
                        <Input size='large' placeholder="Nhập họ" />
                    </Form.Item>

                    <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input size='large' placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item label="Thành phố" name="provinceCode">
                        <Select
                            size='large'
                            onChange={(value: any) => {
                                form.setFieldsValue({ districtCode: null, wardCode: null });
                                setListDistrict(getListDistrictsOf(value));
                                setListWard([]);
                            }}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label?.toLowerCase() ?? "").includes(input.toLowerCase())
                            }
                            options={VIET_NAME_LOCATION.map((province) => ({
                                value: province.code,
                                label: province.name,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item label="Quận/Huyện" name="districtCode">
                        <Select
                            size='large'
                            onChange={(districtCode: any) => {
                                const provinceCode: any = form.getFieldValue("provinceCode");
                                form.setFieldsValue({ wardCode: null });
                                setListWard(getListWardsOf(provinceCode, districtCode));
                            }}
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label?.toLowerCase() ?? "").includes(input.toLowerCase())
                            }
                            options={listDistrict.map((district: any) => ({
                                value: district.code,
                                label: district.name,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item label="Phường/Xã" name="wardCode">
                        <Select
                            size='large'
                            showSearch
                            filterOption={(input, option) =>
                                (option?.label?.toLowerCase() ?? "").includes(input.toLowerCase())
                            }
                            options={listWard.map((ward: any) => ({
                                value: ward.code,
                                label: ward.name,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item label="Địa chỉ cụ thể" name="address">
                        <Input size='large' placeholder="Nhập địa chỉ cụ thể" />
                    </Form.Item>
                </div>

                <div className='flex justify-end gap-3'>
                    <Button onClick={data ? onCancel : () => navigate('/custumer')}>
                        Hủy
                    </Button>
                    <Button
                        type='primary'
                        htmlType="submit"
                    >
                        Lưu
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default CustomForm;
