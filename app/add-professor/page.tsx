"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";

const DEPARTMENTS = [
const DEPARTMENTS = [
  { code: "AMH", name: "Applied Mechanics & Hydraulics" },
  { code: "CHL", name: "Chemical Engineering" },
  { code: "CHY", name: "Chemistry" },
  { code: "CVL", name: "Civil Engineering" },
  { code: "CSE", name: "Computer Science & Engineering" },
  { code: "EEE", name: "Electrical & Electronics Engineering" },
  { code: "ECE", name: "Electronics & Communication Engineering" },
  { code: "INF", name: "Information Technology" },
  { code: "MAC", name: "Mathematical & Computational Sciences" },
  { code: "MEC", name: "Mechanical Engineering" },
  { code: "MME", name: "Metallurgical & Materials Engineering" },
  { code: "MNG", name: "Mining Engineering" },
  { code: "PHY", name: "Physics" },
  { code: "SOM", name: "School of Management" }
];

export default function AddProfessorPage() {
  const [name, setName] = useState("");
  const [dept, setDept] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/professors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), department: dept }),
      });
      if (res.ok) {
        toast.success("Professor added! Pending approval.");
        window.location.href = "/";
      } else {
        const errData = await res.json();
        alert("Server says: " + JSON.stringify(errData));
      }
    } catch (err) {
      alert("Network failed. Check your API route.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-6 md:p-12 font-sans flex items-center justify-center">
      <div className="max-w-xl w-full bg-white/70 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white">
        <h1 className="text-3xl font-black mb-2 text-slate-900 tracking-tight">Add Professor</h1>
        <p className="text-slate-500 text-sm mb-8 font-medium">Add a new entry to the NITK directory.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Full Name</label>
            <input 
              className="w-full p-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-400 transition-all font-medium" 
              placeholder="e.g. Dr. Satya Sai"
              value={name}
              onChange={e => setName(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Department</label>
            <select 
              className="w-full p-4 rounded-2xl bg-white border border-slate-200 outline-none focus:ring-2 focus:ring-blue-400 transition-all font-medium appearance-none"
              value={dept}
              onChange={e => setDept(e.target.value)} 
              required
            >
              <option value="">Select Department...</option>
              {DEPARTMENTS.map(d => (
                <option key={d.code} value={d.code}>{d.name} ({d.code})</option>
              ))}
            </select>
          </div>

          <button className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98]">
            Submit for Review
          </button>
        </form>
        <Link href="/" className="block text-center mt-6 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">
          ← Cancel and Go Back
        </Link>
      </div>
    </div>
  );
}
