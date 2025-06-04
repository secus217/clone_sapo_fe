import { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { toast } from "react-hot-toast";
import upstashService from "../../api/config/upstashService.ts";
import { JWT_LOCAL_STORAGE_KEY } from "../../config/constant";
const { Title, Text } = Typography;

export default function AuthForm() {
    const [form] = Form.useForm();
    const [isRegister, setIsRegister] = useState(false);
    const storeName = "Bizsuite";

    const onFinish = async (values: any) => {
        if (isRegister) {
            if (values.password !== values.confirmPassword) {
                toast.error("Mật khẩu xác nhận không khớp!");
                return;
            }
            try {
                const res = await upstashService.register({
                    username: values.username,
                    password: values.password,
                });

                if (res) {
                    toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
                    setIsRegister(false);
                    form.resetFields();
                }
            } catch (e: any) {
                console.error("Register error:", e); // 🔍 Debugging
                toast.error(e.message || "Lỗi không xác định");
            }
        } else {
            try {
                const res:any = await upstashService.Login({
                    username: values.username,
                    password: values.password,
                });
                    localStorage.setItem(JWT_LOCAL_STORAGE_KEY, res.jwt);
                    toast.success("Đăng nhập thành công!");
                    if(res?.user?.storeId) {
                        localStorage.setItem("selectedStore" , res?.user?.storeId)
                        location.href='/'
                    }else {
                        location.href='/moadalSoter'
                    }
            } catch (e: any) {
                console.error("Login error:", e); // 🔍 Debugging
                toast.error(e.message || "Lỗi không xác định!");
            }
        }
    };


    return (
        <div
            className="relative min-h-screen flex items-center justify-center
             before:content-[''] before:absolute before:bottom-0 before:left-0
             before:w-full before:h-1/2 before:bg-[url('/background-login.svg')]
             before:bg-cover before:bg-bottom before:z-0"
        >
            <div className="w-full max-w-xl">
                <div className="flex justify-center">
                    <img
                        src="/loginpng.png"
                        alt="Sapo Logo"
                        width={450}
                        height={200}
                        className="object-contain"
                    />
                </div>

                <div className="text-center mb-6">
                    <Title level={2} className="!text-gray-800">
                        {isRegister ? "Đăng ký tài khoản" : "Đăng nhập vào cửa hàng của bạn"}
                    </Title>
                    {!isRegister && <Text className="text-gray-600">Cửa hàng {storeName}</Text>}
                </div>

                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        name="username"
                        className="mb-4"
                        rules={[{ required: true, message: "Vui lòng nhập email/số điện thoại!" }]}
                    >
                        <Input
                            style={{ borderRadius: 100, padding: 13 }}
                            size="large"
                            placeholder="Nhập usename của bạn"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        className="mb-2"
                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                    >
                        <Input.Password
                            style={{ borderRadius: 100, padding: 13 }}
                            size="large"
                            placeholder={isRegister ? "Tạo mật khẩu" : "Mật khẩu đăng nhập cửa hàng"}
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>

                    {isRegister && (
                        <Form.Item
                            name="confirmPassword"
                            className="mb-4"
                            rules={[{ required: true, message: "Vui lòng xác nhận mật khẩu!" }]}
                        >
                            <Input.Password
                                style={{ borderRadius: 100, padding: 13 }}
                                size="large"
                                placeholder="Xác nhận mật khẩu"
                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                        </Form.Item>
                    )}

                    <div className="flex justify-end mb-6">
                        <Button
                            type="link"
                            className="text-blue-500 hover:text-blue-600 text-sm"
                            onClick={() => setIsRegister(!isRegister)}
                        >
                            {isRegister ? "Quay lại đăng nhập" : "Đăng ký tài khoản"}
                        </Button>
                    </div>

                    <Form.Item className="w-full flex justify-center">
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            className="h-16 w-56 rounded-full text-2xl font-bold !bg-[#70e4d3] hover:opacity-90"
                        >
                            {isRegister ? "Đăng ký" : "Đăng nhập"}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
