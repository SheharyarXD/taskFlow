import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const sections = useRef([]);
  const heroImg = useRef(null);

  sections.current = [];
  const addSection = (el) => el && sections.current.push(el);

  useEffect(() => {
    // HERO intro
    gsap.from(".nav", { y: -20, opacity: 0, duration: 0.6 });
    gsap.from(".hero-title", {
      y: 40,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
    });
    gsap.from(".hero-text", {
      y: 30,
      opacity: 0,
      delay: 0.2,
      duration: 0.8,
    });
    gsap.from(".hero-cta", {
      y: 20,
      opacity: 0,
      delay: 0.4,
      duration: 0.7,
    });

    // Subtle hero parallax
    gsap.to(heroImg.current, {
      yPercent: 8,
      ease: "none",
      scrollTrigger: {
        trigger: heroImg.current,
        scrub: true,
      },
    });

    // Section reveal
    sections.current.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );
    });
  }, []);

  return (
    <div className="bg-slate-50 text-slate-800 overflow-x-hidden">
      {/* NAV */}
      <header className="nav sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-[1400px] mx-auto px-8 py-5 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Team<span className="text-indigo-600">Flow</span>
          </h1>
          <nav className="flex gap-8 items-center">
            <Link className="group relative" to="/login">
              Login
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-indigo-600 transition-all group-hover:w-full" />
            </Link>
            <Link
              to="/signup"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 hover:scale-[1.02] transition"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="bg-white">
        <div
          ref={addSection}
          className="max-w-[1400px] mx-auto px-8 py-32 grid md:grid-cols-2 gap-20 items-center"
        >
          <div>
            <h1 className="hero-title text-5xl font-extrabold leading-tight">
              Manage work.
              <br />
              <span className="text-indigo-600">Without the chaos.</span>
            </h1>
            <p className="hero-text mt-6 text-lg text-slate-600 max-w-xl">
              TeamFlow helps teams plan projects, assign tasks, and track progress
              with clarity and control.
            </p>

            <div className="hero-cta mt-10 flex gap-4">
              <Link
                to="/signup"
                className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 hover:translate-y-[-2px] transition"
              >
                Start Free
              </Link>
              <Link
                to="/login"
                className="border px-8 py-4 rounded-lg hover:bg-slate-100 transition"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Dashboard mock */}
          <div
            ref={heroImg}
            className="relative bg-slate-100 rounded-xl shadow-2xl p-6"
          >
            <div className="h-64 bg-white rounded-lg border flex items-center justify-center text-slate-400">
              Live Dashboard Preview
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="bg-slate-50 border-y">
        <div
          ref={addSection}
          className="max-w-[1400px] mx-auto px-8 py-16 text-center"
        >
          <p className="text-slate-500 mb-8">
            Trusted by high-performing teams
          </p>
          <div className="flex flex-wrap justify-center gap-12 text-slate-400 font-semibold tracking-wide">
            Google • Amazon • Stripe • Shopify • Microsoft
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white">
        <div
          ref={addSection}
          className="max-w-[1400px] mx-auto px-8 py-32"
        >
          <h2 className="text-4xl font-bold mb-16 text-center">
            Built for modern teams
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              ["Project Planning", "Structured milestones & clarity"],
              ["Task Management", "Assign, prioritize & track work"],
              ["Role Control", "Admin and member permissions"],
              ["Progress Tracking", "See progress instantly"],
              ["Team Collaboration", "Everything in one workspace"],
              ["Analytics", "Clear insights into performance"],
            ].map(([title, desc], i) => (
              <div
                key={i}
                className="group bg-slate-50 p-8 rounded-xl border transition hover:-translate-y-2 hover:shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-3 group-hover:text-indigo-600 transition">
                  {title}
                </h3>
                <p className="text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-indigo-600 text-white">
        <div
          ref={addSection}
          className="max-w-[1400px] mx-auto px-8 py-24 grid md:grid-cols-3 text-center gap-10"
        >
          {[
            ["Projects Delivered", "120+"],
            ["Active Teams", "50+"],
            ["Tasks Completed", "1k+"],
          ].map(([label, val]) => (
            <div key={label}>
              <p className="text-5xl font-bold">{val}</p>
              <p className="opacity-80 mt-2">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white">
        <div
          ref={addSection}
          className="max-w-[1400px] mx-auto px-8 py-32 text-center"
        >
          <h2 className="text-4xl font-bold mb-6">
            Start managing your team today
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-10">
            Simple setup. No credit card required.
          </p>
          <Link
            to="/signup"
            className="bg-indigo-600 px-10 py-4 rounded-lg font-semibold hover:bg-indigo-700 hover:scale-[1.04] transition"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-500">
        <div className="max-w-[1400px] mx-auto px-8 py-10 flex flex-col md:flex-row justify-between gap-6">
          <p>© 2026 TeamFlow. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/login" className="hover:text-white">
              Login
            </Link>
            <Link to="/signup" className="hover:text-white">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
