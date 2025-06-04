import { Card, Select } from "antd";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import {formatRevenue} from "../../helper/utils";
import {useQuery} from "react-query";
import upstashService from "../../api/config/upstashService.ts";
import useGlobalApi, {useUserInfo} from "../../config/states/user";
import {useEffect, useState} from "react";

const CharDashboard = () => {
    const {getStore, shop} = useGlobalApi();
    useEffect(() => {
        getStore();
    }, []);
    const [day, setDay] = useState("7");
    const [storeId, setStoreId] = useState<string | null>(null);
    const{userInfo} = useUserInfo()
    const { data  } = useQuery<any, Error>(
        ['av.getbuyday' , day , storeId],
        () => {
            return upstashService.getbuyday({
                day :day ,
                storeId: userInfo?.storeId ? userInfo?.storeId : storeId

            })
        })
    const totalRevenue = data?.reduce((sum: any, item : any) => sum + (item.revenue || 0), 0);

    return (
        <Card title="DOANH THU BÁN HÀNG" extra={<span>Tổng doanh thu: <b>{totalRevenue?.toLocaleString()}</b></span>}>
            <div className='flex justify-end gap-3 mb-5'>
                {userInfo?.role === 'admin'  && (
                    <Select
                        allowClear={true}
                        placeholder="Chọn cửa hàng"
                        onChange={(value) => setStoreId(value)}
                        style={{ width: 200 }}
                    >
                        {shop?.stores?.map((category: any) => (
                            <Select.Option key={category.id} value={category.id}>
                                {category.name}
                            </Select.Option>
                        ))}
                    </Select>
                )}

                <Select
                    value={day}
                    style={{ width: 150 }}
                    onChange={(value) => setDay(value)}
                >
                    <Select.Option value="7">7 ngày qua</Select.Option>
                    <Select.Option value="30">30 ngày qua</Select.Option>
                </Select>
            </div>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                    <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} /> {/* Ẩn đường trục X nhưng vẫn hiển thị nhãn */}
                    <YAxis tickFormatter={formatRevenue} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value) => formatRevenue(value)} />
                    <Bar dataKey="revenue" name="Doanh thu" fill="#1890ff" barSize={50} />
                </BarChart>
            </ResponsiveContainer>
        </Card>

    );
};

export default CharDashboard;
