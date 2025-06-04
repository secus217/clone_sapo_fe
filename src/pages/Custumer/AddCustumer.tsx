import CustomForm from "./components/CustomForm.tsx";
import { Form} from "antd";

const AddCustumer = () => {
    const [formAddCustumer] = Form.useForm();
    return (
        <>
                <div className=" p-6 bg-white rounded-lg shadow-md">
                    <CustomForm
                        path={true}
                        form={formAddCustumer}
                    />
                </div>
        </>
    )
}
export default AddCustumer
