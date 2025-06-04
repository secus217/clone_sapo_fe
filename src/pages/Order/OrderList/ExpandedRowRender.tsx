import TabaleExpandedRowRender from "./TabaleExpandedRowRender.tsx";
import moment from "moment/moment";
import {getFullAddress} from "../../../config/utils/Index.ts";

const expandedRowRender = (record: any) => {
    const addressParts = (record?.address || record?.customerOrder?.address)
        ? (record.address || record.customerOrder.address).split(',').map((part:any) => part.trim())
        : [];
    const provinceCode = addressParts[0] || "";
    const districtCode = addressParts[1] || "";
    const wardCode = addressParts[2] || "";
    const addressDetail = addressParts[3] || "";
    const addressInfo = getFullAddress(provinceCode, districtCode, wardCode);
    return (
        <div className="space-y-4">
            {/* Order Information Section */}
            {/*<div className=" flex justify-end ">*/}
            {/*    <button*/}
            {/*        className="border border-blue-500 text-blue-500 px-4 py-2 rounded-md hover:bg-blue-50 ">*/}
            {/*        Sửa đơn hàng*/}
            {/*    </button>*/}
            {/*</div>*/}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    {/* Order Details */}
                    <div className="p-4 border-b md:border-b-0 md:border-r border-gray-100">
                        <h2 className="text-lg font-medium mb-4">Thông tin đơn hàng</h2>
                        <div className="space-y-3">
                            <div className="flex">
                                <span className="text-gray-500 w-40">Mã đơn hàng:</span>
                                <span className="font-medium">SON{record?.id}</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 w-40">Ngày tạo:</span>
                                <span>{moment(record?.createdAt).format('DD-MM-YYYY HH:mm')}</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 w-40">Chi nhánh lên đơn:</span>
                                <span>{record?.storeInfo?.name}</span>
                            </div>
                            <div className="flex">
                                <span className="text-gray-500 w-40">Nhân viên bán hàng:</span>
                                <span>{record?.creater?.username}</span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="p-5 border-b md:border-b-0 md:border-r border-gray-100">
                        <h2 className="text-lg font-medium mb-4">Khách hàng</h2>
                        <div className="space-y-2">
                            <div>
                                <span className="text-blue-500 font-medium">{record?.customerOrder?.username}</span>
                                <span> - {record?.customerOrder?.phone}</span>
                            </div>
                            <div className="text-gray-600">
                                {addressInfo?.province} - {addressInfo?.district} - {addressInfo?.ward}, {addressDetail}
                            </div>
                        </div>
                        <div className="flex">
                            <span className="text-gray-500 w-40">Trạng thái thanh toán:</span>
                            <span>{record?.paymentStatus === 'paid' ? 'Đã trả' : 'Đang chờ thanh toán'}</span>
                        </div>
                    </div>

                    {/* Order Notes */}
                    <div className="p-5">
                        <h2 className="text-lg font-medium mb-4">Ghi chú đơn hàng</h2>
                        <div className="text-gray-500 mb-4">Đơn hàng chưa có ghi chú</div>
                    </div>
                </div>
            </div>
            <TabaleExpandedRowRender
                record={record}
            />
        </div>
    );
};
export default expandedRowRender
