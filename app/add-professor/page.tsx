"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";

const DEPARTMENTS = [
  { code: "AM", name: "Applied Mechanics" },
  { code: "CH", name: "Chemical" },
  { code: "CY", name: "Chemistry" },
  { code: "CV", name: "Civil" },
  { code: "CS", name: "CSE" },
  { code: "EE", name: "EEE" },
  { code: "EC", name: "ECE" },
  { code: "IT", name: "IT" },
  { code: "MA", name: "MACS" },
  { code: "ME", name: "Mechanical" },
  { code: "MT", name: "MME" },
  { code: "MN", name: "Mining" },
  { code: "PH", name: "Physics" },
  { code: "SM", name: "SOM" }
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
      const data = await res.json();
      if (res.ok) {
        toast.success("Done! Refreshing...");
        setName(""); setDept("");
        window.location.href = "/";
      } else {
        console.error("Server Error:", data);
        toast.error(`Error: ${data.message || 'Check Console'}`);
      }
    } catch (err) {
      toast.error("Network error. Check connection.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-100 p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl">
        <h1 className="text-2xl font-black mb-6">Add Professor</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full p-4 rounded-xl border border-slate-200" 
            placeholder="Full Name (Min 3 chars)"
            value={name} onChange={(e) => setName(e.target.value)} required
          />
          <select 
            className="w-full p-4 rounded-xl border border-slate-200 bg-white"
            value={dept} onChange={(e) => setDept(e.target.value)} required
          >
            <option value="">Select Dept</option>
            {DEPARTMENTS.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
          </select>
          <button className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl shadow-lg">Submit</button>
        </form>
        <Link href="/" className="block text-center mt-6 text-slate-500 text-sm font-bold">Cancel</Link>
      </div>
    </div>
  );
}
