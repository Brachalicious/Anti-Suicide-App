import { BookOpen, ArrowLeft, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Journal() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" className="mb-4 px-0 hover:bg-transparent">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="flex items-center gap-3">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Journal</h1>
        </div>
        <p className="mt-2 text-lg text-muted-foreground">
          A calm place to slow down, write what’s real, and notice patterns in your thoughts and feelings.
        </p>
      </div>

      <div className="space-y-4">
        <section className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">What to write about</h2>
          </div>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>What happened today and how it felt.</li>
            <li>What helped, what hurt, and what you need next.</li>
            <li>One small thing you’re proud of, even if it felt tiny.</li>
            <li>Anything you want to remember for later.</li>
          </ul>
        </section>

        <section className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Need support right now?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            If journaling brings up overwhelm or a crisis, switch to immediate support instead of sitting with it alone.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/crisis">
              <Button className="bg-red-600 text-white hover:bg-red-700">Go to Crisis Support</Button>
            </Link>
            <Link href="/resources">
              <Button variant="outline">Open Resources</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
