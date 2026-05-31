import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowLeft, Phone, Shield, Save, RotateCcw } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { apiUrl } from "@/lib/apiBase";
import type { InsertSafetyPlan, SafetyPlan } from "@shared/schema";
import { getAuth, onAuthStateChanged } from "firebase/auth";

type SafetyPlanFormState = {
  warningSignals: string;
  copingStrategies: string;
  socialSupports: string;
  professionalContacts: string;
  environmentalSafety: string;
};

const emptyFormState: SafetyPlanFormState = {
  warningSignals: "",
  copingStrategies: "",
  socialSupports: "",
  professionalContacts: "",
  environmentalSafety: "",
};

function listToText(items: string[] | undefined): string {
  return items?.join("\n") ?? "";
}

function textToList(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export default function SafetyPlan() {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [form, setForm] = useState<SafetyPlanFormState>(emptyFormState);
  const { toast } = useToast();

  // Get current user from Firebase
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        console.log('🔐 User logged in:', user.uid);
      } else {
        setCurrentUserId(null);
        console.log('🔐 No user logged in');
      }
    });
    return () => unsubscribe();
  }, []);

  const { data: safetyPlan, isLoading } = useQuery<SafetyPlan | null>({
    queryKey: ["/api/safety-plans", currentUserId],
    queryFn: async () => {
      if (!currentUserId) return null;
      
      const response = await fetch(apiUrl(`/api/safety-plans/${currentUserId}`), {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        throw new Error(`Failed to load safety plan (${response.status})`);
      }

      return (await response.json()) as SafetyPlan;
    },
    enabled: !!currentUserId,
  });

  useEffect(() => {
    if (!safetyPlan) return;

    setForm({
      warningSignals: listToText(safetyPlan.warningSignals),
      copingStrategies: listToText(safetyPlan.copingStrategies),
      socialSupports: listToText(safetyPlan.socialSupports),
      professionalContacts: listToText(safetyPlan.professionalContacts),
      environmentalSafety: listToText(safetyPlan.environmentalSafety),
    });
  }, [safetyPlan]);

  const hasAnyContent = useMemo(() => {
    return Object.values(form).some((value) => value.trim().length > 0);
  }, [form]);

  const saveSafetyPlan = useMutation({
    mutationFn: async (): Promise<InsertSafetyPlan> => {
      if (!currentUserId) {
        throw new Error("User not authenticated");
      }

      const payload: InsertSafetyPlan = {
        userId: currentUserId,
        warningSignals: textToList(form.warningSignals),
        copingStrategies: textToList(form.copingStrategies),
        socialSupports: textToList(form.socialSupports),
        professionalContacts: textToList(form.professionalContacts),
        environmentalSafety: textToList(form.environmentalSafety),
        lastUpdated: new Date().toISOString(),
      };

      const url = safetyPlan ? `/api/safety-plans/${safetyPlan.id}` : "/api/safety-plans";
      const method = safetyPlan ? "PATCH" : "POST";

      return apiRequest(url, {
        method,
        body: JSON.stringify(payload),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/safety-plans", currentUserId] });
      toast({
        title: safetyPlan ? "Safety plan updated" : "Safety plan saved",
        description: "Your safety plan has been stored successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save your safety plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetToSavedPlan = () => {
    if (!safetyPlan) {
      setForm(emptyFormState);
      return;
    }

    setForm({
      warningSignals: listToText(safetyPlan.warningSignals),
      copingStrategies: listToText(safetyPlan.copingStrategies),
      socialSupports: listToText(safetyPlan.socialSupports),
      professionalContacts: listToText(safetyPlan.professionalContacts),
      environmentalSafety: listToText(safetyPlan.environmentalSafety),
    });
  };

  const handleSubmit = () => {
    if (!hasAnyContent) {
      toast({
        title: "Nothing to save",
        description: "Add at least one item to your safety plan before saving.",
        variant: "destructive",
      });
      return;
    }

    saveSafetyPlan.mutate();
  };

  const sections = [
    {
      key: "warningSignals" as const,
      title: "Warning signs",
      description: "What tells you that things are getting harder?",
      placeholder: "One warning sign per line",
    },
    {
      key: "copingStrategies" as const,
      title: "Coping strategies",
      description: "What helps you get through the next 10 minutes?",
      placeholder: "One coping strategy per line",
    },
    {
      key: "socialSupports" as const,
      title: "Social supports",
      description: "Who can you reach out to for comfort or distraction?",
      placeholder: "One person or support per line",
    },
    {
      key: "professionalContacts" as const,
      title: "Professional contacts",
      description: "Therapists, counselors, hotlines, doctors, or crisis services.",
      placeholder: "One contact per line",
    },
    {
      key: "environmentalSafety" as const,
      title: "Environmental safety steps",
      description: "What can make your space safer right now?",
      placeholder: "One safety step per line",
    },
  ];

  if (isLoading && !safetyPlan) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading safety plan...</div>
      </div>
    );
  }

  if (!currentUserId) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 px-0 hover:bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
          <AlertTriangle className="mx-auto mb-4 h-8 w-8 text-amber-600" />
          <h2 className="mb-2 text-xl font-semibold text-amber-900">Login Required</h2>
          <p className="text-amber-800">
            Please log in to save and access your safety plan. Your safety plan is personal to you and will be securely stored with your account.
          </p>
        </div>
      </div>
    );
  }

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
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Safety Plan</h1>
        </div>
        <p className="mt-2 text-lg text-muted-foreground">
          Build a simple, private plan you can use when things get hard. Keep it short, specific, and easy to follow.
        </p>
      </div>

      <div className="space-y-4">
        <section className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-semibold">If you are in immediate danger</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Call 988, text HOME to 741741, or call emergency services right now. Do not stay alone with the crisis.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href="tel:988">
              <Button className="bg-red-600 text-white hover:bg-red-700">
                <Phone className="mr-2 h-4 w-4" />
                Call 988
              </Button>
            </a>
            <Link href="/crisis">
              <Button variant="outline">Open Crisis Support</Button>
            </Link>
          </div>
        </section>

        <section className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Your safety plan</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Write one item per line in each section. You can leave a section blank if it does not apply right now.
          </p>

          <div className="mt-6 space-y-5">
            {sections.map((section) => (
              <div key={section.key}>
                <label className="block text-sm font-medium text-foreground">{section.title}</label>
                <p className="mt-1 text-xs text-muted-foreground">{section.description}</p>
                <Textarea
                  value={form[section.key]}
                  onChange={(e) => setForm((current) => ({ ...current, [section.key]: e.target.value }))}
                  placeholder={section.placeholder}
                  className="mt-2 min-h-[96px]"
                />
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={handleSubmit} disabled={saveSafetyPlan.isPending} className="min-w-40">
              <Save className="mr-2 h-4 w-4" />
              {saveSafetyPlan.isPending ? "Saving..." : safetyPlan ? "Update Safety Plan" : "Save Safety Plan"}
            </Button>
            <Button variant="outline" onClick={resetToSavedPlan} disabled={saveSafetyPlan.isPending}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset to Saved
            </Button>
          </div>

          {safetyPlan && (
            <p className="mt-4 text-xs text-muted-foreground">
              Last updated: {new Date(safetyPlan.lastUpdated).toLocaleString()}
            </p>
          )}
        </section>

        <section className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">What a safety plan usually includes</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Warning signs that tell you you’re slipping.</li>
            <li>Things that help you calm down or get grounded.</li>
            <li>People you can contact and what to say.</li>
            <li>Places you can go to feel safer.</li>
            <li>Steps to reduce access to anything harmful.</li>
          </ul>
        </section>

        <section className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Need a gentle reset?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Use breathing, journaling, or a short support session before making any big decisions.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/resources">
              <Button variant="outline">Open Resources</Button>
            </Link>
            <Link href="/virtual-parent">
              <Button variant="outline">Talk to Virtual Parent</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
