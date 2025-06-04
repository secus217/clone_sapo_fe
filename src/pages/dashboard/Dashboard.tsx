import BusinessResults from "./BusinessResults.tsx";
import CharDashboard from "./CharDashboard.tsx";
import TopProducts from "./TopProducts.tsx";
import RecentOrders from "./RecentOrders.tsx";

const Dashboard = () => {
    return (
        <div className='grid gap-5'>
            <div>
                <BusinessResults/>
            </div>
            <div className="flex gap-4">
                <div className="w-[70%]">
                    <CharDashboard/>
                </div>
                <div className="w-[30%]">
                    <TopProducts/>
                </div>
            </div>
            <div>
                <RecentOrders/>
            </div>
        </div>
    )
}

export default Dashboard
