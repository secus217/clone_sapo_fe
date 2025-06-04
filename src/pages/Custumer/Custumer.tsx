import { Table, Input, Avatar, Card, Button, Spin } from "antd";
import { UserOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useCombinedStore from "../../config/states/user";
import upstashService from "../../api/config/upstashService";

const { Search } = Input;

// Constants for localStorage caching
const CUSTOMER_DATA_KEY = "customer_data_cache";
const PAGINATION_KEY = "customer_pagination_cache";

const CustomerList = () => {
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();
    const { getUser, user } = useCombinedStore();
    // const [loading, setLoading] = useState(false);
    const debouncedSearchRef = useRef(null);

    // Retrieve cached data from localStorage
    // const savedCustomerData = localStorage.getItem(CUSTOMER_DATA_KEY);
    const savedPagination = localStorage.getItem(PAGINATION_KEY);

    const [customerData, setCustomerData] = useState(
        []
        // savedCustomerData ? JSON.parse(savedCustomerData) : []
    );
    const [pagination, setPagination] = useState(
        savedPagination
            ? JSON.parse(savedPagination)
            : { current: 1, pageSize: 20, total: 0 }
    );

    // Save customer data to localStorage when it changes
    useEffect(() => {
        if (customerData && customerData.length > 0) {
            localStorage.setItem(CUSTOMER_DATA_KEY, JSON.stringify(customerData));
        }
    }, [customerData]);

    // Save pagination to localStorage when it changes
    useEffect(() => {
        localStorage.setItem(PAGINATION_KEY, JSON.stringify(pagination));
    }, [pagination]);

    // Debounce search to reduce unnecessary API calls
    const debouncedSearch = useCallback(() => {
        if (debouncedSearchRef.current) {
            clearTimeout(debouncedSearchRef.current);
        }

        debouncedSearchRef.current = setTimeout(() => {
            // Reset to first page when search text changes
            setPagination(prev => ({ ...prev, current: 1 }));
        }, 500);
    }, []);

    // Main data fetching function
    const fetchUserData = useCallback(async () => {
        try {
            // setLoading(true);
            const payload = {
                page: pagination.current,
                limit: pagination.pageSize,
            };

            // Add search parameter if search text is not empty
            if (searchText.trim() !== "") {
                payload.search = searchText.trim();
            }

            // Fetch users
            await getUser(payload);
            const users = Array.isArray(user?.data) ? user.data : [];

            // If no data from API and we have local data, stop loading
            if (users.length === 0 && customerData.length > 0) {
                // setLoading(false);
                return;
            }

            // Enrich user data with order information
            const enrichedUsers = await Promise.all(users.map(async (userData) => {
                try {
                    // Fetch orders for each user
                    const ordersRes = await upstashService.getorderuser({
                        customerId: userData.id,
                    });

                    const orders = ordersRes?.data || [];
                    const totalSpent = orders.reduce(
                        (sum, order) => sum + (order.totalAmount || 0),
                        0
                    );

                    // Find the most recent order
                    const lastOrder = orders.length > 0
                        ? orders.sort((a, b) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        )[0]
                        : null;

                    return {
                        ...userData,
                        orders: orders.length,
                        lastOrder: lastOrder?.createdAt
                            ? new Date(lastOrder.createdAt).toLocaleDateString()
                            : "Chưa có đơn",
                        totalSpent: `${totalSpent.toLocaleString()}đ`,
                    };
                } catch (error) {
                    console.error(`Error fetching orders for user ${userData.id}:`, error);
                    return {
                        ...userData,
                        orders: 0,
                        lastOrder: "—",
                        totalSpent: "0đ",
                    };
                }
            }));

            // Update state if we have enriched users
            if (enrichedUsers.length > 0) {
                setCustomerData(enrichedUsers);

                // Update pagination total
                setPagination((prev) => ({
                    ...prev,
                    total: user?.meta?.totalItems || 0,
                }));
            }
        } catch (error) {
            console.error("Error fetching customers:", error);
            // Optionally show error notification to user
        }
    }, [getUser, user, searchText, pagination.current, pagination.pageSize]);

    // Trigger data fetch when search, pagination changes
    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // Handle search input change
    const handleSearchChange = useCallback((e) => {
        const value = e.target.value;
        setSearchText(value);
        debouncedSearch();
    }, [debouncedSearch]);

    // Table columns configuration
    const columns = [
        {
            title: "Tên khách hàng",
            dataIndex: "username",
            render: (text) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                        style={{ backgroundColor: "#87d068" }}
                        icon={<UserOutlined />}
                    />
                    <a style={{ marginLeft: 8, color: "#1890ff" }}>{text}</a>
                </div>
            ),
        },
        { title: "Điện thoại", dataIndex: "phone" },
        { title: "Đơn hàng", dataIndex: "orders" },
        { title: "Đơn hàng gần nhất", dataIndex: "lastOrder" },
        { title: "Tổng chi tiêu", dataIndex: "totalSpent" },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1>Khách hàng</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/addCustumer")}
                >
                    Thêm khách hàng
                </Button>
            </div>

            <Card>
                <Search
                    size="large"
                    placeholder="Tìm khách hàng..."
                    value={searchText}
                    onChange={handleSearchChange}
                    onSearch={() => {
                        // Trigger immediate search and reset to first page
                        setPagination(prev => ({ ...prev, current: 1 }));
                    }}
                    style={{ width: 300, marginBottom: 16 }}
                    allowClear
                />

                    <Table
                        onRow={(record) => ({
                            onClick: () => navigate(`/detailCustomer/${record.id}`),
                        })}
                        dataSource={customerData}
                        columns={columns}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: pagination.total,
                            showSizeChanger: true,
                            onChange: (page, pageSize) => {
                                setPagination({
                                    current: page,
                                    pageSize,
                                    total: pagination.total
                                });
                            },
                        }}
                        className="ant-table-custom cursor-pointer"
                        rowKey="id"
                    />
            </Card>
        </div>
    );
};

export default CustomerList;
