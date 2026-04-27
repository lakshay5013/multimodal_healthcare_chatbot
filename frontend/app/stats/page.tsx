"use client";

import { useState, useEffect } from "react";

export default function StatsPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch("http://localhost:8000/stats");
                if (!response.ok) {
                    throw new Error("Failed to fetch stats from backend");
                }
                const data = await response.json();
                setStats(data);
            } catch (err: any) {
                setError(err.message || "Something went wrong.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200 p-8 pt-24">
            <div className="max-w-4xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-light text-white mb-2 tracking-wide">
                        System Intelligence <span className="text-emerald-400 font-medium">Metrics</span>
                    </h1>
                    <p className="text-neutral-400 text-sm">
                        Live evaluation metrics from the retrieval augmented generation system.
                    </p>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500 border-opacity-50"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl">
                        <p>{error}</p>
                    </div>
                ) : stats ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Evaluation Metrics */}
                        <div
                            className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl space-y-6 md:col-span-2"
                        >
                            <div>
                                <h2 className="text-lg font-medium text-white mb-1">RAG Evaluation Metrics</h2>
                                <p className="text-xs text-neutral-500">{stats.evaluation_metrics?.description}</p>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/50">
                                    <div className="text-neutral-400 text-xs mb-1">Precision@{stats.evaluation_metrics?.top_k}</div>
                                    <div className="text-2xl font-semibold text-emerald-400">
                                        {(stats.evaluation_metrics?.precision * 100).toFixed(1)}%
                                    </div>
                                </div>
                                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/50">
                                    <div className="text-neutral-400 text-xs mb-1">Recall@{stats.evaluation_metrics?.top_k}</div>
                                    <div className="text-2xl font-semibold text-emerald-400">
                                        {(stats.evaluation_metrics?.recall * 100).toFixed(1)}%
                                    </div>
                                </div>
                                <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800/50">
                                    <div className="text-neutral-400 text-xs mb-1">MRR@{stats.evaluation_metrics?.top_k}</div>
                                    <div className="text-2xl font-semibold text-emerald-400">
                                        {(stats.evaluation_metrics?.mrr * 100).toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chunking Details */}
                        <div
                            className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl space-y-4"
                        >
                            <h2 className="text-sm font-medium text-white mb-2">Chunking Strategy</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-neutral-800 pb-2">
                                    <span className="text-neutral-400">Total Chunks</span>
                                    <span className="text-neutral-200 font-medium">{stats.chunking?.total_chunks}</span>
                                </div>
                                <div className="flex justify-between border-b border-neutral-800 pb-2">
                                    <span className="text-neutral-400">Chunk Size</span>
                                    <span className="text-neutral-200">{stats.chunking?.chunk_size} characters</span>
                                </div>
                                <div className="flex justify-between pb-1">
                                    <span className="text-neutral-400">Overlap</span>
                                    <span className="text-neutral-200">{stats.chunking?.overlap} characters</span>
                                </div>
                            </div>
                        </div>

                        {/* Embedded Representation details */}
                        <div
                            className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl space-y-4"
                        >
                            <h2 className="text-sm font-medium text-white mb-2">Vector Search (FAISS)</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-neutral-800 pb-2">
                                    <span className="text-neutral-400">Embeddings</span>
                                    <span className="text-neutral-200 font-medium truncate max-w-[150px]" title={stats.embeddings?.model}>
                                        {stats.embeddings?.model}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-neutral-800 pb-2">
                                    <span className="text-neutral-400">Dimension</span>
                                    <span className="text-neutral-200">{stats.embeddings?.dimension}-d</span>
                                </div>
                                <div className="flex justify-between pb-1">
                                    <span className="text-neutral-400">Index Type</span>
                                    <span className="text-neutral-200">{stats.faiss?.index_type.split(" ")[0]}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                ) : null}
            </div>
        </div>
    );
}
