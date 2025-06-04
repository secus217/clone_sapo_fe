import ListProduct from "./ListProduct.tsx";
import {Tabs} from "antd";
import TabPane from "antd/es/tabs/TabPane";
import GeneralWarehouse from "./GeneralWarehouse.tsx";

const IndexProduct = () => {

    return (
        <>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Kho tổng" key="1">
                    <GeneralWarehouse/>
                </TabPane>
                <TabPane tab="Kho cửa hàng" key="2">
                    <ListProduct/>
                </TabPane>
            </Tabs>
        </>
    )
}
export default IndexProduct
