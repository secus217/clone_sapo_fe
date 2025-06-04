import { Modal, Form } from "antd";
import CustomForm from "../../Custumer/components/CustomForm.tsx";

const ModalClientOrder = ({ visible, onClose   , onCustomerAdded} : any) => {
    const [form] = Form.useForm();

    return (
        <Modal
            title="Thêm mới khách hàng"
            open={visible}
            onCancel={onClose}
            footer={null}
        >
            <CustomForm
                onCustomerAdded={onCustomerAdded}
                onCancel={onClose}
                form={form}
            />
        </Modal>
    );
};

export default ModalClientOrder;
