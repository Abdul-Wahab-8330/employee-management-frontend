import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserProvider';
import loadingGif from '../../assets/loading.gif'
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowRightCircle, MoveRight } from 'lucide-react';
import TaskChartCard from '../../components/emp-view/TaskChartCard';

const EmployeeDashboard = () => {
    const { allUsers } = useContext(UserContext);
    const [employee, setEmployee] = useState(null);

    const [taskFilter, setTaskFilter] = useState("all");


    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser && allUsers.length > 0) {
            const currentUser = allUsers.find(u => u._id === loggedInUser.empId);
            setEmployee(currentUser);
        }
    }, [allUsers]);

    if (!employee) return <p className="text-center text-gray-600 mt-60"> <center><img src={loadingGif} className='w-7 h-7' alt="" /></center> Loading your dashboard...</p>;



    const filteredTasks = taskFilter === "all"
        ? employee.tasks
        : employee.tasks.filter(t => t.status?.toLowerCase() === taskFilter);

    const groupedTasks = {
        awaited: filteredTasks.filter(t => t.status?.toLowerCase() === 'awaited'),
        submitted: filteredTasks.filter(t => t.status?.toLowerCase() === 'submitted'),
        approved: filteredTasks.filter(t => t.status?.toLowerCase() === 'approved'),
        rejected: filteredTasks.filter(t => t.status?.toLowerCase() === 'rejected'),
    };


    const isPastDeadline = (task) => new Date(task.lastDate) < new Date();



    const renderTasks = (tasks, label) => {
        const now = new Date();

        return (
            <div>
                <h3 className="text-xl font-semibold text-purple-700 mb-2">
                    {label} ({tasks.length})
                </h3>
                <div className={`grid md:grid-cols-1 lg:grid-cols-2 gap-4 mb-6 ${tasks.length > 0 ? 'bg-fuchsia-50 shadow-sm' : ''}  rounded-3xl px-4 py-5`}>
                    {tasks.map((task, index) => {
                        const dueDate = new Date(task.lastDate);
                        const hoursLeft = Math.round((dueDate - now) / (1000 * 60 * 60));
                        const isDueSoon = task.status.toLowerCase() === 'awaited' && dueDate > now && hoursLeft <= 24;

                        return (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500 hover:shadow-lg transition duration-200 max-w-full"
                            >
                                <p className="text-gray-700 text-lg font-medium"><strong className='text-purple-800'>Task: </strong>{task.description}</p>

                                {/* Show red notice for rejected tasks if deadline not yet passed */}
                                {task.status === "rejected" && dueDate > now && (
                                    <p className="text-sm text-red-600 font-semibold mt-1 flex flex-col">
                                        <span className='text-sm text-red-600 font-semibold mt-1'>🔴 Rejected by Admin</span>
                                        ⏰ Auto rejecting in {hoursLeft} hour{hoursLeft !== 1 ? "s" : ""}
                                    </p>
                                )}

                                {/* Keep showing due soon warning for others */}
                                {task.status !== "rejected" && isDueSoon && (
                                    <p className="text-sm text-orange-600 font-semibold py-2">
                                        ⚠️ Due in {hoursLeft == 0 ? 'less than 1' : hoursLeft} hour{hoursLeft !== 1 && hoursLeft !== 0 ? "s" : ""}
                                    </p>
                                )}

                                <p className="text-sm text-gray-700 mt-1">
                                    deadline: <span className="font-medium">{dueDate.toLocaleString()}</span>
                                </p>

                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-sm px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                                        {task.status?.toUpperCase()}
                                    </span>

                                </div>

                                {/* ✅ Add submission input if task is awaited and not expired */}
                                {task.status === "awaited" && !isPastDeadline(task) && (
                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            const link = e.target.elements[`link-${task._id}`].value;
                                            if (!link) return;

                                            try {
                                                const res = await axios.put(`https://employee-management-backend-sml6.onrender.com/api/task/submit/${employee.empId}/${task._id}`, {
                                                    submissionLink: link,
                                                });

                                                if (res.data.success) {
                                                    toast.success('Submitted successfully')
                                                    // ✅ Update employee state immutably
                                                    setEmployee(prev => ({
                                                        ...prev,
                                                        tasks: prev.tasks.map(t =>
                                                            t._id === task._id
                                                                ? { ...t, status: 'submitted', submissionLink: link }
                                                                : t
                                                        )
                                                    }));
                                                }

                                            } catch (err) {
                                                console.error("Submission error:", err);
                                            }
                                        }}
                                        className="mt-4 flex gap-2"
                                    >
                                        {/* <label>Enter Submission Link</label> */}

                                        <input
                                            type="url"
                                            name={`link-${task._id}`}
                                            placeholder="Enter submission link"
                                            required
                                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                                        >
                                            Submit
                                        </button>
                                    </form>
                                )}
                                <div>
                                    <p className="text-sm text-gray-500 mt-5 text-end">
                                        Assigned At: {new Date(task.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    //----

    const now = new Date();
    const dueIn24Hours = employee.tasks.filter(task => {
        const dueDate = new Date(task.lastDate);
        const hoursLeft = (dueDate - now) / (1000 * 60 * 60);
        return task.status === 'awaited' && dueDate > now && hoursLeft <= 24;
    });




    return (
        <div className="md:px-6 px-4 py-8 bg-gradient-to-br from-purple-50 to-purple-100 min-h-screen max-w-full">
            <h2 className="md:text-3xl text-2xl font-bold text-purple-800 mb-5 md:px-4 px-1">Welcome to Employee Dashboard 👋 '{employee.fullName}'</h2>

            {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 bg-white py-4 px-4 rounded-3xl shadow-sm">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-600 text-white p-6 rounded-lg shadow text-center">
                    <p className="text-lg font-semibold">Total Tasks</p>
                    <h4 className="text-xl font-bold">{employee.tasks.length}</h4>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white p-6 rounded-lg shadow text-center">
                    <p className="text-lg font-semibold">Awaited</p>
                    <h4 className="text-xl font-bold">{groupedTasks.awaited.length}</h4>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-lg shadow text-center">
                    <p className="text-lg font-semibold">Submitted</p>
                    <h4 className="text-xl font-bold">{groupedTasks.submitted.length}</h4>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-500 text-white p-6 rounded-lg shadow text-center">
                    <p className="text-lg font-semibold">Approved</p>
                    <h4 className="text-xl font-bold">{groupedTasks.approved.length}</h4>
                </div>
                <div className="bg-gradient-to-br from-red-600 to-red-500 text-white p-6 rounded-lg shadow text-center">
                    <p className="text-lg font-semibold">Rejected</p>
                    <h4 className="text-xl font-bold">{groupedTasks.rejected.length}</h4>
                </div>
            </div> */}



            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white py-4 px-4 rounded-3xl shadow-sm items-start">
                {/* Chart - takes 1st column on md and full width on mobile */}
                <div>
                    <TaskChartCard tasks={employee.tasks} />
                </div>

                {/* Cards for larger screens (2nd column) */}
                <div className="hidden md:grid gap-4">
                    <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white py-7 px-3 rounded-lg shadow text-center text-sm">
                        <p className="font-semibold">Awaited</p>
                        <h4 className="text-lg font-bold">{groupedTasks.awaited.length}</h4>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-7 px-3 rounded-lg shadow text-center text-sm">
                        <p className="font-semibold">Submitted</p>
                        <h4 className="text-lg font-bold">{groupedTasks.submitted.length}</h4>
                    </div>
                </div>

                {/* Cards for larger screens (3rd column) */}
                <div className="hidden md:grid gap-4">
                    <div className="bg-gradient-to-br from-green-600 to-green-500 text-white py-7 px-3 rounded-lg shadow text-center text-sm">
                        <p className="font-semibold">Approved</p>
                        <h4 className="text-lg font-bold">{groupedTasks.approved.length}</h4>
                    </div>
                    <div className="bg-gradient-to-br from-red-600 to-red-500 text-white py-7 px-3 rounded-lg shadow text-center text-sm">
                        <p className="font-semibold">Rejected</p>
                        <h4 className="text-lg font-bold">{groupedTasks.rejected.length}</h4>
                    </div>
                </div>

                {/* Cards for mobile: shows only on small screens */}
                <div className="md:hidden grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white py-7 px-3 rounded-lg shadow text-center text-sm">
                        <p className="font-semibold">Awaited</p>
                        <h4 className="text-lg font-bold">{groupedTasks.awaited.length}</h4>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-7 px-3 rounded-lg shadow text-center text-sm">
                        <p className="font-semibold">Submitted</p>
                        <h4 className="text-lg font-bold">{groupedTasks.submitted.length}</h4>
                    </div>
                    <div className="bg-gradient-to-br from-green-600 to-green-500 text-white py-7 px-3 rounded-lg shadow text-center text-sm">
                        <p className="font-semibold">Approved</p>
                        <h4 className="text-lg font-bold">{groupedTasks.approved.length}</h4>
                    </div>
                    <div className="bg-gradient-to-br from-red-600 to-red-500 text-white py-7 px-3 rounded-lg shadow text-center text-sm">
                        <p className="font-semibold">Rejected</p>
                        <h4 className="text-lg font-bold">{groupedTasks.rejected.length}</h4>
                    </div>
                </div>
            </div>




            {dueIn24Hours.length > 0 && (
                <div className="mb-8 bg-red-100 px-4 rounded-3xl py-4">
                    <span className="md:text-2xl text-xl font-bold text-red-600">⚠️ Tasks Due in 24 Hours ({dueIn24Hours.length})</span>
                    <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4 mt-2 max-w-full">
                        {dueIn24Hours.map((task, index) => {
                            const dueDate = new Date(task.lastDate);
                            const hoursLeft = Math.round((dueDate - now) / (1000 * 60 * 60));

                            return (
                                <div key={index} className="bg-white border-l-4 w-full border-red-600 rounded-xl shadow-sm transition-shadow hover:shadow-md p-4 ">
                                    <p className="text-gray-700 text-lg font-semibold"><span className='font-bold text-purple-600'>Task:</span> {task.description}</p>
                                    <p className="text-sm text-red-500 font-medium py-2">⏰ Due in {hoursLeft == 0 ? 'less than 1' : hoursLeft} hour{hoursLeft !== 1 && hoursLeft !== 0 ? "s" : ""}</p>
                                    <p className="text-sm text-gray-700 mt-1">Deadline: {dueDate.toLocaleString()}</p>
                                    <span className="text-sm mt-2 inline-block px-2 py-1 bg-red-100 text-red-600 rounded-full">
                                        {task.status.toUpperCase()}
                                    </span>

                                    {task.status === "awaited" && !isPastDeadline(task) && (
                                        <form
                                            onSubmit={async (e) => {
                                                e.preventDefault();
                                                const link = e.target.elements[`link-${task._id}`].value;
                                                if (!link) return;

                                                try {
                                                    const res = await axios.put(`https://employee-management-backend-sml6.onrender.com/api/task/submit/${employee.empId}/${task._id}`, {
                                                        submissionLink: link,
                                                    });

                                                    if (res.data.success) {
                                                        toast.success('Submitted successfully')
                                                        // ✅ Update employee state immutably
                                                        setEmployee(prev => ({
                                                            ...prev,
                                                            tasks: prev.tasks.map(t =>
                                                                t._id === task._id
                                                                    ? { ...t, status: 'submitted', submissionLink: link }
                                                                    : t
                                                            )
                                                        }));
                                                    }

                                                } catch (err) {
                                                    console.error("Submission error:", err);
                                                }
                                            }}
                                            className="mt-4 flex gap-2"
                                        >

                                            <div className="flex flex-col md:flex-row gap-2 w-full">
                                                <input
                                                    type="url"
                                                    name={`link-${task._id}`}
                                                    placeholder="Enter submission link"
                                                    required
                                                    className="flex-1 px-2 py-1 border border-gray-400 rounded text-sm"
                                                />
                                                <button
                                                    type="submit"
                                                    className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                                                >
                                                    Submit
                                                </button>
                                            </div>

                                        </form>
                                    )}
                                    <p className="text-sm text-end text-gray-500 mt-3">
                                        Assigned At: {new Date(task.createdAt).toLocaleString()}
                                    </p>
                                </div>


                            );
                        })}
                    </div>
                </div>
            )}

            <div className="flex flex-wrap justify-center gap-3 mb-6">
                {["all", "awaited", "submitted", "approved", "rejected"].map(status => {
                    const isActive = taskFilter === status;
                    return (
                        <button
                            key={status}
                            onClick={() => setTaskFilter(status)}
                            className={`px-4 py-2 rounded-full border font-medium transition 
          ${isActive
                                    ? "bg-purple-600 text-white border-purple-700 shadow"
                                    : "bg-white text-purple-700 border-purple-300 hover:bg-purple-100"}
        `}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    );
                })}
            </div>



            {/* Sections */}
            {renderTasks(groupedTasks.awaited, 'Awaited')}
            {renderTasks(groupedTasks.submitted, 'Submitted')}
            {renderTasks(groupedTasks.approved, 'Approved')}
            {renderTasks(groupedTasks.rejected, 'Rejected')}

        </div>
    );
};

export default EmployeeDashboard;
