"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";

export default function AddProfessorPage() {
  const [name, setName] = useState("");
  const [dept, setDept] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/professors", {
      method: "POST",
      body: JSON.stringify({ name, department: dept }),
    });
    if (res.ok) {
      toast.success("Professor added! Pending admin approval.");
      setName(""); setDept("");
    } else {
      toast.error("Failed to add professor.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-100 p-8">
      <div className="max-w-md mx-auto bg-white/60 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white">
        <h1 className="text-2xl font-black mb-6 text-slate-900">Add New Professor</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full p-3 rounded-xl border border-slate-200" 
            placeholder="Professor Full Name"
            value={name} onChange={(e) => setName(e.target.value)} required
          />
          <input 
            className="w-full p-3 rounded-xl border border-slate-200" 
            placeholder="Department (e.g. ECE, CSE)"
            value={dept} onChange={(e) => setDept(e.target.value)} required
          />
          <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all">
            Submit for Review
          </button>
        </form>
      </div>
    </div>
  );
}
