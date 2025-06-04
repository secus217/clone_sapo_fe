import {QueryClient, QueryClientProvider} from "react-query";
import {BrowserRouter as Router} from 'react-router-dom';
import {Toaster} from "react-hot-toast";
import {AppLayout} from "./layouts";
import {Suspense, useEffect} from "react";
import {Spin} from "antd";
import upstashService from "./api/config/upstashService.ts";
import {useUserInfo} from "./config/states/user";


const queryClient = new QueryClient()

function App() {
    const{setUserInfo} = useUserInfo()
    const fetchtUser = async () => {
        const res = await upstashService.getme()
        console.log('fetchUser',res)
        setUserInfo(res)
    }

    useEffect(() => {
        fetchtUser()
    }, [])
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Router>
                    <Suspense fallback={<Spin/>}>
                        <AppLayout/>
                    </Suspense>
                </Router>
            </QueryClientProvider>
            <Toaster/>
        </>
    )
}

export default App
