import { Typography } from "antd";
import {getFullAddress} from "../config/utils/Index.ts";
const { Title, Text } = Typography;
const FormCustumer = ({ data }: any) => {
    const addressParts = (data?.address || data?.customerOrder?.address)
        ? (data.address || data.customerOrder.address).split(',').map((part:any) => part.trim())
        : [];
    const provinceCode = addressParts[0] || "";
    const districtCode = addressParts[1] || "";
    const wardCode = addressParts[2] || "";
    const addressDetail = addressParts[3] || "";

    const addressInfo = getFullAddress(provinceCode, districtCode, wardCode);
    return (
        <>
            <div className='flex justify-between'>
                <div>
                    <Title level={5} className="m-0">
                        {data?.username || data?.customerOrder?.username} - {data?.phone || data?.customerOrder?.phone}
                    </Title>
                    <Text strong>Địa chỉ giao hàng:</Text>
                    <p className="m-0">
                        {addressInfo?.province} - {addressInfo?.district} - {addressInfo?.ward}, {addressDetail}
                    </p>
                </div>
                {/*<div className="border border-dashed border-gray-300 p-4 mb-4 min-w-[350px]">*/}
                {/*    <div className="flex justify-between items-center text-base">*/}
                {/*        <Text>Nợ phải thu</Text>*/}
                {/*        <Text className="text-red-500">-1,760,000</Text>*/}
                {/*    </div>*/}
                {/*    <div className="flex justify-between items-center text-base mt-2">*/}
                {/*        <Text>Tổng chi tiêu (0 đơn)</Text>*/}
                {/*        <Text>0</Text>*/}
                {/*    </div>*/}
                {/*    <div className="flex justify-between items-center text-base mt-2">*/}
                {/*        <Text>Trả hàng (0 sản phẩm)</Text>*/}
                {/*        <Text>0</Text>*/}
                {/*    </div>*/}
                {/*    <div className="flex justify-between items-center text-base mt-2">*/}
                {/*        <Text>Giao hàng thất bại (0 đơn)</Text>*/}
                {/*        <Text>0</Text>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </>
    );
};

export default FormCustumer;
