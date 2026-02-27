import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Calendar, TrendingUp, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { MoodEntry, InsertMoodEntry } from "@shared/schema";

const emotions = [
  "Happy", "Sad", "Anxious", "Calm", "Angry", "Excited", 
  "Overwhelmed", "Hopeful", "Lonely", "Grateful", "Stressed", "Peaceful"
];

const copingStrategies = [
  "Deep breathing", "Exercise", "Meditation", "Music", "Talking to someone",
  "Journaling", "Taking a walk", "Creative activities", "Reading", "Rest"
];

export default function MoodTracking() {
  const [currentUserId] = useState("user-1");
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [selectedMood, setSelectedMood] = useState<number>(5);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedCoping, setSelectedCoping] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const { data: moodEntries, isLoading } = useQuery<MoodEntry[]>({
    queryKey: ['/api/mood-entries', currentUserId],
  });

  const createMoodMutation = useMutation({
    mutationFn: (newMood: InsertMoodEntry) => 
      apiRequest('/api/mood-entries', {
        method: 'POST',
        body: JSON.stringify(newMood),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mood-entries', currentUserId] });
      toast({ 
        title: "Mood recorded", 
        description: "Your mood entry has been saved successfully." 
      });
      resetForm();
    },
    onError: () => {
      toast({ 
        title: "Error", 
        description: "Failed to save mood entry. Please try again.",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setShowNewEntry(false);
    setSelectedMood(5);
    setSelectedEmotions([]);
    setSelectedCoping([]);
    setNotes("");
  };

  const handleSubmit = () => {
    const moodEntry: InsertMoodEntry = {
      userId: currentUserId,
      mood: selectedMood,
      emotions: selectedEmotions,
      notes: notes.trim() || undefined,
      copingStrategies: selectedCoping,
      timestamp: new Date().toISOString(),
    };

    createMoodMutation.mutate(moodEntry);
  };

  const getMoodColor = (mood: number) => {
    if (mood >= 8) return "bg-green-500";
    if (mood >= 6) return "bg-yellow-500";
    if (mood >= 4) return "bg-orange-500";
    if (mood >= 2) return "bg-red-400";
    return "bg-red-600";
  };

  const getMoodEmoji = (mood: number) => {
    if (mood >= 8) return "😊";
    if (mood >= 6) return "🙂";
    if (mood >= 4) return "😐";
    if (mood >= 2) return "😔";
    return "😢";
  };

  const getMoodLabel = (mood: number) => {
    if (mood >= 8) return "Excellent";
    if (mood >= 6) return "Good";
    if (mood >= 4) return "Okay";
    if (mood >= 2) return "Poor";
    return "Very Difficult";
  };

  const toggleEmotion = (emotion: string) => {
    setSelectedEmotions(prev => 
      prev.includes(emotion) 
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const toggleCoping = (strategy: string) => {
    setSelectedCoping(prev => 
      prev.includes(strategy) 
        ? prev.filter(s => s !== strategy)
        : [...prev, strategy]
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading mood entries...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mood Tracking</h1>
        <p className="text-muted-foreground">
          Track your daily mood to better understand patterns and progress over time.
        </p>
      </div>

      {/* Add New Mood Entry */}
      <div className="mb-8">
        {!showNewEntry ? (
          <Button 
            onClick={() => setShowNewEntry(true)}
            className="w-full md:w-auto"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            Record Today's Mood
          </Button>
        ) : (
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-6">How are you feeling today?</h2>
            
            {/* Mood Scale */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                Mood Level: {selectedMood}/10 - {getMoodLabel(selectedMood)} {getMoodEmoji(selectedMood)}
              </label>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Very Difficult</span>
                <span className="text-sm text-muted-foreground">Excellent</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={selectedMood}
                onChange={(e) => setSelectedMood(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                  <span key={num}>{num}</span>
                ))}
              </div>
            </div>

            {/* Emotions */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                What emotions are you experiencing? (Select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {emotions.map(emotion => (
                  <button
                    key={emotion}
                    onClick={() => toggleEmotion(emotion)}
                    className={`px-3 py-2 rounded-full text-sm border transition-colors ${
                      selectedEmotions.includes(emotion)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:bg-muted'
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
            </div>

            {/* Coping Strategies */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                What coping strategies have you used or plan to use today?
              </label>
              <div className="flex flex-wrap gap-2">
                {copingStrategies.map(strategy => (
                  <button
                    key={strategy}
                    onClick={() => toggleCoping(strategy)}
                    className={`px-3 py-2 rounded-full text-sm border transition-colors ${
                      selectedCoping.includes(strategy)
                        ? 'bg-secondary text-secondary-foreground border-secondary'
                        : 'bg-background border-border hover:bg-muted'
                    }`}
                  >
                    {strategy}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                Additional notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How was your day? What influenced your mood? Any thoughts you'd like to record..."
                className="w-full p-3 border rounded-lg resize-none h-24 bg-background"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                onClick={handleSubmit}
                disabled={createMoodMutation.isPending}
                className="flex-1"
              >
                {createMoodMutation.isPending ? "Saving..." : "Save Mood Entry"}
              </Button>
              <Button 
                variant="outline" 
                onClick={resetForm}
                disabled={createMoodMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mood History */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Your Mood History</h2>
        {moodEntries && moodEntries.length > 0 ? (
          <div className="space-y-4">
            {moodEntries.map((entry) => (
              <div key={entry.id} className="bg-card p-6 rounded-lg border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${getMoodColor(entry.mood)}`}>
                      {entry.mood}
                    </div>
                    <div>
                      <div className="font-medium">
                        {getMoodLabel(entry.mood)} ({entry.mood}/10)
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                </div>

                {entry.emotions && entry.emotions.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-2">Emotions:</div>
                    <div className="flex flex-wrap gap-2">
                      {entry.emotions.map(emotion => (
                        <span key={emotion} className="px-2 py-1 bg-muted rounded text-sm">
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {entry.copingStrategies && entry.copingStrategies.length > 0 && (
                  <div className="mb-3">
                    <div className="text-sm font-medium mb-2">Coping Strategies:</div>
                    <div className="flex flex-wrap gap-2">
                      {entry.copingStrategies.map(strategy => (
                        <span key={strategy} className="px-2 py-1 bg-secondary/20 rounded text-sm">
                          {strategy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {entry.notes && (
                  <div>
                    <div className="text-sm font-medium mb-2">Notes:</div>
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded">
                      {entry.notes}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No mood entries yet</h3>
            <p className="text-muted-foreground mb-6">
              Start tracking your mood to see patterns and progress over time.
            </p>
            <Button onClick={() => setShowNewEntry(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Record Your First Mood
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}