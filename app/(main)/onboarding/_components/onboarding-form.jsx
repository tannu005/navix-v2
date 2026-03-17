"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateUser } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const schema = z.object({
  industry: z.string().min(1, "Please select an industry"),
  experience: z.coerce
    .number()
    .min(0, "Experience must be 0 or more")
    .max(50, "Experience must be under 50"),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  skills: z.string().optional(),
});

const industries = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Design",
  "Sales",
  "Engineering",
  "Data Science",
  "Product Management",
  "Human Resources",
  "Legal",
  "Consulting",
  "Media & Entertainment",
  "Retail & E-commerce",
  "Other",
];

export default function OnboardingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    setLoading(true);
    try {
      const skills = values.skills
        ? values.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];

      await updateUser({ ...values, skills });
      toast.success("Profile set up successfully!");
      router.push("/dashboard");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg bg-card border rounded-2xl p-8 shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold gradient-title mb-2">Welcome to Navix</h1>
        <p className="text-muted-foreground">
          Tell us about yourself so we can personalise your experience
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Industry */}
        <div className="space-y-2">
          <Label>Industry *</Label>
          <Select onValueChange={(val) => setValue("industry", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((ind) => (
                <SelectItem key={ind} value={ind}>
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && (
            <p className="text-sm text-destructive">{errors.industry.message}</p>
          )}
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience *</Label>
          <Input
            id="experience"
            type="number"
            min="0"
            max="50"
            placeholder="e.g. 3"
            {...register("experience")}
          />
          {errors.experience && (
            <p className="text-sm text-destructive">{errors.experience.message}</p>
          )}
        </div>

        {/* Skills */}
        <div className="space-y-2">
          <Label htmlFor="skills">Key Skills</Label>
          <Input
            id="skills"
            placeholder="e.g. React, Node.js, Python (comma-separated)"
            {...register("skills")}
          />
          <p className="text-xs text-muted-foreground">Separate skills with commas</p>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Professional Bio</Label>
          <textarea
            id="bio"
            rows={3}
            placeholder="Brief summary of your professional background..."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            {...register("bio")}
          />
          {errors.bio && (
            <p className="text-sm text-destructive">{errors.bio.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Setting up your profile..." : "Get Started"}
        </Button>
      </form>
    </div>
  );
}
