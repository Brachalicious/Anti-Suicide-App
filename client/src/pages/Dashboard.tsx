import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, BookOpen, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [currentUserId] = useState("user-1"); // In a real app, this would come from auth

  const { data: recentMoods } = useQuery({
    queryKey: ['/api/mood-entries', currentUserId],
  });

  const { data: recentJournals } = useQuery({
    queryKey: ['/api/journal-entries', currentUserId],
  });

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return "😊";
    if (mood >= 6) return "🙂";
    if (mood >= 4) return "😐";
    if (mood >= 2) return "😔";
    return "😢";
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Mental Health Support Hub</h1>
        <p className="text-muted-foreground text-lg">
          Take care of yourself one step at a time. You're not alone in this journey.
        </p>
      </div>

      {/* Crisis Support Banner - Always Visible */}
      <div className="crisis-banner p-4 rounded-lg mb-8 text-left">
        <p className="font-medium mb-2">Need immediate help?</p>
        <Button 
          onClick={() => window.location.href = '/crisis'}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Phone className="mr-2 h-4 w-4" />
          Crisis Support Resources
        </Button>
      </div>

      {/* Recent Activity */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Mood Entries */}
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Recent Mood Check-ins</h3>
          {recentMoods && recentMoods.length > 0 ? (
            <div className="space-y-3">
              {recentMoods.slice(0, 3).map((mood: any) => (
                <div key={mood.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getMoodEmoji(mood.mood)}</span>
                    <div>
                      <div className="font-medium">Mood: {mood.mood}/10</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(mood.timestamp).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {mood.emotions && mood.emotions.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {mood.emotions.slice(0, 2).join(", ")}
                    </div>
                  )}
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full mt-3"
                onClick={() => window.location.href = '/mood'}
              >
                View All Mood Entries
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No mood check-ins yet</p>
              <Button onClick={() => window.location.href = '/mood'}>
                Record Your First Mood
              </Button>
            </div>
          )}
        </div>

        {/* Recent Journal Entries */}
        <div className="bg-card p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Recent Journal Entries</h3>
          {recentJournals && recentJournals.length > 0 ? (
            <div className="space-y-3">
              {recentJournals.slice(0, 3).map((journal: any) => (
                <div key={journal.id} className="p-3 bg-muted rounded-lg">
                  <div className="font-medium mb-1">
                    {journal.title || "Untitled Entry"}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {new Date(journal.timestamp).toLocaleDateString()}
                  </div>
                  <div className="text-sm line-clamp-2">
                    {journal.content.substring(0, 100)}...
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full mt-3"
                onClick={() => window.location.href = '/journal'}
              >
                View All Entries
              </Button>
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">No journal entries yet</p>
              <Button onClick={() => window.location.href = '/journal'}>
                Start Writing
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Supportive Message */}
      <div className="mt-8 text-center p-6 bg-card rounded-lg border">
        <p className="text-lg font-medium mb-2">Remember</p>
        <p className="text-muted-foreground">
          Every small step you take toward caring for your mental health matters. 
          You are worthy of support and healing.
        </p>
      </div>
    </div>
  );
}