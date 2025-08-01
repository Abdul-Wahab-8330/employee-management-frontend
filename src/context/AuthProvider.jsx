import { createContext, useEffect, useState } from "react"
import loadingGif from '../assets/loading.gif'


export const authContext = createContext()




const AuthProvider = ({ children }) => {


    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const userData = localStorage.getItem('user')

        try {
            if (token && userData) {
                setIsAuthenticated(true)
                const user = JSON.parse(userData)
                setUser(user)
            } else {
                setIsAuthenticated(false)
                setUser({})
            }
        } catch (error) {
            console.log(error)
        }

        setLoading(false)

    }, [])

    if(loading){
        return <div className="bg-black text-white mt-60 font-bold text-center"><center><img src={loadingGif} className="w-9 h-9 " alt="" /></center>Loading...</div>
    } 


    return (
        <authContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
            {children}
        </authContext.Provider>
    )
}

export default AuthProvider
