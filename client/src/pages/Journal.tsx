import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { BookOpen, ArrowLeft, Edit3, Plus, Save, Sparkles, Trash2, X } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { InsertJournalEntry, JournalEntry } from "@shared/schema";

export default function Journal() {
  const [currentUserId] = useState("user-1");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState(5);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const { toast } = useToast();

  const { data: entries, isLoading } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal-entries", currentUserId],
    queryFn: () =>
      apiRequest(`/api/journal-entries/${currentUserId}`, {
        method: "GET",
      }),
  });

  const resetForm = () => {
    setTitle("");
    setContent("");
    setMood(5);
    setEditingEntry(null);
  };

  const saveJournalMutation = useMutation({
    mutationFn: (entry: InsertJournalEntry) => {
      if (editingEntry) {
        return apiRequest(`/api/journal-entries/${editingEntry.id}`, {
          method: "PATCH",
          body: JSON.stringify(entry),
        });
      }
      return apiRequest("/api/journal-entries", {
        method: "POST",
        body: JSON.stringify(entry),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/journal-entries", currentUserId] });
      toast({
        title: editingEntry ? "Journal entry updated" : "Journal entry saved",
        description: "Your private journal has been updated.",
      });
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save journal entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteJournalMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/api/journal-entries/${id}`, {
        method: "DELETE",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/journal-entries", currentUserId] });
      toast({
        title: "Journal entry deleted",
        description: "The entry was removed.",
      });
      if (editingEntry) resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete journal entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title ?? "");
    setContent(entry.content);
    setMood(entry.mood ?? 5);
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Entry is empty",
        description: "Write something before saving your journal entry.",
        variant: "destructive",
      });
      return;
    }

    saveJournalMutation.mutate({
      userId: currentUserId,
      title: title.trim() || undefined,
      content: content.trim(),
      mood,
      isPrivate: true,
      tags: [],
      timestamp: editingEntry?.timestamp ?? new Date().toISOString(),
    });
  };

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
          <div className="mb-4 flex items-center gap-2">
            {editingEntry ? <Edit3 className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
            <h2 className="text-lg font-semibold">{editingEntry ? "Edit journal entry" : "New journal entry"}</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="journal-title" className="text-sm font-medium">
                Title (optional)
              </label>
              <input
                id="journal-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="A short title for this moment"
                className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label htmlFor="journal-mood" className="text-sm font-medium">
                Mood: {mood}/10
              </label>
              <input
                id="journal-mood"
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="mt-2 w-full"
              />
            </div>

            <div>
              <label htmlFor="journal-content" className="text-sm font-medium">
                What is on your mind?
              </label>
              <Textarea
                id="journal-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write privately here..."
                className="mt-2 min-h-[180px]"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleSubmit} disabled={saveJournalMutation.isPending}>
                <Save className="mr-2 h-4 w-4" />
                {saveJournalMutation.isPending ? "Saving..." : editingEntry ? "Update Entry" : "Save Entry"}
              </Button>
              {(editingEntry || title || content) && (
                <Button variant="outline" onClick={resetForm} disabled={saveJournalMutation.isPending}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </section>

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

        <section className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Your journal history</h2>
          {isLoading ? (
            <p className="mt-4 text-sm text-muted-foreground">Loading journal entries...</p>
          ) : entries && entries.length > 0 ? (
            <div className="mt-4 space-y-3">
              {entries.map((entry) => (
                <article key={entry.id} className="rounded-lg border p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="font-medium">{entry.title || "Untitled entry"}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleString()} • Mood {entry.mood ?? "not set"}/10
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(entry)}>
                        <Edit3 className="mr-2 h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteJournalMutation.mutate(entry.id)}
                        disabled={deleteJournalMutation.isPending}
                      >
                        <Trash2 className="mr-2 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">{entry.content}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">No journal entries yet. Save your first entry above.</p>
          )}
        </section>
      </div>
    </div>
  );
}
