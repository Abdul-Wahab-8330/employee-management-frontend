import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useContext, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { authContext } from "@/context/AuthProvider";
import toast from "react-hot-toast";

const AuthLogin = () => {
    const { setIsAuthenticated, setUser } = useContext(authContext);
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                userName, password
            });
            if (res.data.success) {
                setUserName('');
                setPassword('');
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                setIsAuthenticated(true);
                setUser(res.data.user);
                toast.success('LoggedIn successfully')
            }
        } catch (error) {
            console.log(error);
            toast.error('Username or Password is incorrect')
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white/60 backdrop-blur-sm shadow-xl border border-purple-200 rounded-3xl px-8 py-10 space-y-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-purple-800">Welcome Back 👋</h1>
                <p className="text-sm text-purple-600 mt-2">Please enter your credentials to login</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <Label className="text-purple-700 mb-2">Username</Label>
                    <Input
                        value={userName}
                        type="text"
                        required
                        placeholder="Enter username"
                        onChange={(e) => setUserName(e.target.value)}
                        className="focus:border-purple-500 focus:ring-purple-500"
                    />
                </div>
                <div>
                    <Label className="text-purple-700 mb-2">Password</Label>
                    <Input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        required
                        placeholder="Enter password"
                        className="focus:border-purple-500 focus:ring-purple-500"
                    />
                </div>
                <Button className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold transition duration-300" type="submit">
                    Login
                </Button>
            </form>
        </div>
    );
};

export default AuthLogin;
