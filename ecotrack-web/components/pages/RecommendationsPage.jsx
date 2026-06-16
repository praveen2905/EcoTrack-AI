"use client";

/**
 * @module components/pages/RecommendationsPage
 * @description Page offering AI-curated carbon reduction insights and an interactive
 * simulated chatbot drawer that pulls real carbon metrics to deliver custom feedback.
 */

import { useMemo, useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Zap, Car, ShoppingBag, Utensils, MessageSquare, Send, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { fetchApi } from "@/lib/api";

const CATEGORY_ICONS = {
  transport: <Car className="h-5 w-5" />,
  electricity: <Zap className="h-5 w-5" />,
  food: <Utensils className="h-5 w-5" />,
  shopping: <ShoppingBag className="h-5 w-5" />,
};

const PRIORITY_VARIANTS = { high: "destructive", medium: "default", low: "secondary" };

/**
 * RecommendationsPage component which displays automated insights and lets users chat with the AI.
 *
 * @returns {React.ReactElement} The rendered RecommendationsPage.
 */
export default function RecommendationsPage() {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ["recommendations"],
    queryFn: () => fetchApi("/api/recommendations"),
  });

  const { data: summary } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: () => fetchApi("/api/dashboard/summary"),
  });

  const [chatOpen, setChatOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hello! I am your EcoTrack AI Assistant. I can help analyze your carbon footprint and guide you on the most effective ways to lower your emissions. Ask me anything!",
    },
  ]);

  const chatEndRef = useRef(null);

  // Auto-scroll to the bottom of the chat drawer
  useEffect(() => {
    if (chatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, chatOpen]);

  const sorted = useMemo(() => {
    if (!recommendations) return [];
    const order = { high: 0, medium: 1, low: 2 };
    return [...recommendations].sort(
      (a, b) => (order[a.priority.toLowerCase()] ?? 3) - (order[b.priority.toLowerCase()] ?? 3)
    );
  }, [recommendations]);

  const presetPrompts = [
    "How can I reduce my transportation emissions?",
    "Is a vegetarian diet better for the environment?",
    "How do cooling and AC impact my footprint?",
    "Tell me about my carbon score relative to others.",
  ];

  /**
   * Generates a simulated response from the AI based on the user's current summary metrics.
   *
   * @param {string} prompt - The user's query text.
   * @returns {string} The simulated response.
   */
  const getSimulatedResponse = (prompt) => {
    const p = prompt.toLowerCase();
    const emissions = summary?.totalEmissionsThisMonth ?? 95;
    const score = summary?.carbonScore ?? 62;
    const transport = summary?.categoryBreakdown?.transport ?? 45;
    const electricity = summary?.categoryBreakdown?.electricity ?? 30;

    if (p.includes("transport")) {
      return `Based on your metrics, your transport emissions are estimated at ${transport.toFixed(0)} kg CO₂ per month. To cut this down, try bundling trips together, choosing active transit (like biking or walking) for journeys under 2 km, or work from home 1-2 days weekly. This can reduce your transport footprint by up to 25%!`;
    }
    if (p.includes("diet") || p.includes("vegetarian") || p.includes("food")) {
      return "Food is one of the easiest areas to start making changes. Swapping beef or lamb for chicken, fish, or plant-based proteins just twice a week can save roughly 15 kg of carbon emissions per month. Minimizing food delivery also reduces the packaging and courier transit footprint.";
    }
    if (p.includes("cooling") || p.includes("ac") || p.includes("electricity") || p.includes("bill")) {
      return `Your home electricity footprint accounts for around ${electricity.toFixed(0)} kg CO₂ monthly. Cooling (AC) is a significant power consumer. Raising your thermostat by just 1°C can decrease your cooling energy load by 6-10%. You can also utilize ceiling fans to circulate air, which consume less than 10% of the power of an AC.`;
    }
    if (p.includes("score") || p.includes("compare") || p.includes("average")) {
      return `Your current Carbon Score is ${score}/100, and your monthly emissions are ${emissions.toFixed(0)} kg CO₂. Compared to the average user's emissions of ${summary?.averageUserEmissions ?? 185} kg CO₂, you are in a great position! Keeping up with small habits will push you closer to a perfect score.`;
    }
    return "I'm happy to help with that! To achieve a sustainable lifestyle, I recommend tackling one high-priority insight at a time. Take a look at the Insights cards on the dashboard, or accept some challenges in the 'Challenges' page to start building consistent carbon-saving habits!";
  };

  /**
   * Sends a message in the chat drawer.
   *
   * @param {string} text - Message text.
   */
  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setIsTyping(true);

    setTimeout(() => {
      const response = getSimulatedResponse(text);
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSendText = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText("");
    }
  };

  const handleSendPreset = (prompt) => {
    sendMessage(prompt);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
            <p className="text-muted-foreground">Personalized recommendations to reduce your footprint.</p>
          </div>
          
          <Sheet open={chatOpen} onOpenChange={setChatOpen}>
            <SheetTrigger asChild>
              <Button className="gap-2" aria-label="Open AI chat session">
                <MessageSquare className="h-4 w-4" /> Chat with AI
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-md flex flex-col h-full bg-background border-l p-6">
              <SheetTitle className="text-xl font-bold border-b pb-4 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" aria-hidden="true" /> EcoTrack AI Assistant
              </SheetTitle>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-1" role="log" aria-label="AI chat log">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground font-medium rounded-tr-none"
                          : "bg-muted border rounded-tl-none text-foreground"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted border rounded-lg rounded-tl-none px-4 py-2.5 text-sm flex gap-1.5 items-center" aria-label="AI is typing...">
                      <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Predefined prompt questions */}
              {messages.length === 1 && !isTyping && (
                <div className="space-y-2 border-t pt-4">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Ask about your report:</p>
                  <div className="flex flex-col gap-2">
                    {presetPrompts.map((promptText, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendPreset(promptText)}
                        className="text-left text-xs bg-muted/65 hover:bg-muted border p-2.5 rounded-lg transition-colors font-medium text-foreground/85 hover:text-foreground outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        {promptText}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Typing Input Box */}
              <div className="border-t pt-4 mt-auto">
                <form onSubmit={handleSendText} className="flex gap-2">
                  <Input
                    placeholder="Ask about carbon reduction..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    disabled={isTyping}
                    className="flex-1"
                    aria-label="Chat input message"
                  />
                  <Button type="submit" disabled={isTyping || !inputText.trim()} aria-label="Send message">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
          </div>
        ) : sorted.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {sorted.map((rec) => (
              <Card key={rec.id} className="flex flex-col overflow-hidden transition-all">
                <CardHeader className="pb-3 border-b bg-muted/20">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-background rounded-md border shadow-sm text-primary">
                        {CATEGORY_ICONS[rec.category.toLowerCase()] ?? <Lightbulb className="h-5 w-5" />}
                      </div>
                      <div>
                        <CardTitle className="text-base capitalize">{rec.category}</CardTitle>
                        <CardDescription className="text-xs">Saving: ~{rec.estimatedCarbonSaving} kg CO₂/mo</CardDescription>
                      </div>
                    </div>
                    <Badge variant={PRIORITY_VARIANTS[rec.priority.toLowerCase()] ?? "secondary"} className="capitalize">{rec.priority} Priority</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex-1">
                  <div className="space-y-4">
                    <div><h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Insight</h4><p className="text-sm">{rec.insight}</p></div>
                    <div><h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Action</h4><p className="text-sm font-medium">{rec.suggestion}</p></div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="secondary" className="w-full" size="sm">Add to Challenges</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20"><p className="text-muted-foreground">No recommendations available. Take an assessment first.</p></div>
        )}
      </div>
    </MainLayout>
  );
}
