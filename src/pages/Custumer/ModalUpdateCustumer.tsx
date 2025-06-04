import {Form, Modal} from "antd";
import CustomForm from "./components/CustomForm.tsx";

const ModalUpdateCustumer = ({modalDetailCustomer ,onCancel , data ,refetch} : any) => {
    const [formModalUpdateCustumer] = Form.useForm();

    return (
        <>
            <Modal
                title="Sửa Thông tin khách hàng"
                open={modalDetailCustomer}
                onCancel={onCancel}
                footer={null}
                width={700}
            >
                <CustomForm
                    refetch={refetch}
                    data={data}
                    onCancel={onCancel}
                    form={formModalUpdateCustumer}
                />
            </Modal>
        </>
    )
}
export default ModalUpdateCustumer
