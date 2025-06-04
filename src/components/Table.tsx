import { Table } from "antd"

const TabaleRender = ({ columns, data  , discount}: any) => {
    const totalAmount = data.reduce((sum:any, item:any) => sum + item.totalPrice, 0);
    return (
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <Table columns={columns} dataSource={data} pagination={false} />
            <div className="flex justify-end ">
                <div className="text-sm w-64">
                    <div className="flex">
                        <p className="flex-1">Tổng tiền ({data?.length} sản phẩm)</p>
                        <p className="font-semibold text-right w-30">{totalAmount.toLocaleString()}/VND</p>
                    </div>
                    {/*<div className="flex">*/}
                    {/*    <p className="flex-1">Chiết khấu</p>*/}
                    {/*    <p className="text-right w-20">0</p>*/}
                    {/*</div>*/}
                    {/*<div className="flex">*/}
                    {/*    <p className="flex-1">Phí giao hàng</p>*/}
                    {/*    <p className="font-semibold text-right w-20">{shippingFee.toLocaleString("vi-VN")}</p>*/}
                    {/*</div>*/}
                    <div className="flex">
                        <p className=" flex-1">Số tiền chiết khấu</p>
                        <p className="text-right font-bold text-green-500 w-30">
                            {discount?.toLocaleString()}/VND
                        </p>
                    </div>

                    <div className="flex">
                        <p className="font-bold flex-1">Khách phải trả</p>
                        <p className="text-right font-bold text-red-500 w-30">
                            {(totalAmount).toLocaleString("vi-VN")}/VND
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TabaleRender
