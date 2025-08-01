// components/AssignTaskForm.jsx
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { Trash2 } from 'lucide-react';
import toast from "react-hot-toast";


const statusOptions = ["all", "awaited", "submitted", "approved", "rejected"];


const AssignTaskForm = ({ userId, onSuccess, allAssignedTasks }) => {

  const [filterStatus, setFilterStatus] = useState("all");


  const [assignedTasks, setAssignedTasks] = useState(allAssignedTasks)
  console.log('alltasks', assignedTasks)

  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("awaited");
  const [loading, setLoading] = useState(false);
  const [lastDate, setLastDate] = useState("");


  const handleAssign = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`https://employee-management-backend-sml6.onrender.com/api/task/assign/${userId}`, {
        description,
        status,
        lastDate
      });

      if (res.data.success) {
        const newTask = res.data.user.tasks;
        setDescription("");
        setStatus("awaited");
        onSuccess();
        setAssignedTasks(newTask)
        toast.success('Task Assigned Successfully')

      }
    } catch (error) {
      console.error("Task assignment failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await axios.put(`https://employee-management-backend-sml6.onrender.com/api/task/update/${userId}/${taskId}`, {
        status: newStatus
      })


      // update local state
      setAssignedTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );
      toast.success("Status updated");
      onSuccess()

    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteTask = async (userId, taskId) => {
    try {
      const res = await axios.delete(`https://employee-management-backend-sml6.onrender.com/api/task/delete/${userId}/${taskId}`);
      if (res.data.success) {
        console.log('task deleted')
        toast.success('Task deleted');
        onSuccess()
        setAssignedTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      }
      // update UI
    } catch (err) {
      toast.error('Failed to delete task');
      console.error('Delete task error:', err);
    }
  };


  const filteredTasks = filterStatus === "all"
  ? assignedTasks
  : assignedTasks.filter(task => task.status === filterStatus);






  return (
    <div>

      <form onSubmit={handleAssign} className="space-y-4">
        <div className="">
          <Label className='mt-9 mb-2'>Task Description</Label>
          <Input
            type="text"
            required
            placeholder="Enter task details"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          {/* <Label className='mb-2'>Status</Label>
          <select
            className="w-full p-2 border rounded-md"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select> */}
        </div>
        <div>
          <Label className='mb-2'>Deadline</Label>
          <Input
            type="datetime-local"
            required
            value={lastDate}
            onChange={(e) => setLastDate(e.target.value)}
          />
          {/* <input
            type="date"
            required
            value={lastDate}
            onChange={(e) =>
              setAssignedTasks({ ...task, lastDate: e.target.value })
            }
          /> */}

        </div>
        <Button className='w-full' type="submit" disabled={loading}>
          {loading ? "Assigning..." : "Assign Task"}
        </Button>
      </form>


{/* --- Filter Controls --- */}
<div className="mt-6 mb-4">
  <p className="font-semibold text-purple-800 mb-2">Filter by Status:</p>
  <div className="flex gap-2 flex-wrap">
    {statusOptions.map((status) => (
      <button
        key={status}
        onClick={() => setFilterStatus(status)}
        className={`px-3 py-1 rounded-full border text-sm font-medium
          ${filterStatus === status
            ? "bg-purple-600 text-white border-purple-700 shadow"
            : "bg-white text-purple-700 border-purple-300 hover:bg-purple-100"}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </button>
    ))}
  </div>
</div>
        {
          filteredTasks && filteredTasks.length > 0 ? filteredTasks.map((task) => {
              const isPastDeadline = new Date() > new Date(task.lastDate);
              const isActionDisabled = isPastDeadline;

              return (
                <div
                  key={task._id}
                  className={`flex items-center justify-between mb-3 p-4 border rounded-md shadow-sm ${isPastDeadline ? "bg-gray-100 opacity-70 cursor-not-allowed" : "bg-white"
                    }`}
                >
                  <div>
                    <p className="font-semibold">{task.description}</p>
                    <p
                      className={`font-semibold ${task.status === "approved"
                        ? "text-green-600 "
                        : task.status === "submitted"
                          ? "text-blue-600"
                          : task.status === "rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                    >
                      Status: {task.status}
                    </p>
                    {task.status.toLowerCase() == 'submitted' && <div>
                      <span className=" flex"><strong className="text-gray-700">Submission: </strong><a href={task.submissionLink} className="text-blue-600 underline" target='_blank'> {task.submissionLink}</a></span>
                    </div>}
                    <p className="text-sm text-gray-500">
                      Assigned on: {new Date(task.createdAt).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Deadline: {new Date(task.lastDate).toLocaleString()}
                    </p>

                    {isPastDeadline && (task.status === "awaited" || task.status === "rejected") && (
                      <p className="text-sm text-red-500 mt-1 font-medium">
                        ⛔ Deadline Passed — Auto Rejected
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {task.status.toLowerCase() == 'submitted' || task.status.toLowerCase() == 'approved' || task.status.toLowerCase() == 'rejected' ?
                      <select
                        value={task.status || ""}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        disabled={isPastDeadline}
                        className={`p-1 border rounded ${isPastDeadline ? "bg-gray-200 text-gray-500" : ""
                          }`}
                      >
                        <option>Change Status</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      : <p className="text-center text-sm p-2 text-gray-600 border rounded-3xl cursor-pointer" title='once submitted by employee, you will have option to either approve or reject the task'>Not submitted yet!</p>
                    }

                    <button
                      onClick={() => handleDeleteTask(userId, task._id)}
                      className={`text-red-500 hover:text-red-700 ${isPastDeadline ? "pointer-events-none opacity-50" : ""
                        }`}
                      disabled={isPastDeadline}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })

            : <div className="mt-4">No tasks assigned yet</div>
        }
      </div>



  );
};

export default AssignTaskForm;
