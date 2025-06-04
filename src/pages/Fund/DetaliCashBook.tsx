import { Card, Typography } from "antd";
import {useQuery} from "react-query";
import upstashService from "../../api/config/upstashService.ts";

const { Text } = Typography;

export default function DetaliCashBook() {
    const { data  } = useQuery<any, Error>(
        ['av.getallthuchi'],
        () => {
            return upstashService.getallthuchi()
        })
    return (
        <div>
            <Card bodyStyle={{padding:'13px'}}>
                <div className="flex items-center gap-x-10 pl-12">
                    {/* Total Income */}
                    <div className="flex flex-col items-center p-2 min-w-[120px]">
                        <Text className="text-gray-800  mb-1 text-lg">Tổng thu</Text>
                        <Text
                            className="text-green-500 text-base font-semibold">{data?.noteTien?.TongThu?.toLocaleString()}đ</Text>
                    </div>

                    {/* Minus Sign */}
                    <div className="flex items-center justify-center p-2">
                        <Text className="text-gray-400 text-2xl">−</Text>
                    </div>

                    {/* Total Expense */}
                    <div className="flex flex-col items-center p-2 min-w-[120px]">
                        <Text className="text-gray-800  mb-1 text-lg">Tổng chi</Text>
                        <Text className="text-red-500 text-base font-semibold">{data?.noteTien?.TongChi?.toLocaleString()}đ</Text>
                    </div>

                    {/* Equals Sign */}
                    <div className="flex items-center justify-center p-2">
                        <Text className="text-gray-400 text-2xl">=</Text>
                    </div>

                    {/* Remaining Fund */}
                    <div className="flex flex-col items-center p-2 min-w-[120px]">
                        <Text className="text-gray-800 mb-1 text-lg">Tồn quỹ</Text>
                        <Text
                            className={`text-base font-semibold ${data?.noteTien?.TongThu - data?.noteTien?.TongChi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {(data?.noteTien?.TongThu - data?.noteTien?.TongChi >= 0 ? '+' : '-') + Math.abs(data?.noteTien?.TongThu - data?.noteTien?.TongChi).toLocaleString()}đ
                        </Text>
                    </div>


                    {/* Fund Details */}
                    <div className="bg-blue-50 p-2 rounded-md ml-auto min-w-[300px]">
                        <div className="flex flex-col">
                            <div className="flex justify-between mb-2">
                                <Text className="text-gray-800 text-base">Quỹ tiền mặt:</Text>
                                <Text className="text-gray-800 font-medium text-base">{data?.noteTien?.QuyTienMat?.toLocaleString()}đ</Text>
                            </div>
                            <div className="flex justify-between">
                                <Text className="text-gray-800 text-base">Quỹ tiền chuyển khoản:</Text>
                                <Text className="text-gray-800 font-medium text-base">{data?.noteTien?.QuyBank?.toLocaleString()}đ</Text>
                            </div>
                        </div>
                    </div>

                </div>
            </Card>
        </div>
    );
}
