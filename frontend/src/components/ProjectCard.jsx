import { useEffect, useState } from "react";
import api from "../services/api";
import TaskCard from "./TaskCard";

export default function ProjectCard({ project, members, currentUser }) {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);

  const [newTask, setNewTask] = useState({
    title: "",
    assignedTo: "",
    status: "todo",
  });

  const loadTasks = async () => {
    const res = await api.get(`/tasks/${project._id}`);
    setTasks(res.data);
  };

  const toggle = async () => {
    if (!open) await loadTasks();
    setOpen(!open);
  };

  const addTask = async () => {
    if (!newTask.title || !newTask.assignedTo) return;

    await api.post("/tasks", {
      ...newTask,
      project: project._id,
    });

    setNewTask({ title: "", assignedTo: "", status: "todo" });
    loadTasks();
  };

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">{project.title}</h3>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <button
          onClick={toggle}
          className="text-blue-600 hover:underline"
        >
          {open ? "Hide Tasks" : "View Tasks"}
        </button>
      </div>

      {open && (
        <div className="mt-4">
          {/* TASK LIST */}
          {
            tasks.filter(task => {
  const assignedId =
    typeof task.assignedTo === "object"
      ? task.assignedTo._id
      : task.assignedTo;

  return currentUser.role === "admin" || assignedId === currentUser._id;
})

            .map(task => (
              <TaskCard
                key={task._id}
                task={task}
                reload={loadTasks}
                currentUser={currentUser}
              />
            ))}

          {/* ADD TASK (ADMIN ONLY) */}
          {currentUser.role === "admin" && (
            <div className="mt-4 flex gap-2">
              <input
                className="border p-2 rounded flex-1"
                placeholder="Task title"
                value={newTask.title}
                onChange={e =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
              />

              <select
                className="border p-2 rounded"
                value={newTask.assignedTo}
                onChange={e =>
                  setNewTask({ ...newTask, assignedTo: e.target.value })
                }
              >
                <option value="">Assign to</option>
                {members.map(m => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>

              <button
                onClick={addTask}
                className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
              >
                Add
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
