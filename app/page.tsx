"use client";

import { useState } from "react";

export default function Home() {
  const [material, setMaterial] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setAnswer("");
    setError("");

    if (!material.trim()) {
      setError("Please enter a construction material name.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/material-helper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ material }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setAnswer(data.answer);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
      <section className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
        <p className="text-sm font-semibold text-blue-600 text-center">
          Buildanta Private Limited
        </p>

        <h1 className="text-3xl font-bold text-center text-slate-900 mt-2">
          Buildanta Material Helper
        </h1>

        <p className="text-center text-slate-600 mt-3">
          Enter a construction material and get 3 useful checks before buying it
          in Kanpur.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            placeholder="Example: cement, TMT bar, tiles"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 text-gray-900 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold rounded-xl py-3 hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? "Checking..." : "Submit"}
          </button>
        </form>

        {error && (
          <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        {answer && (
          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h2 className="text-xl font-semibold text-slate-900 mb-3">
              Things to check before buying {material}
            </h2>

            <pre className="whitespace-pre-wrap text-slate-700 font-sans leading-7">
              {answer}
            </pre>
          </div>
        )}
      </section>
    </main>
  );
}