"use client";

import { ExternalLink, Pencil, Trash2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const STATUS_STYLES = {
  APPLIED: "status-applied",
  INTERVIEWING: "status-interviewing",
  OFFERED: "status-offered",
  REJECTED: "status-rejected",
  WITHDRAWN: "status-withdrawn",
};

export default function JobTable({ jobs, loading, onDelete, onEdit, onStatusChange }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!jobs.length) {
    return (
      <div className="text-center py-16 text-muted-foreground border rounded-xl">
        <div className="text-4xl mb-3">📋</div>
        <p className="font-medium text-foreground">No applications here</p>
        <p className="text-sm mt-1">Try a different filter or add a new application</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden">
      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              {["Company", "Position", "Location", "Status", "Applied", "Actions"].map((h) => (
                <th key={h} className={`px-4 py-3 font-medium text-muted-foreground ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 font-medium">
                    {job.company}
                    {job.jobUrl && (
                      <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  {job.salary && <p className="text-xs text-muted-foreground mt-0.5">{job.salary}</p>}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{job.position}</td>
                <td className="px-4 py-3 text-muted-foreground">{job.location || "—"}</td>
                <td className="px-4 py-3">
                  <Select value={job.status} onValueChange={(val) => onStatusChange(job.id, val)}>
                    <SelectTrigger className="w-36 h-8 text-xs">
                      <SelectValue>
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${STATUS_STYLES[job.status]}`}>
                          {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                        </span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {["APPLIED", "INTERVIEWING", "OFFERED", "REJECTED", "WITHDRAWN"].map((s) => (
                        <SelectItem key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {job.interviewDate && (
                    <p className="text-xs text-yellow-400 mt-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(job.interviewDate).toLocaleDateString()}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {new Date(job.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(job)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Application?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently remove {job.company} — {job.position}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(job.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden divide-y divide-border">
        {jobs.map((job) => (
          <div key={job.id} className="p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-medium">
                  {job.company}
                  {job.jobUrl && (
                    <a href={job.jobUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{job.position}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs border ${STATUS_STYLES[job.status]}`}>
                {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
              </span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{job.location || "—"}</span>
              <span>{new Date(job.appliedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(job)} className="flex-1 h-7 text-xs">Edit</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline" className="h-7 text-xs text-destructive border-destructive/30">Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete?</AlertDialogTitle>
                    <AlertDialogDescription>Remove {job.company} — {job.position}?</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(job.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
