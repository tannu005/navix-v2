"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createJobApplication(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  try {
    const job = await db.jobApplication.create({
      data: {
        userId: user.id,
        company: data.company,
        position: data.position,
        jobUrl: data.jobUrl || null,
        status: data.status || "APPLIED",
        appliedAt: data.appliedAt ? new Date(data.appliedAt) : new Date(),
        notes: data.notes || null,
        salary: data.salary || null,
        location: data.location || null,
        interviewDate: data.interviewDate ? new Date(data.interviewDate) : null,
      },
    });
    revalidatePath("/job-tracker");
    return job;
  } catch (error) {
    console.error("Error creating job application:", error);
    throw new Error("Failed to create job application");
  }
}

export async function updateJobApplication(id, data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  try {
    const job = await db.jobApplication.update({
      where: { id, userId: user.id },
      data: {
        ...(data.company && { company: data.company }),
        ...(data.position && { position: data.position }),
        ...(data.jobUrl !== undefined && { jobUrl: data.jobUrl }),
        ...(data.status && { status: data.status }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.salary !== undefined && { salary: data.salary }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.appliedAt && { appliedAt: new Date(data.appliedAt) }),
        ...(data.interviewDate !== undefined && {
          interviewDate: data.interviewDate ? new Date(data.interviewDate) : null,
        }),
      },
    });
    revalidatePath("/job-tracker");
    return job;
  } catch (error) {
    console.error("Error updating job application:", error);
    throw new Error("Failed to update job application");
  }
}

export async function deleteJobApplication(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  try {
    await db.jobApplication.delete({ where: { id, userId: user.id } });
    revalidatePath("/job-tracker");
  } catch (error) {
    console.error("Error deleting job application:", error);
    throw new Error("Failed to delete job application");
  }
}

export async function getJobApplications() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  return await db.jobApplication.findMany({
    where: { userId: user.id },
    orderBy: { appliedAt: "desc" },
  });
}

export async function getJobStats() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const applications = await db.jobApplication.findMany({
    where: { userId: user.id },
    select: { status: true },
  });

  return {
    total: applications.length,
    applied: applications.filter((a) => a.status === "APPLIED").length,
    interviewing: applications.filter((a) => a.status === "INTERVIEWING").length,
    offered: applications.filter((a) => a.status === "OFFERED").length,
    rejected: applications.filter((a) => a.status === "REJECTED").length,
    withdrawn: applications.filter((a) => a.status === "WITHDRAWN").length,
  };
}
