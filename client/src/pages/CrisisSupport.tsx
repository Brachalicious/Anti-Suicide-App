import { useQuery } from "@tanstack/react-query";
import { Phone, MessageCircle, Globe, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CrisisHotline } from "@shared/schema";

export default function CrisisSupport() {
  const { data: hotlines, isLoading } = useQuery<CrisisHotline[]>({
    queryKey: ['/api/crisis-hotlines'],
  });

  const { data: emergencyResources, isLoading: resourcesLoading } = useQuery({
    queryKey: ['/api/resources', 'emergency'],
    queryFn: () => fetch('/api/resources?emergency=true').then(res => res.json()),
  });

  const callHotline = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading crisis support resources...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Crisis Banner */}
      <div className="crisis-banner p-6 rounded-lg mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">You Are Not Alone</h1>
        <p className="text-lg mb-4">
          If you're having thoughts of suicide or are in crisis, please reach out for help immediately.
        </p>
        <div className="text-sm opacity-90">
          These resources are available 24/7 and completely confidential.
        </div>
      </div>

      {/* Immediate Action Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
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
                  <Button
                    onClick={() => callHotline(hotline.phoneNumber)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    {hotline.phoneNumber}
                  </Button>
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

      {/* Emergency Coping Resources */}
      {emergencyResources && emergencyResources.length > 0 && (
        <div>
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