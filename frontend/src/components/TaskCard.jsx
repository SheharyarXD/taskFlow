import api from "../services/api";

export default function TaskCard({ task, reload, currentUser }) {
  const nextStatus = {
    todo: "in-progress",
    "in-progress": "done",
    done: "done",
  };

  // 🔥 normalize assignedTo
  const assignedUserId =
    typeof task.assignedTo === "object"
      ? task.assignedTo._id
      : task.assignedTo;

  const canUpdate =
    currentUser.role === "admin" ||
    assignedUserId === currentUser._id;

  const updateStatus = async () => {
    await api.patch(`/tasks/${task._id}/status`, {
      status: nextStatus[task.status],
    });
    reload();
  };

  return (
    <div className="flex justify-between items-center bg-gray-100 p-3 rounded mb-2">
      <div>
        <p className="font-semibold">{task.title}</p>
        <p className="text-sm text-gray-500 capitalize">{task.status}</p>
      </div>

      {canUpdate && (
        <button
          onClick={updateStatus}
          disabled={task.status === "done"}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          Next
        </button>
      )}
    </div>
  );
}
