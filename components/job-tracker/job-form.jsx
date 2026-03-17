"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createJobApplication, updateJobApplication } from "@/actions/job-tracker";
import { toast } from "sonner";

export default function JobForm({ job, onClose }) {
  const isEditing = !!job;
  const [form, setForm] = useState({
    company: job?.company || "",
    position: job?.position || "",
    jobUrl: job?.jobUrl || "",
    location: job?.location || "",
    salary: job?.salary || "",
    status: job?.status || "APPLIED",
    notes: job?.notes || "",
    appliedAt: job?.appliedAt ? new Date(job.appliedAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    interviewDate: job?.interviewDate ? new Date(job.interviewDate).toISOString().split("T")[0] : "",
  });
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.company || !form.position) return toast.error("Company and position are required");
    setLoading(true);
    try {
      if (isEditing) {
        await updateJobApplication(job.id, form);
        toast.success("Application updated!");
      } else {
        await createJobApplication(form);
        toast.success("Application added!");
      }
      onClose();
    } catch {
      toast.error(isEditing ? "Failed to update" : "Failed to add application");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-background border rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold">{isEditing ? "Edit Application" : "Add Application"}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Company *</Label>
              <Input name="company" placeholder="Google" value={form.company} onChange={handleChange} required />
            </div>
            <div className="space-y-1.5">
              <Label>Position *</Label>
              <Input name="position" placeholder="Frontend Engineer" value={form.position} onChange={handleChange} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Job URL</Label>
            <Input name="jobUrl" type="url" placeholder="https://..." value={form.jobUrl} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Location</Label>
              <Input name="location" placeholder="Remote / Bangalore" value={form.location} onChange={handleChange} />
            </div>
            <div className="space-y-1.5">
              <Label>Salary Range</Label>
              <Input name="salary" placeholder="₹20-30 LPA" value={form.salary} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["APPLIED", "INTERVIEWING", "OFFERED", "REJECTED", "WITHDRAWN"].map((s) => (
                    <SelectItem key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Applied Date</Label>
              <Input name="appliedAt" type="date" value={form.appliedAt} onChange={handleChange} />
            </div>
          </div>
          {form.status === "INTERVIEWING" && (
            <div className="space-y-1.5">
              <Label>Interview Date</Label>
              <Input name="interviewDate" type="datetime-local" value={form.interviewDate} onChange={handleChange} />
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Notes</Label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Recruiter name, notes, key requirements..."
              value={form.notes}
              onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Saving…" : isEditing ? "Update" : "Add Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
