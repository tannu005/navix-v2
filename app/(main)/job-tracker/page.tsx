"use client";

import { useEffect, useState } from "react";
import { Plus, Briefcase, TrendingUp, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getJobApplications,
  getJobStats,
  deleteJobApplication,
  updateJobApplication,
} from "@/actions/job-tracker";
import JobForm from "@/components/job-tracker/job-form";
import JobTable from "@/components/job-tracker/job-table";
import { toast } from "sonner";

export default function JobTrackerPage() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ total: 0, applied: 0, interviewing: 0, offered: 0, rejected: 0, withdrawn: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  async function loadData() {
    setLoading(true);
    try {
      const [jobData, statsData] = await Promise.all([getJobApplications(), getJobStats()]);
      setJobs(jobData);
      setStats(statsData);
    } catch {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  async function handleDelete(id) {
    try {
      await deleteJobApplication(id);
      toast.success("Application removed");
      loadData();
    } catch {
      toast.error("Failed to delete");
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await updateJobApplication(id, { status });
      toast.success("Status updated");
      loadData();
    } catch {
      toast.error("Failed to update status");
    }
  }

  function handleEdit(job) {
    setEditingJob(job);
    setShowForm(true);
  }

  function handleFormClose() {
    setShowForm(false);
    setEditingJob(null);
    loadData();
  }

  const filtered = statusFilter === "ALL" ? jobs : jobs.filter((j) => j.status === statusFilter);
  const successRate = stats.total > 0 ? Math.round((stats.offered / stats.total) * 100) : 0;

  const statCards = [
    { label: "Total Applied", value: stats.total, icon: <Briefcase className="h-5 w-5" />, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Interviewing", value: stats.interviewing, icon: <Clock className="h-5 w-5" />, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { label: "Offers", value: stats.offered, icon: <CheckCircle2 className="h-5 w-5" />, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Rejected", value: stats.rejected, icon: <XCircle className="h-5 w-5" />, color: "text-red-400", bg: "bg-red-500/10" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold gradient-title">Job Tracker</h1>
          <p className="text-muted-foreground mt-1">Track your entire job search pipeline</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 w-fit">
          <Plus className="h-4 w-4" />
          Add Application
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <Card key={i}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${s.bg}`}>
                  <span className={s.color}>{s.icon}</span>
                </div>
                <div>
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats.total > 0 && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm">
                Offer rate:{" "}
                <span className="font-semibold text-primary">{successRate}%</span>
                {" "}— {stats.offered} offer{stats.offered !== 1 ? "s" : ""} from {stats.total} application{stats.total !== 1 ? "s" : ""}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-2 flex-wrap mb-4">
        {["ALL", "APPLIED", "INTERVIEWING", "OFFERED", "REJECTED", "WITHDRAWN"].map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(s)}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            {s !== "ALL" && (
              <span className="ml-1.5 text-xs opacity-70">
                {jobs.filter((j) => j.status === s).length}
              </span>
            )}
          </Button>
        ))}
      </div>

      <JobTable
        jobs={filtered}
        loading={loading}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onStatusChange={handleStatusChange}
      />

      {showForm && <JobForm job={editingJob} onClose={handleFormClose} />}
    </div>
  );
}
