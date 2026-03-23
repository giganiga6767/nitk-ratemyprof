"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";

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
        toast.success("Success!");
        window.location.href = "/";
      } else {
        const errData = await res.json();
        alert("Server says: " + JSON.stringify(errData));
      }
    } catch (err) {
      alert("Network failed. Is the API route actually at /api/professors/route.ts?");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-10 font-sans">
      <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Add Professor</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full p-3 border rounded" 
            placeholder="Name" 
            onChange={e => setName(e.target.value)} required 
          />
          <select 
            className="w-full p-3 border rounded" 
            onChange={e => setDept(e.target.value)} required
          >
            <option value="">Select Dept</option>
            <option value="EC">ECE</option>
            <option value="CS">CSE</option>
            <option value="PH">Physics</option>
            <option value="ME">Mech</option>
          </select>
          <button className="w-full bg-blue-600 text-white py-3 rounded font-bold">Submit</button>
        </form>
        <Link href="/" className="block text-center mt-4 text-sm text-slate-500 underline">Back</Link>
      </div>
    </div>
  );
}
