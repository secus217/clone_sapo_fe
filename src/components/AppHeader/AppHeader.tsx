import "./index.css";
import { Button, Popover, Select } from "antd";
import { GrLogout } from "react-icons/gr";
import { JWT_LOCAL_STORAGE_KEY } from "../../config/constant";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import useGlobalApi, {useUserInfo} from "../../config/states/user";
import { useLocation } from "react-router-dom";

interface AppHeaderProps {
    setCollapsed: (collapsed: boolean) => void;
    collapsed: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ setCollapsed, collapsed }) => {
    const { width } = useWindowSize();
    const { getStore, shop } = useGlobalApi();
    const {userInfo} =  useUserInfo()
    const role = userInfo?.role
    const location = useLocation();
    const [selectedStore, setSelectedStore] = useState<any>(() => {
        return localStorage.getItem("selectedStore") || undefined;
    });

    // Listen for localStorage changes
    useEffect(() => {
        // Function to handle storage changes from other tabs
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "selectedStore") {
                setSelectedStore(e.newValue || undefined);
            }
        };

        // Function to check localStorage directly (for changes in current tab)
        const checkLocalStorage = () => {
            const currentValue = localStorage.getItem("selectedStore");
            if (currentValue !== selectedStore) {
                setSelectedStore(currentValue || undefined);
            }
        };

        // Set up interval to periodically check localStorage
        const intervalId = setInterval(checkLocalStorage, 1000);

        // Listen for storage events (from other tabs)
        window.addEventListener("storage", handleStorageChange);

        // Cleanup
        return () => {
            clearInterval(intervalId);
            window.removeEventListener("storage", handleStorageChange);
        };
    }, [selectedStore]);

    // Fetch data when selectedStore changes
    useEffect(() => {
        const fetchData = async () => {
            await getStore();
        };
        fetchData();
    }, [selectedStore, getStore]);

    // Initialize selectedStore if not set but stores are available
    useEffect(() => {
        if (!selectedStore && shop?.stores?.length > 0) {
            const storedStoreId = localStorage.getItem("selectedStore");
            if (storedStoreId) {
                const storeExists = shop.stores.some(
                    (store: any) => store.id.toString() === storedStoreId
                );
                if (storeExists) {
                    setSelectedStore(storedStoreId);
                }
            }
        }
    }, [shop, selectedStore]);

    const handleStoreChange = async (value: any) => {
        setSelectedStore(value);
        localStorage.setItem("selectedStore", value);
    };

    const handleLogout = () => {
        try {
            localStorage.removeItem(JWT_LOCAL_STORAGE_KEY);
            localStorage.removeItem('selectedStore');
            window.location.href = "/login";
        } catch (err) {
            console.error("Logout error:", err);
        }
    };
    const isProductDetailPage = /^\/product\/\d+$/.test(location.pathname);

    return (
        <div className="app-header flex justify-between items-center px-8 pl-10 py-2">
            <div className="header-left flex items-center w-2/4">
                {width && width < 992 && (
                    <div
                        onClick={() => setCollapsed(!collapsed)}
                        className="mr-3 bg-black w-10 h-10 flex justify-center items-center hover:opacity-80 cursor-pointer rounded-lg"
                    >
                        {collapsed ? (
                            <MenuUnfoldOutlined className="text-white" />
                        ) : (
                            <MenuFoldOutlined className="text-white" />
                        )}
                    </div>
                )}
                {
                    role === "admin" &&
                    location.pathname !== "/shop" &&
                    location.pathname !== "/" &&
                    location.pathname !== "/custumer" &&
                    location.pathname !== "/productType" &&
                    location.pathname !== "/fund" &&
                    !location.pathname.startsWith("/detailOrder") &&
                    !location.pathname.startsWith("/detailCustomer") &&
                    location.pathname !== "/product" &&
                    location.pathname !== "/warehouseManagement" &&
                    location.pathname !== "/addCustumer" &&
                    location.pathname !== "/orderList" &&
                    location.pathname !== "/staff" &&
                    !isProductDetailPage &&
                    selectedStore && (
                        <div>
                            <span>Kho hàng</span>
                            <Select
                                size="large"
                                placeholder="Chọn cửa hàng"
                                className="rounded-lg !border-none bg-[rgb(245,245,245)] hover:bg-[#f3f4f5] w-60"
                                options={
                                    shop?.stores?.map((store: any) => ({
                                        value: store.id.toString(),
                                        label: store.name,
                                    })) || []
                                }
                                value={selectedStore}
                                onChange={handleStoreChange}
                            />
                        </div>
                    )
                }

            </div>

            <div className="header-right flex items-center">


                <Popover
                    className="user"
                    content={() => (
                        <Button onClick={handleLogout} icon={<GrLogout />}>
                            Logout
                        </Button>
                    )}
                    placement="bottomRight"
                >
                    <div className="flex items-center cursor-pointer">
                        <div className="user-info mr-2">
                            <div className="font-medium">{userInfo?.username}</div>
                        </div>
                        <div className="avatar">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-200 text-black font-bold">
                                A
                            </div>
                        </div>
                    </div>
                </Popover>
            </div>
        </div>
    );
};

export default AppHeader;
