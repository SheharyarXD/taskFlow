import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/authContext";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import gsap from "gsap";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const cardRef = useRef(null);

  useEffect(() => {
    gsap.from(cardRef.current, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* subtle background accents */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-300/40 rounded-full blur-3xl" />

      <div
        ref={cardRef}
        className="relative z-10 bg-white w-full max-w-md p-10 rounded-2xl shadow-xl border"
      >
        {/* LOGO / TITLE */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Team<span className="text-indigo-600">Flow</span>
          </h1>
          <p className="text-slate-500 mt-2">
            Welcome back. Log in to your workspace.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-slate-600 block mb-1">
              Email address
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="you@company.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-slate-600 block mb-1">
              Password
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 hover:translate-y-[-1px] transition"
          >
            Log in
          </button>
        </form>

        {/* FOOTER LINKS */}
        <div className="mt-6 text-center text-sm text-slate-500">
          No account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-medium hover:underline"
          >
            Create one
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-sm text-slate-400 hover:text-slate-600"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
