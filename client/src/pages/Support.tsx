import { PhoneCall, MessageCircleHeart, ShieldCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function Support() {
  const [, setLocation] = useLocation();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Support</h1>
        </div>
        <p className="mt-2 text-lg text-muted-foreground">
          Reach out to people and tools that can help you feel less alone right now.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Immediate support</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            If you are in danger or might act on suicidal thoughts, use crisis support immediately.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button className="bg-red-600 text-white hover:bg-red-700" onClick={() => setLocation("/crisis")}>
              <PhoneCall className="mr-2 h-4 w-4" />
              Open Crisis Support
            </Button>
            <Button variant="outline" onClick={() => setLocation("/safety-plan")}>
              View Safety Plan
            </Button>
          </div>
        </section>

        <section className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <MessageCircleHeart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Gentle next steps</h2>
          </div>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Text one person you trust and say you need company.</li>
            <li>Move to a place where other people are nearby.</li>
            <li>Put some distance between you and anything harmful.</li>
            <li>Drink water and take a few slow breaths.</li>
          </ul>
        </section>

        <section className="rounded-lg border bg-card p-6 shadow-sm md:col-span-2">
          <h2 className="text-lg font-semibold">Who can you contact?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Make a short list of people you can reach out to when your feelings get heavy.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setLocation("/journal")}>
              Write what you need
            </Button>
            <Button variant="outline" onClick={() => setLocation("/virtual-parent")}>
              Talk to Virtual Parent
            </Button>
            <Button variant="outline" onClick={() => setLocation("/resources")}>
              Open Resources
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
