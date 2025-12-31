import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/authContext";
import ProjectCard from "../components/ProjectCard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, authLoading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
  });

  /* ---------- PROTECT ---------- */
  if (authLoading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) {
    navigate("/login");
    return null;
  }

  /* ---------- FETCH PROJECTS ---------- */
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/projects");

      if (user.role === "admin") {
        setProjects(res.data);
        setLoading(false);
        return;
      }

      const filtered = [];
      for (const project of res.data) {
        const taskRes = await api.get(`/tasks/${project._id}`);
        const hasMyTask = taskRes.data.some(
          (task) => task.assignedTo?.toString() === user._id
        );
        if (hasMyTask) filtered.push(project);
      }

      setProjects(filtered);
      setLoading(false);
    } catch {
      setLoading(false);
    }
  };

  /* ---------- FETCH MEMBERS ---------- */
  const fetchMembers = async () => {
    try {
      const res = await api.get("/users");
      setMembers(res.data);
    } catch {}
  };

  /* ---------- ADD PROJECT ---------- */
  const addProject = async () => {
    if (!newProject.title) return;
    await api.post("/projects", newProject);
    setNewProject({ title: "", description: "" });
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
    if (user.role === "admin") fetchMembers();
  }, [user]);

  /* ---------- LOGOUT ---------- */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-slate-100">
      {/* NAVBAR */}
      <div className="flex justify-between items-center px-8 py-4 bg-white border-b">
        <h1 className="text-2xl font-extrabold text-indigo-600">TeamFlow</h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-600 text-sm">
            {user.name} • {user.role}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* TABS */}
        <div className="flex gap-6 border-b mb-6">
          {["overview", "projects", "tasks"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 font-medium capitalize transition ${
                activeTab === tab
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ---------- OVERVIEW TAB ---------- */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-3 gap-6">
            <StatCard title="Total Projects" value={projects.length} />
            <StatCard title="Team Members" value={members.length || 1} />
            <StatCard title="Role" value={user.role.toUpperCase()} />
          </div>
        )}

        {/* ---------- PROJECTS TAB ---------- */}
        {activeTab === "projects" && (
          <>
            {user.role === "admin" && (
              <div className="bg-white p-5 rounded-xl shadow mb-6">
                <h2 className="font-bold mb-3">Create New Project</h2>
                <input
                  className="border p-3 rounded w-full mb-2"
                  placeholder="Project title"
                  value={newProject.title}
                  onChange={(e) =>
                    setNewProject({ ...newProject, title: e.target.value })
                  }
                />
                <textarea
                  className="border p-3 rounded w-full mb-3"
                  placeholder="Project description"
                  value={newProject.description}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      description: e.target.value,
                    })
                  }
                />
                <button
                  onClick={addProject}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                >
                  Add Project
                </button>
              </div>
            )}

            {loading ? (
              <p className="text-center">Loading projects...</p>
            ) : projects.length === 0 ? (
              <p className="text-center text-slate-500">
                No projects assigned.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <ProjectCard
                    key={project._id}
                    project={project}
                    members={members}
                    currentUser={user}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* ---------- TASKS TAB (FAKE BUT CLEAN) ---------- */}
        {activeTab === "tasks" && (
  <div className="bg-white rounded-2xl shadow-2xl p-10 text-center relative overflow-hidden">
    {/* Floating Gradient Shapes */}
    <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-300/30 rounded-full -translate-x-1/2 -translate-y-1/2 animate-blob"></div>
    <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-300/30 rounded-full translate-x-1/2 translate-y-1/2 animate-blob animation-delay-2000"></div>

    <h2 className="text-2xl md:text-3xl font-extrabold mb-3 text-indigo-600">
      Tasks Overview
    </h2>
    <p className="text-slate-500 mb-6">
      Track your team's productivity in real-time 🚀
    </p>

    {/* Stat Cards */}
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <StatCardAnimated title="To Do" value={42} color="bg-indigo-500" />
      <StatCardAnimated title="In Progress" value={17} color="bg-yellow-500" />
      <StatCardAnimated title="Completed" value={128} color="bg-green-500" />
    </div>

    {/* Chart Section */}
    <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
      <h3 className="text-lg font-bold mb-4 text-indigo-600">Weekly Task Progress</h3>
      <div className="h-64">
        <canvas id="tasksChart"></canvas>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}

/* ---------- Animated Stat Card ---------- */
function StatCardAnimated({ title, value, color }) {
  const cardRef = useRef();

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className={`rounded-xl p-6 text-white shadow-lg flex flex-col items-center justify-center ${color}`}
    >
      <p className="text-sm mb-2">{title}</p>
      <h3 className="text-3xl font-bold">{value}</h3>
    </div>
  );
}

/* ---------- GSAP Animations for Floating Shapes ---------- */
<style>
{`
@keyframes blob {
  0%, 100% { transform: translate(0,0) scale(1); }
  33% { transform: translate(20px,-30px) scale(1.1); }
  66% { transform: translate(-20px,20px) scale(0.9); }
}
.animate-blob { animation: blob 8s infinite; }
.animation-delay-2000 { animation-delay: 2s; }
`}
</style>

{/* ---------- ChartJS Script ---------- */}
<script>
{`
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const ctx = document.getElementById("tasksChart").getContext("2d");
new Chart(ctx, {
  type: "line",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "To Do",
        data: [12, 19, 7, 15, 9, 5, 10],
        borderColor: "#6366F1",
        backgroundColor: "rgba(99,102,241,0.2)",
        tension: 0.4,
      },
      {
        label: "In Progress",
        data: [5, 8, 6, 10, 4, 7, 3],
        borderColor: "#FACC15",
        backgroundColor: "rgba(250,204,21,0.2)",
        tension: 0.4,
      },
      {
        label: "Completed",
        data: [10, 15, 20, 25, 18, 30, 28],
        borderColor: "#22C55E",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.4,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true } },
  },
});
`}
</script>


/* ---------- STAT CARD ---------- */
function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <p className="text-slate-500 text-sm">{title}</p>
      <h3 className="text-3xl font-extrabold mt-2 text-indigo-600">
        {value}
      </h3>
    </div>
  );
}
