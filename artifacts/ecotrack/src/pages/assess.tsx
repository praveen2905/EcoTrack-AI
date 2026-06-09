import { MainLayout } from "@/components/layout/MainLayout";
import { useState, useRef, useEffect } from "react";
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
  transportKm: z.coerce.number().min(0, "Must be 0 or more"),
  usesPublicTransport: z.boolean(),
  flightsPerYear: z.coerce.number().min(0, "Must be 0 or more").max(365, "Exceeds maximum"),
  acHoursPerDay: z.coerce.number().min(0, "Must be 0 or more").max(24, "Cannot exceed 24 hours"),
  fanHoursPerDay: z.coerce.number().min(0, "Must be 0 or more").max(24, "Cannot exceed 24 hours"),
  monthlyElectricityBill: z.coerce.number().min(0, "Must be 0 or more"),
  isVegetarian: z.boolean(),
  foodDeliveryPerWeek: z.coerce.number().min(0, "Must be 0 or more").max(21, "Exceeds maximum"),
  onlineOrdersPerMonth: z.coerce.number().min(0, "Must be 0 or more").max(200, "Exceeds maximum"),
});

type AssessmentFormValues = z.infer<typeof assessmentSchema>;

type StepField = keyof AssessmentFormValues;

const STEP_FIELDS: Record<number, StepField[]> = {
  1: ["transportKm", "usesPublicTransport", "flightsPerYear"],
  2: ["acHoursPerDay", "fanHoursPerDay", "monthlyElectricityBill"],
  3: ["isVegetarian", "foodDeliveryPerWeek"],
  4: ["onlineOrdersPerMonth"],
};

const TOTAL_STEPS = 4;

export default function Assess() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const cardRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);

  const form = useForm<AssessmentFormValues>({
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

  useEffect(() => {
    const firstFocusable = cardRef.current?.querySelector<HTMLElement>(
      "input, button, select, textarea, [tabindex]:not([tabindex='-1'])"
    );
    firstFocusable?.focus();
  }, [step]);

  const onSubmit = (values: AssessmentFormValues) => {
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
    const fieldsToValidate = STEP_FIELDS[step] ?? [];
    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const STEP_LABELS: Record<number, string> = {
    1: "Transportation",
    2: "Electricity",
    3: "Food",
    4: "Shopping",
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-4">Carbon Assessment</h1>
          <Progress
            value={(step / TOTAL_STEPS) * 100}
            className="h-2"
            aria-label="Assessment progress"
            aria-valuenow={(step / TOTAL_STEPS) * 100}
            aria-valuemin={0}
            aria-valuemax={100}
          />
          <p
            ref={liveRef}
            className="text-sm text-muted-foreground mt-2"
            aria-live="polite"
            role="status"
            data-testid="text-step-counter"
          >
            Step {step} of {TOTAL_STEPS} — {STEP_LABELS[step]}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" noValidate>
            {step === 1 && (
              <Card ref={cardRef} data-testid="card-step-transportation">
                <CardHeader>
                  <CardTitle>Transportation</CardTitle>
                  <CardDescription>How do you get around day to day?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="transportKm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="transport-km">Weekly driving distance (km)</FormLabel>
                        <FormControl>
                          <Input
                            id="transport-km"
                            type="number"
                            min={0}
                            aria-describedby="transport-km-msg"
                            data-testid="input-transport-km"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage id="transport-km-msg" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="usesPublicTransport"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base" htmlFor="public-transport">
                            Public Transport
                          </FormLabel>
                          <FormDescription id="public-transport-desc">
                            Do you regularly use buses or trains?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            id="public-transport"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-describedby="public-transport-desc"
                            data-testid="switch-public-transport"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="flightsPerYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="flights-per-year">Flights per year</FormLabel>
                        <FormControl>
                          <Input
                            id="flights-per-year"
                            type="number"
                            min={0}
                            aria-describedby="flights-per-year-msg"
                            data-testid="input-flights-per-year"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage id="flights-per-year-msg" />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {step === 2 && (
              <Card ref={cardRef} data-testid="card-step-electricity">
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
                        <FormLabel htmlFor="ac-hours">AC usage (hours/day)</FormLabel>
                        <FormControl>
                          <Input
                            id="ac-hours"
                            type="number"
                            min={0}
                            max={24}
                            aria-describedby="ac-hours-msg"
                            data-testid="input-ac-hours"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage id="ac-hours-msg" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fanHoursPerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="fan-hours">Fan usage (hours/day)</FormLabel>
                        <FormControl>
                          <Input
                            id="fan-hours"
                            type="number"
                            min={0}
                            max={24}
                            aria-describedby="fan-hours-msg"
                            data-testid="input-fan-hours"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage id="fan-hours-msg" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="monthlyElectricityBill"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="electricity-bill">
                          Average monthly electricity bill ($)
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="electricity-bill"
                            type="number"
                            min={0}
                            aria-describedby="electricity-bill-msg"
                            data-testid="input-electricity-bill"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage id="electricity-bill-msg" />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {step === 3 && (
              <Card ref={cardRef} data-testid="card-step-food">
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
                          <FormLabel className="text-base" htmlFor="is-vegetarian">
                            Vegetarian Diet
                          </FormLabel>
                          <FormDescription id="is-vegetarian-desc">
                            Do you follow a mostly plant-based diet?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            id="is-vegetarian"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            aria-describedby="is-vegetarian-desc"
                            data-testid="switch-is-vegetarian"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="foodDeliveryPerWeek"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="food-delivery">Food deliveries per week</FormLabel>
                        <FormControl>
                          <Input
                            id="food-delivery"
                            type="number"
                            min={0}
                            aria-describedby="food-delivery-msg"
                            data-testid="input-food-delivery"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage id="food-delivery-msg" />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {step === 4 && (
              <Card ref={cardRef} data-testid="card-step-shopping">
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
                        <FormLabel htmlFor="online-orders">
                          Online packages ordered per month
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="online-orders"
                            type="number"
                            min={0}
                            aria-describedby="online-orders-msg"
                            data-testid="input-online-orders"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage id="online-orders-msg" />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">
                  Review your answers before submitting.
                </CardFooter>
              </Card>
            )}

            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 1 || createAssessment.isPending}
                data-testid="button-prev-step"
              >
                <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Back
              </Button>

              {step < TOTAL_STEPS ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  data-testid="button-next-step"
                >
                  Next <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={createAssessment.isPending}
                  data-testid="button-submit-assessment"
                >
                  {createAssessment.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  )}
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
