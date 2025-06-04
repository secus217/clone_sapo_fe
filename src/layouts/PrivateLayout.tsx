import React, {useEffect, useMemo, useState} from "react";
import type {MenuProps} from "antd";
import {Layout, Menu} from "antd";
import './index.css';
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {AppHeader} from "../components";
import { FaRegUser } from "react-icons/fa";
import { IoMdHome} from "react-icons/io";
import {useWindowSize} from "@uidotdev/usehooks";
import {MdSkipNext, MdSkipPrevious , MdOutlineLocalShipping ,MdOutlineWarehouse  } from "react-icons/md";
import { FiUsers } from "react-icons/fi";
import { GiBoxUnpacking } from "react-icons/gi";
import { RiCoinsLine } from "react-icons/ri";

const {Header, Content, Sider} = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const itemRoute = {
    "1": "/",
    "2": "/custumer",
    "3.1": "/createOrder",
    "3.2": "/orderList",
    // "4.1": "/addProduct",
    "4.2": "/product",
    "4.3": "/productType",
    "5" : '/fund',
    "6.1" :'/warehouseManagement',
    "6.2" : '/shop',
    "7" : '/staff'
}

const PrivateLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [desktopCollapsed, setDesktopCollapsed] = useState(false);
    const [activeKey, setActiveKey] = useState(["1"]);
    const [openKey, setOpenKey] = useState<any[] | undefined>(undefined);
    const navigate = useNavigate()
    //sync current route with menu
    const location = useLocation();
    const currentRoute = location.pathname;
    const storedStoreId = localStorage.getItem("selectedStore");
    const {width} = useWindowSize();

    const isTablet = useMemo(() => width && width < 992, [width]);

    useEffect(() => {
        if (isTablet) {
            setDesktopCollapsed(false)
        }
    }, [isTablet]);

    const items: MenuItem[] = [
        getItem("Trang chủs", "1", <IoMdHome size={25}/>),
        getItem("Khách hàng", "2", <FaRegUser size={25}/>),
        getItem("Nhân viên", "7", <FiUsers  size={25}/>),

        getItem("Đơn hàng", "3", <MdOutlineLocalShipping size={25}/>, [
            getItem("Tạo đơn hàng", "3.1"),
            getItem("Danh sách đơn hàng", "3.2"),
        ]),
        getItem("Sản Phẩm", "4", <GiBoxUnpacking size={25}/>, [
            // getItem("Tạo sản phẩm", "4.1"),
            getItem("Loại sản phẩm", "4.3"),
            getItem("Danh sách sản phẩm", "4.2"),
        ]),
        getItem("Sổ quỹ", "5", <RiCoinsLine  size={25}/>),

        getItem("Quản lý kho", "6", <MdOutlineWarehouse  size={25}/>, [
            getItem("Tồn kho", "6.1"),
            getItem("Cửa hàng" , "6.2")
        ])



    ];


    useEffect(() => {
        const currentKey = Object.keys(itemRoute).find(key => itemRoute[key as keyof typeof itemRoute] === currentRoute)
        if (currentKey) {
            if (currentKey.includes(".")) {
                const parentKey = currentKey.split(".")[0]
                setOpenKey([parentKey])
            }
            setActiveKey([currentKey])
        } else {
            setActiveKey(["0"])
        }
    }, [currentRoute]);

    return (
        <>
            <Layout hasSider className='app-layout'>
                <Sider
                    width={230}
                    breakpoint='lg'
                    collapsible
                    collapsedWidth={desktopCollapsed ? "80" : "0"}
                    collapsed={isTablet ? collapsed : desktopCollapsed}
                    onCollapse={() => setCollapsed(!collapsed)}
                    trigger={null}
                    style={{
                        transition: "0.3s",
                        display: collapsed ? "none" : "block",
                        overflow: "hidden",
                        height: "100vh",
                        position: "fixed",
                        zIndex: 2000,
                    }}
                >
                    <div className="logo-vertical" style={{
                        justifyContent: desktopCollapsed ? "center" : "space-between",
                    }}>{desktopCollapsed ? (
                        <button
                            className='toggle-menu-btn'
                            onClick={() => {
                                if (isTablet) {
                                    setCollapsed(!collapsed)
                                } else {
                                    setDesktopCollapsed(!desktopCollapsed);
                                }
                            }}
                        >
                            {desktopCollapsed ? <MdSkipNext/> : <MdSkipPrevious/>}
                        </button>
                    ) : (
                        <>
                            <img
                                onClick={() => {
                                    navigate("/")
                                }}
                                src='/imglogowhite.png'
                                alt="logo"
                                style={{
                                    width: 100,
                                    height: 100,
                                }}
                            />
                            <button
                                className='toggle-menu-btn'
                                onClick={() => {
                                    if (isTablet) {
                                        setCollapsed(!collapsed)
                                    } else {
                                        setDesktopCollapsed(!desktopCollapsed);
                                    }
                                }}
                            >
                                {desktopCollapsed ? <MdSkipNext/> : <MdSkipPrevious/>}
                            </button>
                        </>
                    )}
                    </div>
                    {storedStoreId && (
                        <Menu
                            theme="dark"
                            mode="inline"
                            defaultSelectedKeys={activeKey}
                            selectedKeys={activeKey}
                            openKeys={openKey}
                            items={items}
                            style={{
                                height: "100%",
                            }}
                            onSelect={(item) => {
                                setActiveKey([item.key as string]);
                                navigate(itemRoute[item.key as string as keyof typeof itemRoute])
                            }}
                            onOpenChange={(keys) => {
                                setOpenKey(keys as any)
                            }}
                            className="menu"
                        />
                    )}

                </Sider>
                <Layout
                    className="site-layout min-h-screen"
                    style={{
                        background: "#ebebeb",
                        marginLeft: isTablet ? 0 : (desktopCollapsed ? 80 : 200),
                        transition: "margin-left 0.3s"
                    }}
                    onClick={() => {
                        if (!collapsed && width && width < 992) {
                            setCollapsed(true)
                        }
                    }}
                >
                    <Header className="header">
                        <AppHeader collapsed={collapsed} setCollapsed={setCollapsed}/>
                    </Header>
                    <Content
                        style={{
                            marginLeft: 60,
                        }}>
                        <div style={{
                            paddingTop: 16,
                            paddingRight: 24,
                        }}>
                            <Outlet/>
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </>
    );

};

export default PrivateLayout;
