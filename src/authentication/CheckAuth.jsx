import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({isAuthenticated, user, children}) {

    const location = useLocation();

    if(!isAuthenticated && 
        !(location.pathname.includes('/login'))
    )
    {
        return <Navigate to='/auth/login'/>
    }

    if(isAuthenticated && 
        (location.pathname.includes('/auth') || location.pathname.includes('/auth/login') || location.pathname.includes('/auth/signup'))
    )
    {
        if(user?.role === 'admin'){
            return <Navigate to='/admin/dashboard'/>
        }
        else{
            return <Navigate to='/employee/home'/>   
        }
    }
    if(isAuthenticated && user?.role !== 'admin' && location.pathname.includes('/admin'))
    {
        return <Navigate to='/unauth-page'/>
    }

    if(isAuthenticated && user?.role === 'admin' && location.pathname.includes('/employee'))
    {
        return <Navigate to='/admin/dashboard'/>
    }

    return ( 
        <>{children}</>
     );
}

export default CheckAuth;