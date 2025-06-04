import type React from "react"
import {Card, Steps, Row, Col, Typography, Divider, Tag, Button, Table} from "antd"
import {ArrowLeftOutlined} from "@ant-design/icons"
import moment from "moment";
import {useQuery} from "react-query";
import upstashService from "../../api/config/upstashService.ts";
import {useUserInfo} from "../../config/states/user";
import {toast} from "react-hot-toast";

const { Title, Text } = Typography

const CreationListDetails: React.FC = ({selectedRowData , onCancel , refetch} : any) => {
   const columnsprot= [
        {
            title: "Ảnh",
            dataIndex: ["product","imageUrls"],
            key: "imageUrls",
            width: 80,
            render: (imageUrls: string) => {
                const images = imageUrls?.split(","); // Tách chuỗi thành mảng URL
                return images?.length > 0 ? (
                    <img src={images[0]} className="w-16 h-16 object-cover" alt="Ảnh sản phẩm" />
                ) : (
                    "Không có ảnh"
                );
            },
        },
        {
            title: "Tên sản phẩm",
            dataIndex: ["product", "name"],
            key: "name",
        },
        {
            title: "Số lượng",
            dataIndex: ["quantity"],
            key: "quantity",
        },
        {
            title: "Sku",
            dataIndex: ["product","sku"],
            key: "sku",
        }

    ]
    const { data: getexportnotedetail } = useQuery(
        ["av.getexportnotedetail", selectedRowData],
        () => upstashService?.getexportnotedetail(selectedRowData?.id),
        {
            enabled: !!selectedRowData?.id,
        }
    );
    const {userInfo} =  useUserInfo()
    const handcomfin =async () => {

        try {
            await upstashService?.postnotimport({
                exportNoteId: selectedRowData.id
            })
            toast.success('Xác nhận nhập kho thành công')
            refetch()
            onCancel()
        }catch (err: any){
            console.log(err);
            toast.error(err?.message || "Failed to upload image");
        }
    }
    const canConfirm = (() => {
        if (selectedRowData?.status === "pending") return true;
        if (userInfo?.storeId === getexportnotedetail?.exportNote?.toStoreId) return true;
        if (userInfo?.role === "admin") return true;
        return false;
    })();

    return (
        <Card className="shipping-tracker-card">
            <Row align="middle" justify="space-between">
                <Col className="flex items-center gap-1">
                    <Button
                        onClick={onCancel}
                        icon={<ArrowLeftOutlined />}
                        size="large"
                    />
                    <Text strong style={{ fontSize: 16 }}>
                        STN00{selectedRowData?.id}
                    </Text>
                </Col>

                <Col>
                    <Steps
                        current={
                            selectedRowData?.status === 'pending'
                                ? 0
                                : selectedRowData?.status === 'completed'
                                    ? 2
                                    : selectedRowData?.status === 'cancelled'
                                        ? 1
                                        : 0
                        }
                        progressDot
                        status={
                            selectedRowData?.status === 'cancelled' ? 'error' : undefined
                        }
                        style={{ marginBottom: 24 }}
                        items={[
                            {
                                title: "Đã tiếp nhận",
                            },
                            {
                                title: "Đang chuyển",
                            },
                            {
                                title: "Đã nhận",
                            },
                        ]}
                    />
                </Col>
            </Row>

            <Row gutter={24}>
                {/* Left column - Shipping information */}
                <Col span={12}>
                    <Title level={5}>Thông tin phiếu</Title>
                    <Divider style={{ margin: "12px 0" }} />

                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}>
                            <Text type="secondary">Cửa hàng chuyển:</Text>
                        </Col>
                        <Col span={16}>
                            <Text>{selectedRowData?.fromStore?.name}</Text>
                        </Col>
                    </Row>

                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}>
                            <Text type="secondary">Ngày tạo phiếu:</Text>
                        </Col>
                        <Col span={16}>
                            <Text>{moment(selectedRowData?.createdAt).format('DD-MM-YYYY')}</Text>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}>
                            <Text type="secondary">Ngày nhận hàng:</Text>
                        </Col>
                        <Col span={16}>
                            <Text>{moment(selectedRowData?.updatedAt).format('DD-MM-YYYY')}</Text>
                        </Col>
                    </Row>

                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}>
                            <Text type="secondary">Tổng SL nhận/ SL chuyển:</Text>
                        </Col>
                        <Col span={16}>
                            <Text>{selectedRowData?.totalQuantity}/{selectedRowData?.totalQuantity}</Text>
                        </Col>
                    </Row>

                    <Row style={{ marginTop: 16 }}>
                        <Button type="link" style={{ padding: 0, color: "#1890ff" }}>
                           Danh sách sản phẩm
                        </Button>
                    </Row>
                </Col>

                {/* Right column - Recipient information */}
                <Col span={12}>
                    <Title level={5}>Thông tin bổ sung</Title>
                    <Divider style={{ margin: "12px 0" }} />
                    {selectedRowData?.creater && (
                        <Row style={{ marginBottom: 8 }}>
                            <Col span={8}>
                                <Text type="secondary">Người {selectedRowData?.type === "nhap" ? 'nhận' : "gửi"} hàng:</Text>
                            </Col>
                            <Col span={16}>
                                <Text>{selectedRowData?.creater?.username}</Text>
                            </Col>
                        </Row>
                    )}
                        <Row style={{ marginBottom: 8 }}>
                            <Col span={8}>
                                <Text type="secondary">Cửa hàng nhận:</Text>
                            </Col>
                            <Col span={16}>
                                <Text>{selectedRowData?.toStore?.name}</Text>
                            </Col>
                        </Row>
                    {/*{selectedRowData?.creater && (*/}
                    {/*    <Row style={{ marginBottom: 8 }}>*/}
                    {/*        <Col span={8}>*/}
                    {/*            <Text type="secondary">Người hàng nhận:</Text>*/}
                    {/*        </Col>*/}
                    {/*        <Col span={16}>*/}
                    {/*            <Text>{selectedRowData?.creater?.username}</Text>*/}
                    {/*        </Col>*/}
                    {/*    </Row>*/}

                    {/*)}*/}

                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}>
                            <Text type="secondary">Trạng thái:</Text>
                        </Col>
                        <Col span={16}>
                            <Text> {selectedRowData?.status === "completed"
                                ? "Hoàn thành"
                                : selectedRowData?.status === "pending"
                                    ? "Đang xử lý"
                                    : selectedRowData?.status === "cancelled"
                                        ? "Đã huỷ"
                                        : "Thất bại"}</Text>
                        </Col>
                    </Row>

                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}>
                            <Text type="secondary">Ghi chú:</Text>
                        </Col>
                        <Col span={16}>
                            <Text>{selectedRowData?.note}</Text>
                        </Col>
                    </Row>

                    <Row style={{ marginBottom: 8 }}>
                        <Col span={8}>
                            <Text type="secondary">Tags:</Text>
                        </Col>
                        <Col span={16}>
                            <Tag color="blue">{selectedRowData?.type}</Tag>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Table
                dataSource={getexportnotedetail?.exportNoteDetailWithProduct || []}
                columns={columnsprot}
                pagination={false}
                className="ant-table-custom"
            />
            <div
                className='mt-3 flex justify-end'
            >

                {canConfirm && (
                    <Button type="primary" onClick={handcomfin}>
                        Xác nhận
                    </Button>
                )}

            </div>


        </Card>
    )
}

export default CreationListDetails
