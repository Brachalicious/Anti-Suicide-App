import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useLocation } from "wouter";
import { Phone, MessageCircle, Globe, Clock, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiUrl } from "@/lib/apiBase";
import type { CrisisHotline } from "@shared/schema";

export default function CrisisSupport() {
  const [, setLocation] = useLocation();
  const ventLaunchRef = useRef(false);

  const { data: hotlines, isLoading } = useQuery<CrisisHotline[]>({
    queryKey: ['/api/crisis-hotlines'],
    queryFn: () => fetch(apiUrl("/api/crisis-hotlines")).then((res) => res.json()),
  });

  const { data: emergencyResources } = useQuery({
    queryKey: ['/api/resources', 'emergency'],
    queryFn: () => fetch(apiUrl("/api/resources?emergency=true")).then((res) => res.json()),
  });

  const getDialHref = (phoneNumber: string) => {
    const normalized = phoneNumber.replace(/[^\d+]/g, "");
    if (!normalized || normalized === "+") return null;
    return `tel:${normalized}`;
  };

  const callHotline = (phoneNumber: string) => {
    const href = getDialHref(phoneNumber);
    if (!href) return;
    window.location.href = href;
  };

  const handleStartTalking = () => {
    if (ventLaunchRef.current) return;
    ventLaunchRef.current = true;
    setLocation("/virtual-parent");
  };

  const handleReadSupportMessage = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      "You are not alone. If you are in immediate danger, call 988, text HOME to 741741, or call emergency services now. You can also use the coping strategies and safety plan on this page to get through the next few minutes."
    );
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading crisis support resources...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Crisis Banner */}
      <div className="crisis-banner p-6 rounded-lg mb-8 text-left">
        <h1 className="text-3xl font-bold mb-2">You Are Not Alone</h1>
        <p className="text-lg mb-4">
          If you're having thoughts of suicide or are in crisis, please reach out for help immediately.
        </p>
        <div className="text-sm opacity-90">
          These resources are available 24/7 and completely confidential.
        </div>
      </div>

      {/* Crisis Tools */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Crisis Tools</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={() => document.getElementById("emergency-contacts")?.scrollIntoView({ behavior: "smooth" })}
          >
            📞 Emergency Contacts
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={() => document.getElementById("coping-strategies")?.scrollIntoView({ behavior: "smooth" })}
          >
            🔧 Coping Strategies
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={() => setLocation("/safety-plan")}
          >
            🛡️ My Safety Plan
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={() => document.getElementById("breathing-exercises")?.scrollIntoView({ behavior: "smooth" })}
          >
            🌬️ Breathing Exercises
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={() => document.getElementById("progressive-muscle-relaxation")?.scrollIntoView({ behavior: "smooth" })}
          >
            💪 Progressive Muscle Relaxation
          </Button>
          <Button
            variant="outline"
            className="justify-start h-auto py-4"
            onClick={() => document.getElementById("guided-meditation")?.scrollIntoView({ behavior: "smooth" })}
          >
            🧘 Guided Meditation
          </Button>
        </div>
      </div>

  {/* Immediate Action Section */}
  <div id="emergency-contacts" className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-center">Emergency Services</h2>
          <div className="space-y-3">
            <Button 
              onClick={() => callHotline('911')}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3"
              size="lg"
            >
              <Phone className="mr-2 h-5 w-5" />
              Call 911
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              For immediate life-threatening emergencies
            </p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-center">Crisis Text Line</h2>
          <div className="space-y-3">
            <Button 
              onClick={() => window.location.href = 'sms:741741?body=HOME'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
              size="lg"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Text HOME to 741741
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Free, confidential crisis counseling via text
            </p>
          </div>
        </div>
      </div>

      {/* Crisis Hotlines */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Crisis Hotlines</h2>
        <div className="space-y-4">
          {hotlines?.map((hotline) => (
            <div key={hotline.id} className="bg-card p-6 rounded-lg border shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{hotline.name}</h3>
                  <p className="text-muted-foreground mb-2">{hotline.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {hotline.available247 ? "24/7 Available" : "Limited Hours"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      {hotline.languages.join(", ")}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {getDialHref(hotline.phoneNumber) ? (
                    <Button
                      onClick={() => callHotline(hotline.phoneNumber)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Phone className="mr-2 h-4 w-4" />
                      {hotline.phoneNumber}
                    </Button>
                  ) : hotline.phoneNumber.toLowerCase().includes("text") ? (
                    <Button
                      onClick={() => window.location.href = "sms:741741?body=HOME"}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Text 741741
                    </Button>
                  ) : (
                    <div className="rounded-md border px-3 py-2 text-center text-sm text-muted-foreground">
                      {hotline.phoneNumber}
                    </div>
                  )}
                  {hotline.website && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(hotline.website, '_blank')}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Visit Website
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Talk It Out */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Talk It Out</h2>
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <p className="text-muted-foreground mb-4">
            Just talk. Say whatever comes to mind — even gobbledegook. The bot will go with it,
            respond to you, and help you regulate when you need a gentle place to land.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button className="bg-primary hover:bg-primary/90" onClick={handleStartTalking}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Start Talking
            </Button>
            <Button variant="outline" onClick={handleReadSupportMessage}>
              <Volume2 className="mr-2 h-4 w-4" />
              Volume
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Use the volume button if you need the response read out loud or softer.
          </p>
        </div>
      </div>

      {/* Emergency Coping Resources */}
      {emergencyResources && emergencyResources.length > 0 && (
        <div id="coping-strategies">
          <h2 className="text-2xl font-semibold mb-6">Immediate Coping Strategies</h2>
          <div className="space-y-4">
            {emergencyResources.map((resource: any) => (
              <div key={resource.id} className="bg-card p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {resource.content}
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Estimated reading time: {resource.readTime} minutes
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regulation Exercises */}
      <div className="mt-8 space-y-4">
        <div id="breathing-exercises" className="bg-card p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Breathing Exercises</h3>
          <p className="text-muted-foreground">
            Try 4-4-6 breathing: inhale for 4, hold for 4, exhale for 6. Repeat until your body softens.
          </p>
        </div>
        <div id="progressive-muscle-relaxation" className="bg-card p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Progressive Muscle Relaxation</h3>
          <p className="text-muted-foreground">
            Tense and release one muscle group at a time (hands, shoulders, jaw, legs) to help your body unwind.
          </p>
        </div>
        <div id="guided-meditation" className="bg-card p-6 rounded-lg border shadow-sm">
          <h3 className="text-lg font-semibold mb-2">Guided Meditation</h3>
          <p className="text-muted-foreground">
            Focus on a calming voice or short visualization. Even 2–3 minutes can help you reset.
          </p>
        </div>
      </div>

      {/* Affirmation */}
      <div className="mt-8 bg-card p-6 rounded-lg border shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Affirmation</h3>
        <p className="text-muted-foreground">
          “Let the good in me connect with the good in others, until all the world is transformed
          through the compelling power of love.”
        </p>
        <p className="text-xs text-muted-foreground mt-2">— Rabbi Nachman</p>
      </div>

      {/* Footer Message */}
      <div className="mt-12 text-center p-6 bg-card rounded-lg border">
        <p className="text-lg font-medium mb-2">Remember: This feeling is temporary</p>
        <p className="text-muted-foreground">
          Crisis moments pass. You have survived difficult times before, and you can get through this too.
          Professional help and support are available.
        </p>
      </div>
    </div>
  );
}
