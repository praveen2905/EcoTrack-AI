import { MainLayout } from "@/components/layout/MainLayout";
import { useState } from "react";
import { useLocation } from "wouter";
import { useCreateAssessment } from "@workspace/api-client-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

const assessmentSchema = z.object({
  transportKm: z.coerce.number().min(0, "Must be positive"),
  usesPublicTransport: z.boolean(),
  flightsPerYear: z.coerce.number().min(0, "Must be positive"),
  acHoursPerDay: z.coerce.number().min(0, "Must be positive").max(24, "Cannot exceed 24"),
  fanHoursPerDay: z.coerce.number().min(0, "Must be positive").max(24, "Cannot exceed 24"),
  monthlyElectricityBill: z.coerce.number().min(0, "Must be positive"),
  isVegetarian: z.boolean(),
  foodDeliveryPerWeek: z.coerce.number().min(0, "Must be positive"),
  onlineOrdersPerMonth: z.coerce.number().min(0, "Must be positive"),
});

export default function Assess() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  const form = useForm<z.infer<typeof assessmentSchema>>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      transportKm: 0,
      usesPublicTransport: false,
      flightsPerYear: 0,
      acHoursPerDay: 0,
      fanHoursPerDay: 0,
      monthlyElectricityBill: 0,
      isVegetarian: false,
      foodDeliveryPerWeek: 0,
      onlineOrdersPerMonth: 0,
    },
  });

  const createAssessment = useCreateAssessment();

  const onSubmit = (values: z.infer<typeof assessmentSchema>) => {
    createAssessment.mutate(
      { data: values },
      {
        onSuccess: (data) => {
          setLocation(`/results?id=${data.id}`);
        },
      }
    );
  };

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (step === 1) fieldsToValidate = ['transportKm', 'usesPublicTransport', 'flightsPerYear'];
    if (step === 2) fieldsToValidate = ['acHoursPerDay', 'fanHoursPerDay', 'monthlyElectricityBill'];
    if (step === 3) fieldsToValidate = ['isVegetarian', 'foodDeliveryPerWeek'];
    
    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) setStep((s) => Math.min(s + 1, totalSteps));
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Carbon Assessment</h1>
          <Progress value={(step / totalSteps) * 100} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Step {step} of {totalSteps}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {step === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Transportation</CardTitle>
                  <CardDescription>How do you get around?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="transportKm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weekly driving distance (km)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="usesPublicTransport"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Public Transport</FormLabel>
                          <FormDescription>Do you regularly use buses or trains?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="flightsPerYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Flights per year</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>Electricity</CardTitle>
                  <CardDescription>Energy consumption at home.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="acHoursPerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AC usage (hours/day)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fanHoursPerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fan usage (hours/day)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="monthlyElectricityBill"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Average monthly electricity bill ($)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Food</CardTitle>
                  <CardDescription>Diet and consumption habits.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="isVegetarian"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Vegetarian Diet</FormLabel>
                          <FormDescription>Do you follow a mostly plant-based diet?</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="foodDeliveryPerWeek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Food deliveries per week</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>Shopping</CardTitle>
                  <CardDescription>Online ordering and consumption.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="onlineOrdersPerMonth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Online packages ordered per month</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep((s) => Math.max(s - 1, 1))}
                disabled={step === 1 || createAssessment.isPending}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              
              {step < totalSteps ? (
                <Button type="button" onClick={nextStep}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={createAssessment.isPending}>
                  {createAssessment.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit Assessment
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </MainLayout>
  );
}