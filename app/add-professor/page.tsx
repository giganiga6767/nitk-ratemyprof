"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";

const DEPARTMENTS = [
  { code: "AM", name: "Applied Mechanics & Hydraulics" },
  { code: "CH", name: "Chemical Engineering" },
  { code: "CY", name: "Chemistry" },
  { code: "CV", name: "Civil Engineering" },
  { code: "CS", name: "Computer Science & Engineering" },
  { code: "EE", name: "Electrical & Electronics Engineering" },
  { code: "EC", name: "Electronics & Communication Engineering" },
  { code: "IT", name: "Information Technology" },
  { code: "MA", name: "Mathematical & Computational Sciences" },
  { code: "ME", name: "Mechanical Engineering" },
  { code: "MT", name: "Metallurgical & Materials Engineering" },
  { code: "MN", name: "Mining Engineering" },
  { code: "PH", name: "Physics" },
  { code: "SM", name: "School of Management" }
];

export default function AddProfessorPage() {
  const [name, setName] = useState("");
  const [dept, setDept] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dept) {
      toast.error("Please select a department");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/professors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), department: dept }),
      });
      if (res.ok) {
        toast.success("Professor added! Pending admin approval.");
        setName("");
        setDept("");
      } else {
        throw new Error("Failed to add");
      }
    } catch (err) {
      toast.error("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-100 p-6 flex flex-col items-center justify-center font-sans">
      <Link href="/" className="mb-8 text-indigo-600 font-bold hover:underline flex items-center gap-2 transition-all hover:gap-3">
        ← Back to Search
      </Link>
      
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white">
        <h1 className="text-3xl font-black mb-2 text-slate-900 tracking-tight">Add Professor</h1>
        <p className="text-slate-500 text-sm mb-8 font-medium italic">Help build the NITK community database.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Professor Full Name</label>
            <input 
              className="w-full p-4 rounded-2xl bg-white/50 border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none transition-all font-medium text-slate-800" 
              placeholder="e.g. Dr. Ramesh Kumar"
              value={name} onChange={(e) => setName(e.target.value)} required
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Department</label>
            <div className="relative">
              <select 
                className="w-full p-4 rounded-2xl bg-white/50 border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none transition-all font-medium text-slate-800 appearance-none cursor-pointer"
                value={dept} onChange={(e) => setDept(e.target.value)} required
              >
                <option value="">Select Department...</option>
                {DEPARTMENTS.map(d => (
                  <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                ▼
              </div>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit for Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
