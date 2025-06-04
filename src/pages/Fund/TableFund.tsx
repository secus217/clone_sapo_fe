import { Table, Tabs, Tag, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import DetailsAdventure from './ChiTietPhieu.tsx';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

export default function TableFund({ data, pageSize  ,refetch}: any) {
    const allData = data?.data || [];
    const [details, setDetails] = useState(false);
    const [selectedData, setSelectedData] = useState<any[]>([]);

    const [pages, setPages] = useState({
        '1': 1,
        '2': 1,
        '3': 1,
    });

    // Lọc
    const [paymentFilter, setPaymentFilter] = useState<string | undefined>(undefined);
    const [storeFilter, setStoreFilter] = useState<string | undefined>(undefined);
    const [dateRange, setDateRange] = useState<[any, any] | null>(null);

    const storeOptions = Array.from(new Set(allData.map((d: any) => d.store?.name))).filter(Boolean);

    const filterData = (raw: any[]) => {
        return raw.filter((item) => {
            const matchPayment = !paymentFilter || item.paymentMethod === paymentFilter;
            const matchStore = !storeFilter || item.store?.name === storeFilter;
            const matchDate =
                !dateRange ||
                (dayjs(item.createdAt).isSameOrAfter(dateRange[0], 'day') &&
                    dayjs(item.createdAt).isSameOrBefore(dateRange[1], 'day'));
            return matchPayment && matchStore && matchDate;
        });
    };

    const tabs = [
        { key: '1', label: 'Tổng quỹ', data: allData },
        { key: '2', label: 'Phiếu Thu', data: allData.filter((d: any) => d.type === 'THU') },
        { key: '3', label: 'Phiếu Chi', data: allData.filter((d: any) => d.type === 'CHI') },
    ];

    const [activeTab, setActiveTab] = useState('1');

    const orderIdColumn = {
        title: 'Mã chứng từ',
        dataIndex: 'orderId',
        key: 'orderId',
        render: (value: any) => {
            return value ? `SON${value}` : '';
        },
    };

    const getBaseColumns = () => [
        {
            title: 'Mã phiếu chi',
            dataIndex: 'id',
            render: (id: number) => `PVN00${id}`,
        },
        {
            title: 'Phương thức thanh toán',
            dataIndex: 'paymentMethod',
            render: (value: any) => (value === 'cash' ? 'Tiền mặt' : 'Chuyển khoản'),
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalAmount',
            render: (value: any, record: any) => (
                <span className={record.type === 'THU' ? 'text-green-500' : 'text-red-500'}>
                    {new Intl.NumberFormat('vi-VN').format(Math.abs(value))}đ
                </span>
            ),
        },
        {
            title: 'Kiểu',
            dataIndex: 'type',
        },
        {
            title: 'Cửa hàng',
            dataIndex: ['store', 'name'],
        },
        {
            title: 'Trạng thái',
            dataIndex: ['status'],
            key: 'status',
            render: (status: string) => (
                <Tag
                    className={`border-0 rounded-full px-4 py-1 ${
                        status === 'completed'
                            ? 'bg-green-50 text-green-600'
                            : status === 'processing'
                                ? 'bg-orange-50 text-orange-500'
                                : status === 'cancelled'
                                    ? 'bg-red-50 text-red-500'
                                    : 'bg-gray-50 text-gray-500'
                    }`}
                >
                    {status === 'completed'
                        ? 'Hoàn thành'
                        : status === 'processing'
                            ? 'Đang xử lý'
                            : status === 'cancelled'
                                ? 'Đã huỷ'
                                : 'Không xác định'}
                </Tag>
            ),
        },
        {
            title: 'Ngày tạo đơn',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value: string) => dayjs(value).format('DD/MM/YYYY HH:mm:ss'),
        },
    ];

    const getColumnsByTab = () => {
        const baseColumns = getBaseColumns();
        if (activeTab === '3') {
            return baseColumns;
        }
        return [...baseColumns.slice(0, 6), orderIdColumn, baseColumns[6]];
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            {details ? (
                <DetailsAdventure onback={() => setDetails(false)} data={selectedData} refetch={refetch} />
            ) : (
                <>
                    <div className="flex flex-wrap gap-4 mb-4">
                        <Select
                            allowClear
                            placeholder="Hình thức thanh toán"
                            style={{ width: 200 }}
                            onChange={setPaymentFilter}
                            value={paymentFilter}
                            options={[
                                { label: 'Tiền mặt', value: 'cash' },
                                { label: 'Chuyển khoản', value: 'bank' },
                            ]}
                        />
                        <Select
                            allowClear
                            placeholder="Chi nhánh"
                            style={{ width: 200 }}
                            onChange={setStoreFilter}
                            value={storeFilter}
                            options={storeOptions.map((name) => ({ label: name, value: name }))}
                        />
                        <RangePicker
                            onChange={(range) => setDateRange(range as any)}
                            value={dateRange as any}
                            format="DD/MM/YYYY"
                        />
                    </div>

                    <Tabs
                        activeKey={activeTab}
                        onChange={(key) => {
                            setActiveTab(key);
                        }}
                    >
                        {tabs.map((tab) => {
                            const filtered = filterData(tab.data);
                            return (
                                <TabPane tab={tab.label} key={tab.key}>
                                    <Table
                                        columns={getColumnsByTab()}
                                        dataSource={filtered.slice(
                                            (pages[tab.key] - 1) * pageSize,
                                            pages[tab.key] * pageSize
                                        )}
                                        onRow={(record) => ({
                                            onClick: () => {
                                                setSelectedData(record);
                                                setDetails(true);
                                            },
                                        })}
                                        pagination={{
                                            current: pages[tab.key],
                                            pageSize,
                                            total: filtered.length,
                                            onChange: (newPage) =>
                                                setPages((prev) => ({ ...prev, [tab.key]: newPage })),
                                        }}
                                        rowKey="id"
                                    />
                                </TabPane>
                            );
                        })}
                    </Tabs>
                </>
            )}
        </div>
    );
}
