import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "../ui/select";
import { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";
import { MoveRight, Plus, Trash, Trash2, Trash2Icon } from "lucide-react";
import { Separator } from "../ui/separator";
import loadingGif from '../../assets/loading.gif'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "../ui/table";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { UserContext } from "@/context/UserProvider";
import AssignTaskForm from "../admin-view/AssignTaskForm";
import toast from "react-hot-toast";

const AuthSignup = () => {
    const { allUsers, fetchUsers } = useContext(UserContext);
    const [allCreatedUsers, setAllCreatedUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        if (allUsers) {
            setAllCreatedUsers(allUsers);
        }

    }, [allUsers]);


    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [nationalId, setNationalId] = useState("");
    const [department, setDepartment] = useState("");
    const [designation, setDesignation] = useState("");
    const [employeeType, setEmployeeType] = useState("");
    const [status, setStatus] = useState("");
    const [experience, setExperience] = useState("");
    const [salary, setSalary] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("https://employee-management-backend-sml6.onrender.com/api/auth/signup", {
                userName,
                email,
                password,
                fullName,
                phone,
                address,
                nationalId,
                department,
                designation,
                employeeType,
                status,
                experience,
                salary
            });

            if (res.data.success) {
                setUserName("");
                setEmail("");
                setPassword("");
                setFullName("");
                setPhone("");
                setAddress("");
                setNationalId("");
                setDepartment("");
                setDesignation("");
                setEmployeeType("");
                setStatus("");
                setExperience("");
                setSalary("");
                setSelectedUser(null);
                fetchUsers();
                toast.success('Employee created successfuly')
            }
        } catch (error) {
            console.log(error);
            toast.error('Employee with same username already exists!')
        }
    };


    const handleDelete = async (userId) => {
        try {
            const res = await axios.delete(`https://employee-management-backend-sml6.onrender.com/api/users/${userId}`)

            if (res.data.success) {
                setAllCreatedUsers((prevUsers) =>
                    prevUsers.filter((user) => user.empId !== userId)
                );
                toast.success('Employee deleted successfully');
                fetchUsers()
            } else {
                toast.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Delete Error:', error);
            toast.error('Something went wrong');
        }
    };

    const getTaskCounts = (tasks = []) => {
        const counts = { awaited: 0, submitted: 0, approved: 0, rejected: 0 };
        tasks.forEach(task => counts[task.status]++);
        return counts;
    };



    return (

        // Added this wrapping div with the gradient background
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 pb-20 px-6">
            {/* Create User FAB */}
            <Dialog>
                <DialogTrigger asChild>
                    <button className="z-1 flex fixed bottom-6 right-6 bg-purple-700 hover:bg-purple-800 text-white px-4 py-4 rounded-full shadow-lg transition duration-200">
                        Create New Employee &nbsp; <Plus />
                    </button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] overflow-auto w-[60vw] bg-white shadow-2xl rounded-2xl">
                    <div className="">
                        <div className="font-bold text-3xl pb-8  flex text-purple-800">
                            Create a new Employee
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {[
                                ["User Name", userName, setUserName, "text"],
                                ["Email", email, setEmail, "email"],
                                ["Password", password, setPassword, "password"],
                                ["Full Name", fullName, setFullName, "text"],
                                ["Phone", phone, setPhone, "text"],
                                ["Address", address, setAddress, "text"],
                                ["CNIC", nationalId, setNationalId, "text"],
                                ["Department", department, setDepartment, "text"],
                                ["Designation", designation, setDesignation, "text"],
                                ["Employee Type", employeeType, setEmployeeType, "select", ["Part Time", "Full Time", "Remote"]],
                                ["Status", status, setStatus, "select", ["Active", "Inactive"]],
                                ["Experience (Years)", experience, setExperience, "number"],
                                ["Salary", salary, setSalary, "number"]
                            ].map(([label, value, setValue, type, options]) => (
                                <div key={label}>
                                    <Label className='mb-1'>{label}</Label>
                                    {type === "select" ? (
                                        <Select value={value} onValueChange={setValue}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder={`Select ${label}`} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {options.map((opt) => (
                                                    <SelectItem key={opt} value={opt}>
                                                        {opt}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input
                                            type={type}
                                            value={value}
                                            onChange={(e) => setValue(e.target.value)}
                                            className="w-full rounded-lg"
                                            placeholder={`Enter ${label}`}
                                        />

                                    )}
                                </div>
                            ))}
                            <Button
                                className="mt-4 w-full bg-purple-700 hover:bg-purple-800"
                                type="submit"
                            >
                                Create Employee
                            </Button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Stats Cards */}

            <div className="text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent pt-8 pb-2 font-bold text-4xl sm:px-2 px-4 ">
                Welcome to Admin Dashboard
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 rounded-3xl py-4 mt-2 bg-white/45 shadow-sm">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl p-6 pb-9 shadow-lg">
                    <p className="text-lg font-semibold">Total Employees</p>
                    <h2 className="text-3xl font-bold mt-2">{allCreatedUsers?.length || 0}</h2>
                </div>

                <div className="bg-gradient-to-br from-purple-400 to-pink-500 text-white rounded-xl p-6 pb-9 shadow-lg">
                    <p className="text-lg font-semibold">Active Employees</p>
                    <h2 className="text-3xl font-bold mt-2">
                        {allCreatedUsers?.filter(
                            (u) => (u.status || "").toLowerCase() === "active"
                        ).length || 0}
                    </h2>
                </div>

                <div className="bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white rounded-xl p-6 pb-9 shadow-lg">
                    <p className="text-lg font-semibold">Total Salary</p>
                    <h2 className="text-3xl font-bold mt-2">
                        Rs.{" "}
                        {allCreatedUsers
                            ?.reduce((acc, curr) => acc + Number(curr.salary || 0), 0)
                            .toLocaleString()}
                    </h2>
                </div>

                <div className="bg-gradient-to-br from-violet-500 to-purple-700 text-white rounded-xl p-6 pb-9 shadow-lg">
                    <p className="text-lg font-semibold">Departments</p>
                    <h2 className="text-3xl font-bold mt-2">
                        {
                            [...new Set(allCreatedUsers?.map((u) => u.department).filter(Boolean))]
                                .length || 0
                        }
                    </h2>
                </div>
            </div>
            <Separator />

            {/* Employees Table */}
            <div className="text-purple-900 font-semibold sm:px-12 px-4 pt-6 text-xl pb-4">
                All Employees
            </div>


            <div className=" bg-white/50 p-1 rounded-xl">
                <Table className="rounded-xl border border-purple-200 overflow-hidden shadow-md">
                    <TableHeader className="bg-purple-100">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tasks</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Details</TableHead>
                            <TableHead>Actions</TableHead>
                            <TableHead className='sr-only'>Delete User</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>



                        {allCreatedUsers && allCreatedUsers.length > 0 ? (
                            allCreatedUsers.map((user) => {

                                const { awaited, submitted, approved, rejected } = getTaskCounts(user.tasks);
                                return <TableRow
                                    key={user._id}
                                    className="even:bg-purple-50 hover:bg-purple-50 transition duration-150"
                                >
                                    <TableCell>{user.fullName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell ><button className={`${user.status.toLowerCase() == 'active' ? 'bg-green-500 text-white rounded-full px-3 py-1' : 'bg-red-500 rounded-full text-white px-3 py-1'}`}>{user.status}</button></TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm text-purple-700 font-medium">
                                            <span className="text-yellow-500">🟡 Awaited: {awaited}</span>
                                            <span className="text-blue-600">🔵 Submitted: {submitted}</span>
                                            <span className="text-green-500">🟢 Approved: {approved}</span>
                                            <span className="text-red-600">🔴 Rejected: {rejected}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>
                                        {user.createdAt
                                            ? new Date(user.createdAt).toLocaleDateString()
                                            : "N / A"}
                                    </TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    className="bg-purple-100 border-purple-400 text-purple-800 hover:bg-purple-200"
                                                    variant="outline"
                                                    onClick={() => setSelectedUser(user)}
                                                >
                                                    View <MoveRight />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="overflow-auto max-h-[95vh]">
                                                {selectedUser ? (
                                                    <div className="space-y-2">
                                                        <p className="text-lg font-semibold mb-2 text-purple-800">
                                                            Employee Details
                                                        </p>
                                                        <Separator />
                                                        <p><strong>User Name:</strong> {selectedUser.userName}</p>
                                                        <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
                                                        <p><strong>Email:</strong> {selectedUser.email}</p>
                                                        <p><strong>Phone:</strong> {selectedUser.phone}</p>
                                                        <p><strong>Address:</strong> {selectedUser.address}</p>
                                                        <p><strong>CNIC:</strong> {selectedUser.nationalId}</p>
                                                        <p><strong>Department:</strong> {selectedUser.department}</p>
                                                        <p><strong>Designation:</strong> {selectedUser.designation}</p>
                                                        <p><strong>Employee Type:</strong> {selectedUser.employeeType}</p>
                                                        <p><strong>Status:</strong> {selectedUser.status}</p>
                                                        <p><strong>Experience:</strong> {selectedUser.experience} years</p>
                                                        <p><strong>Salary:</strong> Rs. {selectedUser.salary}</p>
                                                        <p><strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
                                                        <div className="flex flex-col text-sm text-purple-700 font-medium">
                                                            <span className="text-yellow-500">🟡 Awaited Tasks: {awaited}</span>
                                                            <span className="text-blue-600">🔵 Submitted Tasks: {submitted}</span>
                                                            <span className="text-green-500">🟢 Approved Tasks: {approved}</span>
                                                            <span className="text-red-600">🔴 Rejected Tasks: {rejected}</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <p className="text-lg">No Employee Selected</p>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                    <TableCell>
                                        <Dialog className='overflow-y-auto '>
                                            <DialogTrigger asChild>
                                                <Button
                                                    className="bg-purple-100 border-purple-400 text-purple-800 hover:bg-purple-200"
                                                    variant="outline"
                                                    onClick={() => setSelectedUser(user)}
                                                >
                                                    Assign Task <MoveRight />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className='overflow-y-auto max-h-[95vh]'>
                                                <AssignTaskForm
                                                    userId={user._id}
                                                    onSuccess={fetchUsers}
                                                    allAssignedTasks={selectedUser?.tasks}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                    <TableCell>
                                        <button onClick={() => handleDelete(user.empId)}><Trash2Icon className="bg-transparent border-1 border-transparent text-red-600" /></button>
                                    </TableCell>
                                </TableRow>
                            })
                        ) : (
                            <p className="text-center flex text-gray-600 text-2xl mt-10"> {allCreatedUsers?.length > 0 ? <center><img src={loadingGif} className='w-7 h-7 mr-4' alt="" /></center> : ''}{allCreatedUsers?.length > 0 ? 'Loading Employees...' : 'No Employees Added yet!'}</p>
                        )}
                    </TableBody>
                </Table>
            </div>

        </div>
    );
};

export default AuthSignup;