import {Button, Empty, Table} from "antd";
// import { useNavigate } from "react-router-dom";
import useGlobalApi, {useUserInfo} from "../../../config/states/user";
import {useEffect, useState} from "react";
import ModalShop from "./ModalShop.tsx";

const IndexShop = () => {
    // const navigate = useNavigate();
    const {userInfo} = useUserInfo()

    const {getStore , shop} =useGlobalApi()
    // console.log('shop' , shop)
    const [modalOpen, setModalOpen] = useState(false);
    useEffect(() => {
        getStore()
    }, []);
    const columns = [
        {
            title: "Têb cửa hàng",
            dataIndex: "name",
            key: "name",
        },

        {
            title: "Địa chỉ cửa hàng",
            dataIndex: "address",
            key: "address",
        },
    ];
    return (
        <>
            {userInfo?.role === 'admin' ?
                <div>
                    <Button type="primary" onClick={() => setModalOpen(true)} style={{marginBottom: 16}}>
                        Thêm cửa hàng
                    </Button>
                    <Table
                        // onRow={(record) => ({
                        //     onClick: () => navigate(`/detailProduct/${record.id}`),
                        // })}
                        dataSource={shop?.stores}
                        columns={columns}
                        pagination={false}
                        className="ant-table-custom"
                        rowKey="id"
                    />
                    <ModalShop
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                    />
                </div>
                : (
                    <Empty description="Nhân viên không có quyền" />
                )}

        </>


    );
};

export default IndexShop;
