import { Navigate, Route, Routes } from "react-router-dom";
import { PrivateLayout } from "./index.ts";
import { JWT_LOCAL_STORAGE_KEY } from "../config/constant";
import { NotFoundPage } from "../pages";
import appRoute from "../config/routes/appRoute.ts";

const AppLayout = () => {
    const token = localStorage.getItem(JWT_LOCAL_STORAGE_KEY);

    return (
        <Routes>
            {/* Routes không yêu cầu đăng nhập */}
            {Object.values(appRoute).map(({ path, component: Component, requiredLogin }) =>
                !requiredLogin ? (
                    <Route
                        key={path}
                        path={path}
                        element={token ? <Navigate to={appRoute.login.path} replace /> : <Component />}
                    />
                ) : null
            )}

            {/* Routes yêu cầu đăng nhập */}
            <Route element={<PrivateLayout />}>
                {Object.values(appRoute).map(({ path, component: Component, requiredLogin }) =>
                    requiredLogin ? (
                        <Route
                            key={path}
                            path={path}
                            element={token ? <Component /> : <Navigate to={appRoute.login.path} replace />}
                        />
                    ) : null
                )}
            </Route>

            {/* Trang không tìm thấy */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppLayout;
