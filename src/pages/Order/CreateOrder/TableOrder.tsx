import { Table} from "antd";
import {getColumns} from "../../../components/FromTable.tsx";

const TableOrder = ({listOrders , setListOrders }: any) => {
    const columns = getColumns({ setListOrders });
    console.log('listOrders' , listOrders)
    return (
        <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={listOrders}
                    pagination={false}
                    className="border border-gray-200"
                    size="middle"
                    bordered={false}
                />
            </div>
        </>
    )
}
export default TableOrder
