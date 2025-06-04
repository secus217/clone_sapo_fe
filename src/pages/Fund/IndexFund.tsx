import { useState } from "react";
import DetaliCashBook from "./DetaliCashBook.tsx";
import TableFund from "./TableFund.tsx";
import { Button, Dropdown, Menu } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import CollectSpend from "./CollectSpend.tsx";
import {useQuery} from "react-query";
import upstashService from "../../api/config/upstashService.ts";

const IndexFund = () => {
    const [selectedType, setSelectedType] = useState<string | null>(null);
    // const storedStoreId = localStorage.getItem("selectedStore");
    const [page, setPage] = useState(1);
        const pageSize = 10;
    const { data , refetch} = useQuery(
        ['av.getreceiptnote', page ],
        () => upstashService.getreceiptnote({
            page,
            limit: 100000000,
            // storeId: storedStoreId,
        }),
    );
    const handleMenuClick = (key: string) => {
        if (key === "1") {
            setSelectedType("collect");
        } else if (key === "2") {
            setSelectedType("spend");
        } else {
            setSelectedType(null);
        }
    };

    const menu = (
        <Menu onClick={({ key }) => handleMenuClick(key)}>
            <Menu.Item key="1">Tạo phiếu thu</Menu.Item>
            <Menu.Item key="2">Tạo phiếu chi</Menu.Item>
        </Menu>
    );

    return (
        <>
            {selectedType ?
                <CollectSpend
                    refetch={refetch}
                    onback={() =>setSelectedType(null)}
                    type={selectedType}
                /> :
                <div className='grid gap-3'>
                    <div className='flex justify-between items-center'>
                        <h2>Sổ quỹ</h2>
                        <Dropdown overlay={menu} trigger={["click"]}>
                            <Button
                                size='large'
                                type="primary"
                                className="flex items-center space-x-2"
                                icon={<PlusCircleOutlined/>}
                            >
                                Tạo phiếu
                            </Button>
                        </Dropdown>
                    </div>
                    <DetaliCashBook/>
                    <TableFund
                        refetch={refetch}
                        pageSize={pageSize}
                        data={data}
                        page={page}
                        setPage={setPage}
                    />
                </div>
            }

        </>

    );
};

export default IndexFund;
