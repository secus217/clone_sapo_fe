import {  Button} from "antd";
import TableProducts from "../../components/TableProducts.tsx";
import {useParams} from "react-router-dom";
import {useUserInfo} from "../../config/states/user";
import {useState} from "react";
import DetailProductsForStores from "./DetailProductsForStores.tsx";

const ListProduct = () => {
    const {id} = useParams()
    const {userInfo} =  useUserInfo()
    const [detail , setDetail] = useState(false)
    const [data, setData]= useState()
    return (
        <>
                <div>
                    {/* Bảng danh sách sản phẩm */}
                    {detail ? (
                        <DetailProductsForStores
                            data={data}
                            onBack={() => setDetail(false)}
                        />
                    ) :(
                        <>
                            <div className='flex justify-end mb-3'>
                                {!id && userInfo?.role === 'admin' && (
                                    <Button
                                        onClick={() => setDetail(true)}
                                        type='primary'
                                    >
                                        Thêm sản phẩm cho cửa hàng
                                    </Button>
                                )}
                            </div>
                            <TableProducts
                                setData={setData}
                            />
                        </>

                )}

        </div>
</>

)
    ;
};

export default ListProduct;
