import { useQuery } from "@tanstack/react-query";
import { Brain, Clock, Sparkles, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiUrl } from "@/lib/apiBase";
import type { WellnessActivity } from "@shared/schema";
import { useLocation } from "wouter";

export default function Wellness() {
  const { data: activities, isLoading } = useQuery<WellnessActivity[]>({
    queryKey: ["/api/wellness-activities"],
    queryFn: async () => {
      const response = await fetch(apiUrl("/api/wellness-activities"));
      if (!response.ok) {
        throw new Error(`Failed to load wellness activities (${response.status})`);
      }
      return (await response.json()) as WellnessActivity[];
    },
  });
  const [, setLocation] = useLocation();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <WandSparkles className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Wellness</h1>
        </div>
        <p className="mt-2 text-lg text-muted-foreground">
          Small grounding practices and gentle routines to help you reset.
        </p>
      </div>

      <section className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Quick reset</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Pause, unclench your jaw, and take three slow breaths before choosing a next step.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={() => setLocation("/mood")}>Check In Mood</Button>
          <Button variant="outline" onClick={() => setLocation("/journal")}>Write in Journal</Button>
          <Button variant="outline" onClick={() => setLocation("/crisis")}>Open Crisis Support</Button>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold">Wellness activities</h2>
        </div>

        {isLoading ? (
          <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
            Loading wellness activities...
          </div>
        ) : activities && activities.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {activities.map((activity) => (
              <article key={activity.id} className="rounded-lg border bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">{activity.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {activity.difficulty}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {activity.duration} min
                  </span>
                  <span className="rounded-full bg-muted px-2 py-1">{activity.category}</span>
                </div>

                <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm">
                  {activity.instructions.map((step) => (
                    <li key={step} className="text-muted-foreground">
                      {step}
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border bg-card p-6 text-center text-muted-foreground">
            No wellness activities found.
          </div>
        )}
      </section>
    </div>
  );
}
