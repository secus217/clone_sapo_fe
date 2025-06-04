import {Button, Form, Image, Input} from "antd";
import Logo from '../../assets/react.svg'
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";

const ForgotPassword = () => {
    const [form] = Form.useForm();
    const {t} = useTranslation()
    const handleForgotPassword = async (values: {email: string, password: string}) => {
        console.log(values)
        // add your code here
    }
    return (
        <main className="login-page">
            <div className="login-card">
                <div className="login-card-header">
                    <div>
                        <Image width={200} src={Logo} preview={false}/>
                    </div>
                    <p className="login-title">{t('Welcome')}</p>
                    <p className="login-description">{t("Enter email to your email")}</p>
                </div>
                <Form
                    form={form}
                    name="forgot-password"
                    layout="vertical"
                    onFinish={handleForgotPassword}
                >
                    <Form.Item
                        label={<span className="text-base font-medium">{t("Email")}</span>}
                        name="email"
                        rules={[
                            {required: true, message: t("Please input your email!")},
                        ]}
                    >
                        <Input placeholder={t("Email")} className="login-form-input border-black"/>
                    </Form.Item>
                </Form>

                <Button
                    type="primary"
                    onClick={form.submit}
                    className="login-btn bg-black mt-3"
                    size="large"
                >
                    {t("Forgot Password")}
                </Button>
                <div className={'mt-3 text-center'}>
                    <span className={'text-sm'}>{t("Already have an account?")}</span>
                    <Link to={'/login'} className={'text-blue-500 text-sm'}>
                        {t(" Login")}
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default ForgotPassword;
