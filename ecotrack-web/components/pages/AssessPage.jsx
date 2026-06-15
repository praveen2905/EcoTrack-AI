"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

const assessmentSchema = z.object({
  transportKm: z.coerce.number().min(0, "Must be 0 or more"),
  usesPublicTransport: z.boolean(),
  flightsPerYear: z.coerce.number().min(0).max(365),
  acHoursPerDay: z.coerce.number().min(0).max(24),
  fanHoursPerDay: z.coerce.number().min(0).max(24),
  monthlyElectricityBill: z.coerce.number().min(0),
  isVegetarian: z.boolean(),
  foodDeliveryPerWeek: z.coerce.number().min(0).max(21),
  onlineOrdersPerMonth: z.coerce.number().min(0).max(200),
});

const STEP_FIELDS = {
  1: ["transportKm", "usesPublicTransport", "flightsPerYear"],
  2: ["acHoursPerDay", "fanHoursPerDay", "monthlyElectricityBill"],
  3: ["isVegetarian", "foodDeliveryPerWeek"],
  4: ["onlineOrdersPerMonth"],
};

const STEP_LABELS = { 1: "Transportation", 2: "Electricity", 3: "Food", 4: "Shopping" };
const TOTAL_STEPS = 4;

export default function AssessPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const cardRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      transportKm: 0, usesPublicTransport: false, flightsPerYear: 0,
      acHoursPerDay: 0, fanHoursPerDay: 0, monthlyElectricityBill: 0,
      isVegetarian: false, foodDeliveryPerWeek: 0, onlineOrdersPerMonth: 0,
    },
  });

  const createAssessment = useMutation({
    mutationFn: async (values) => {
      const res = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to create assessment");
      return res.json();
    },
    onSuccess: (data) => router.push(`/results?id=${data.id}`),
  });

  useEffect(() => {
    const el = cardRef.current?.querySelector("input, button, select, textarea, [tabindex]:not([tabindex='-1'])");
    el?.focus();
  }, [step]);

  const nextStep = async () => {
    const fields = STEP_FIELDS[step] ?? [];
    const isValid = await form.trigger(fields);
    if (isValid) setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Carbon Assessment</h1>
          <Progress value={(step / TOTAL_STEPS) * 100} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Step {step} of {TOTAL_STEPS} — {STEP_LABELS[step]}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((v) => createAssessment.mutate(v))} className="space-y-8" noValidate>
            {step === 1 && (
              <Card ref={cardRef}>
                <CardHeader><CardTitle>Transportation</CardTitle><CardDescription>How do you get around day to day?</CardDescription></CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={form.control} name="transportKm" render={({ field }) => (
                    <FormItem><FormLabel>Weekly driving distance (km)</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="usesPublicTransport" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5"><FormLabel className="text-base">Public Transport</FormLabel><FormDescription>Do you regularly use buses or trains?</FormDescription></div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="flightsPerYear" render={({ field }) => (
                    <FormItem><FormLabel>Flights per year</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
              </Card>
            )}
            {step === 2 && (
              <Card ref={cardRef}>
                <CardHeader><CardTitle>Electricity</CardTitle><CardDescription>Energy consumption at home.</CardDescription></CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={form.control} name="acHoursPerDay" render={({ field }) => (
                    <FormItem><FormLabel>AC usage (hours/day)</FormLabel><FormControl><Input type="number" min={0} max={24} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="fanHoursPerDay" render={({ field }) => (
                    <FormItem><FormLabel>Fan usage (hours/day)</FormLabel><FormControl><Input type="number" min={0} max={24} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="monthlyElectricityBill" render={({ field }) => (
                    <FormItem><FormLabel>Average monthly electricity bill ($)</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
              </Card>
            )}
            {step === 3 && (
              <Card ref={cardRef}>
                <CardHeader><CardTitle>Food</CardTitle><CardDescription>Diet and consumption habits.</CardDescription></CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={form.control} name="isVegetarian" render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5"><FormLabel className="text-base">Vegetarian Diet</FormLabel><FormDescription>Do you follow a mostly plant-based diet?</FormDescription></div>
                      <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="foodDeliveryPerWeek" render={({ field }) => (
                    <FormItem><FormLabel>Food deliveries per week</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
              </Card>
            )}
            {step === 4 && (
              <Card ref={cardRef}>
                <CardHeader><CardTitle>Shopping</CardTitle><CardDescription>Online ordering and consumption.</CardDescription></CardHeader>
                <CardContent className="space-y-6">
                  <FormField control={form.control} name="onlineOrdersPerMonth" render={({ field }) => (
                    <FormItem><FormLabel>Online packages ordered per month</FormLabel><FormControl><Input type="number" min={0} {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">Review your answers before submitting.</CardFooter>
              </Card>
            )}

            <div className="flex justify-between mt-8">
              <Button type="button" variant="outline" onClick={() => setStep((s) => Math.max(s - 1, 1))} disabled={step === 1 || createAssessment.isPending}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {step < TOTAL_STEPS ? (
                <Button type="button" onClick={nextStep}><ArrowRight className="ml-2 h-4 w-4" /> Next</Button>
              ) : (
                <Button type="submit" disabled={createAssessment.isPending}>
                  {createAssessment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {createAssessment.isPending ? "Calculating..." : "Submit Assessment"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
}
