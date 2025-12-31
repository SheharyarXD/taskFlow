import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/authContext";
import ProjectCard from "../components/ProjectCard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, authLoading, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ADMIN add project
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
  });

  /* ---------------- PROTECT ---------------- */
  if (authLoading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) {
    navigate("/login");
    return null;
  }

  /* ---------------- FETCH PROJECTS ---------------- */
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/projects");

      // ADMIN → ALL projects
      if (user.role === "admin") {
        setProjects(res.data);
        setLoading(false);
        return;
      }

      // MEMBER → only projects with THEIR tasks
      const filtered = [];

      for (const project of res.data) {
        const taskRes = await api.get(`/tasks/${project._id}`);

        const hasMyTask = taskRes.data.some(
          (task) =>
            task.assignedTo &&
            task.assignedTo.toString() === user._id
        );

        if (hasMyTask) filtered.push(project);
      }

      setProjects(filtered);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  /* ---------------- FETCH MEMBERS ---------------- */
  const fetchMembers = async () => {
    try {
      const res = await api.get("/users");
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- ADD PROJECT (ADMIN) ---------------- */
  const addProject = async () => {
    if (!newProject.title) return;
    await api.post("/projects", newProject);
    setNewProject({ title: "", description: "" });
    fetchProjects();
  };

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    fetchProjects();
    if (user.role === "admin") fetchMembers();
  }, [user]);

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-600">TeamFlow</h1>
        <div className="flex gap-4 items-center">
          <span className="text-gray-600">
            {user.name} ({user.role})
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* ADMIN ADD PROJECT */}
        {user.role === "admin" && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="font-bold mb-2">Create Project</h2>
            <input
              className="border p-2 rounded w-full mb-2"
              placeholder="Project title"
              value={newProject.title}
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
            />
            <textarea
              className="border p-2 rounded w-full mb-2"
              placeholder="Description"
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
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Project
            </button>
          </div>
        )}

        {/* PROJECT LIST */}
        {loading ? (
          <p className="text-center">Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-center">No projects assigned.</p>
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
      </div>
    </div>
  );
}
