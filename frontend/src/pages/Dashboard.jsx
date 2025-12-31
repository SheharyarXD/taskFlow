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
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <h2 className="text-xl font-bold mb-2">Tasks Overview</h2>
            <p className="text-slate-500 mb-4">
              Unified task board coming soon 🚀
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <StatCard title="To Do" value="—" />
              <StatCard title="In Progress" value="—" />
              <StatCard title="Completed" value="—" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
