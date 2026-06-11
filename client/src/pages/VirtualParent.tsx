import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import {
  Heart,
  Send,
  User,
  Loader2,
  Paperclip,
  X,
  Play,
  Pause,
  Square,
  Save,
  Share2,
  Trash2,
  RotateCcw,
  MessageCircleHeart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Modal } from "@/components/ui/modal";
import { apiUrl } from "@/lib/apiBase";

interface AttachedImage {
  dataUrl: string;
  base64: string;
  mimeType: string;
  name: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  images?: string[];
}

interface SavedSession {
  id: string;
  title: string;
  parentType: "mommy" | "daddy";
  createdAt: string;
  updatedAt: string;
  affirmationTheme: string;
  transcript: string;
  messages: ChatMessage[];
}

interface PlaybackState {
  sessionId: string | null;
  isPlaying: boolean;
  isPaused: boolean;
  utteranceIndex: number;
}

const SESSION_STORAGE_KEY = "virtual-parent-sessions";

const dailyAffirmations = [
  {
    theme: "Your Existence",
    text: "The day you were born was the day Hashem decided the world could not exist without you",
    source: "Rabbi Nachman of Breslov",
  },
  {
    theme: "Choice & Purpose",
    text: "I have set before you life and death... Choose life",
    source: "Deuteronomy 30:19",
  },
  {
    theme: "Trust & Faith",
    text: "The footsteps of humans are directed by G‑d",
    source: "Psalm 37:23",
  },
  {
    theme: "Resilience",
    text: "A righteous person falls down seven times and gets up",
    source: "Proverbs 24:16",
  },
  {
    theme: "Self-Care & Action",
    text: "If I am not for myself, who is for me? And if I am only for myself, what am I? And if not now, when?",
    source: "Hillel, Pirkei Avot 1:14",
  },
  {
    theme: "Identity",
    text: "Every human being is created in the image of God",
    source: "Genesis 1:26",
  },
  {
    theme: "Courage",
    text: "Be strong and courageous",
    source: "Joshua 1:9",
  },
  {
    theme: "Gratitude",
    text: "I am grateful for being able to hear/talk",
    source: "Based on morning blessings",
  },
  {
    theme: "Perspective",
    text: "Who is rich? The one who rejoices in his portion",
    source: "Pirkei Avot 4:1",
  },
  {
    theme: "Presence",
    text: "In all your speech, deeds and thoughts... you are standing in front of G-d",
    source: "Letter of Nachmonides",
  },
  {
    theme: "Love & Connection",
    text: "Let the good in me connect with the good in others, until all the world is transformed through the compelling power of love",
    source: "Rabbi Nachman",
  },
];

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatTimestamp(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function isSpeechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export default function VirtualParent() {
  const [parentType, setParentType] = useState<"mommy" | "daddy">("mommy");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isRecordingSession, setIsRecordingSession] = useState(false);
  const [sessionTitle, setSessionTitle] = useState("");
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [hasLoadedSavedSessions, setHasLoadedSavedSessions] = useState(false);
  const [isSessionsModalOpen, setIsSessionsModalOpen] = useState(false);
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([]);
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    sessionId: null,
    isPlaying: false,
    isPaused: false,
    utteranceIndex: 0,
  });
  const [statusMessage, setStatusMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<ChatMessage[]>([]);
  const liveSessionIdRef = useRef<string | null>(null);
  const playbackCancelRef = useRef(false);
  const speechQueueRef = useRef<SpeechSynthesisUtterance[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) {
        setHasLoadedSavedSessions(true);
        return;
      }

      const parsed = JSON.parse(raw) as SavedSession[];
      if (Array.isArray(parsed)) {
        const cleaned = parsed
          .filter((session): session is SavedSession => {
            return (
              session &&
              typeof session.id === "string" &&
              typeof session.title === "string" &&
              (session.parentType === "mommy" || session.parentType === "daddy") &&
              typeof session.createdAt === "string" &&
              typeof session.affirmationTheme === "string" &&
              typeof session.transcript === "string" &&
              Array.isArray(session.messages)
            );
          })
          .map((session) => ({
            ...session,
            messages: session.messages.filter(
              (entry): entry is ChatMessage =>
                entry &&
                (entry.role === "user" || entry.role === "assistant") &&
                typeof entry.content === "string"
            ),
          }));

        setSavedSessions(cleaned);
      }
    } catch {
      // Ignore malformed saved sessions.
    } finally {
      setHasLoadedSavedSessions(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedSavedSessions) return;
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(savedSessions));
    } catch {
      // Ignore storage errors.
    }
  }, [savedSessions, hasLoadedSavedSessions]);

  const readFile = (file: File): Promise<AttachedImage> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1] ?? "";
        resolve({ dataUrl, base64, mimeType: file.type, name: file.name });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 10);
    const results = await Promise.all(files.map(readFile));
    setAttachedImages((prev) => [...prev, ...results].slice(0, 10));
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setAttachedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const getTodaysAffirmation = () => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );
    return dailyAffirmations[dayOfYear % dailyAffirmations.length];
  };

  const todaysAffirmation = getTodaysAffirmation();
  const parentName = parentType === "mommy" ? "Virtual Mommy" : "Virtual Daddy";
  const parentEmoji = parentType === "mommy" ? "👩‍👧" : "👨‍👧";
  const parentAvatarSrc = "/logo.svg";

  const buildTranscript = (sessionMessages: ChatMessage[], sessionParentType: "mommy" | "daddy") => {
    const speakerName = sessionParentType === "mommy" ? "Virtual Mommy" : "Virtual Daddy";
    return sessionMessages
      .map((entry) => `${entry.role === "user" ? "You" : speakerName}: ${entry.content}`)
      .join("\n\n");
  };

  const snapshotSession = (
    title: string,
    sessionParentType: "mommy" | "daddy",
    sessionMessages: ChatMessage[],
    sessionId?: string
  ): SavedSession => ({
    id: sessionId ?? createId(),
    title,
    parentType: sessionParentType,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    affirmationTheme: todaysAffirmation.theme,
    transcript: buildTranscript(sessionMessages, sessionParentType),
    messages: sessionMessages,
  });

  const upsertSession = (session: SavedSession) => {
    setSavedSessions((current) => {
      const next = [session, ...current.filter((item) => item.id !== session.id)];
      return next;
    });
  };

  const syncRecordingSession = () => {
    if (!isRecordingSession) return;
    if (messagesRef.current.length === 0) return;

    const nextTitle = sessionTitle.trim() || `${todaysAffirmation.theme} session`;
    const session = snapshotSession(nextTitle, parentType, messagesRef.current, liveSessionIdRef.current ?? undefined);
    liveSessionIdRef.current = session.id;
    upsertSession(session);
  };

  useEffect(() => {
    syncRecordingSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, isRecordingSession, parentType, sessionTitle]);

  const stopPlayback = () => {
    if (!isSpeechSupported()) return;
    playbackCancelRef.current = true;
    window.speechSynthesis.cancel();
    speechQueueRef.current = [];
    setPlaybackState({ sessionId: null, isPlaying: false, isPaused: false, utteranceIndex: 0 });
  };

  const speakSessionMessages = (session: SavedSession) => {
    if (!isSpeechSupported()) {
      setStatusMessage("Speech playback is not supported in this browser.");
      return;
    }

    stopPlayback();
    playbackCancelRef.current = false;

    const queue = session.messages
      .filter((entry) => entry.content.trim().length > 0)
      .map((entry) => {
        const utterance = new SpeechSynthesisUtterance(
          `${entry.role === "user" ? "You said" : session.parentType === "mommy" ? "Virtual Mommy said" : "Virtual Daddy said"}: ${entry.content}`
        );
        utterance.rate = 1;
        utterance.pitch = entry.role === "user" ? 1 : 1.05;
        return utterance;
      });

    if (queue.length === 0) {
      setStatusMessage("This session has no transcript to play.");
      return;
    }

    speechQueueRef.current = queue;
    setPlaybackState({
      sessionId: session.id,
      isPlaying: true,
      isPaused: false,
      utteranceIndex: 0,
    });
    setStatusMessage(`Playing "${session.title}".`);

    const speakNext = (index: number) => {
      if (playbackCancelRef.current) return;
      const nextUtterance = speechQueueRef.current[index];
      if (!nextUtterance) {
        setPlaybackState((current) => ({
          ...current,
          isPlaying: false,
          isPaused: false,
          utteranceIndex: index,
        }));
        setStatusMessage(`Finished playing "${session.title}".`);
        return;
      }

      setPlaybackState((current) => ({
        ...current,
        isPlaying: true,
        isPaused: false,
        utteranceIndex: index,
      }));

      nextUtterance.onend = () => speakNext(index + 1);
      nextUtterance.onerror = () => speakNext(index + 1);
      window.speechSynthesis.speak(nextUtterance);
    };

    speakNext(0);
  };

  const handlePlaybackToggle = (session: SavedSession) => {
    if (playbackState.sessionId !== session.id || !playbackState.isPlaying) {
      speakSessionMessages(session);
      return;
    }

    if (!isSpeechSupported()) return;

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setPlaybackState((current) => ({ ...current, isPaused: false }));
      setStatusMessage(`Resumed "${session.title}".`);
    } else {
      window.speechSynthesis.pause();
      setPlaybackState((current) => ({ ...current, isPaused: true }));
      setStatusMessage(`Paused "${session.title}".`);
    }
  };

  const handleToggleRecording = () => {
    if (isRecordingSession) {
      setIsRecordingSession(false);
      liveSessionIdRef.current = null;
      if (messagesRef.current.length > 0) {
        setStatusMessage("Recording stopped. This log remains saved and you can start a fresh one anytime.");
      } else {
        setStatusMessage("Recording stopped.");
      }
      return;
    }

    liveSessionIdRef.current = createId();
    setIsRecordingSession(true);
    setStatusMessage("Recording on. New messages will be saved into this log.");
  };

  const handleSaveSession = () => {
    if (messages.length === 0) return;

    const nextTitle = sessionTitle.trim() || `${todaysAffirmation.theme} session`;
    const session = snapshotSession(nextTitle, parentType, messages, createId());
    upsertSession(session);
    setSessionTitle(nextTitle);
    setStatusMessage(`Saved "${session.title}" as a new log entry.`);
  };

  const handleRestoreSession = (session: SavedSession) => {
    setParentType(session.parentType);
    setMessages(session.messages);
    setIsStarted(session.messages.length > 0);
    setMessage("");
    setAttachedImages([]);
    setSessionTitle(session.title);
    liveSessionIdRef.current = null;
    setIsRecordingSession(false);
    setIsSessionsModalOpen(false);
    stopPlayback();
    setStatusMessage(`Restored "${session.title}". Saving now will create a new log entry.`);
  };

  const handleShareSession = async (session?: SavedSession) => {
    const selectedSession =
      session ??
      (messages.length > 0
        ? snapshotSession(sessionTitle.trim() || `${todaysAffirmation.theme} session`, parentType, messages)
        : null);

    if (!selectedSession) {
      setStatusMessage("Nothing to share yet.");
      return;
    }

    const payload = [
      `MysticMinded33 session: ${selectedSession.title}`,
      `Theme: ${selectedSession.affirmationTheme}`,
      `Parent mode: ${selectedSession.parentType}`,
      "",
      selectedSession.transcript,
    ].join("\n");

    try {
      if (navigator.share) {
        await navigator.share({
          title: selectedSession.title,
          text: payload,
        });
      } else {
        await navigator.clipboard.writeText(payload);
      }
      setStatusMessage(`Shared "${selectedSession.title}".`);
    } catch {
      setStatusMessage("Sharing was cancelled or unavailable.");
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    setSavedSessions((current) => current.filter((session) => session.id !== sessionId));
    if (liveSessionIdRef.current === sessionId) {
      liveSessionIdRef.current = null;
    }
    if (playbackState.sessionId === sessionId) {
      stopPlayback();
    }
    setStatusMessage("Session deleted.");
  };

  const handleSendMessage = async () => {
    if ((!message.trim() && attachedImages.length === 0) || isLoading) return;

    const userMessage = message.trim();
    const imagesToSend = [...attachedImages];
    const nextUserMessage: ChatMessage = {
      role: "user",
      content: userMessage,
      images: imagesToSend.map((img) => img.dataUrl),
    };

    setMessage("");
    setAttachedImages([]);
    setIsLoading(true);
    setIsStarted(true);
    setMessages((prev) => [...prev, nextUserMessage]);

    try {
      const response = await fetch(apiUrl("/api/virtual-parent/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message:
            userMessage ||
            "(User attached image(s), please describe and respond to what you see with warmth and care.)",
          parentType,
          conversationHistory: messagesRef.current,
          images: imagesToSend.map(({ base64, mimeType }) => ({ base64, mimeType })),
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.content) {
              assistantMessage += data.content;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = {
                  role: "assistant",
                  content: assistantMessage,
                };
                return next;
              });
            }
          } catch {
            // ignore parsing errors
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content:
            parentType === "mommy"
              ? "Oh sweetheart, I'm having trouble connecting right now. Please know that I'm here for you, and you can always reach out to real support at 988 if you need to talk to someone. I love you."
              : "Hey champ, something went wrong on my end. But remember, I'm always proud of you, and if you need to talk to someone right now, you can always call 988. I believe in you, kiddo.",
        },
      ]);
      setStatusMessage("The parent response failed to load, but your conversation is still safe.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSendMessage();
    }
  };

  const currentSessionSummary = messages.length
    ? `${messages.length} messages captured · ${todaysAffirmation.theme} · ${
        isRecordingSession ? "recording" : "not recording"
      }`
    : "No conversation captured yet. Start chatting, then save this mirror session when you're ready.";

  const currentPreviewSession =
    messages.length > 0 ? snapshotSession(sessionTitle.trim() || `${todaysAffirmation.theme} session`, parentType, messages) : null;

  const liveSessionPreview = isRecordingSession
    ? snapshotSession(
        sessionTitle.trim() || `${todaysAffirmation.theme} session`,
        parentType,
        messages,
        liveSessionIdRef.current ?? undefined
      )
    : null;

  const recentSavedSessions = savedSessions.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <Card className="mb-6 border-pink-200 dark:border-pink-800 bg-gradient-to-r from-pink-50 to-green-50 dark:from-pink-950/20 dark:to-green-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <span className="text-3xl">{parentEmoji}</span>
            {parentName}
            <Heart className="h-6 w-6 fill-pink-500 text-pink-500" />
          </CardTitle>
          <CardDescription className="text-base">
            Sometimes we all need a loving, supportive voice. Talk to your virtual parent who will
            always listen, never judge, and remind you how loved and valued you are.
          </CardDescription>
        </CardHeader>
      </Card>

      {!isStarted && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Choose Your Virtual Parent</CardTitle>
            <CardDescription>Select the supportive figure you'd like to talk with today</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={parentType}
              onValueChange={(value) => setParentType(value as "mommy" | "daddy")}
              className="grid grid-cols-2 gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mommy" id="mommy" />
                <Label htmlFor="mommy" className="flex items-center gap-2 cursor-pointer">
                  <span className="text-2xl">👩‍👧</span>
                  <div>
                    <div className="font-medium">Virtual Mommy</div>
                    <div className="text-sm text-muted-foreground">Warm, nurturing, gentle comfort</div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daddy" id="daddy" />
                <Label htmlFor="daddy" className="flex items-center gap-2 cursor-pointer">
                  <span className="text-2xl">👨‍👧</span>
                  <div>
                    <div className="font-medium">Virtual Daddy</div>
                    <div className="text-sm text-muted-foreground">Supportive, protective, encouraging</div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      <Card className="flex h-[500px] flex-col">
        <CardContent className="flex flex-1 flex-col p-4 pt-4">
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            <div className="space-y-4">
              {!isStarted && (
                <div className="py-8 text-center text-muted-foreground">
                  <p className="mb-2 text-lg">
                    {parentType === "mommy"
                      ? "Hi sweetheart, I'm here whenever you need me. 💕"
                      : "Hey there, champ! I'm here for you whenever you're ready. 💪"}
                  </p>
                  <p className="text-sm">Share what's on your mind, and I'll listen with all my heart.</p>
                </div>
              )}

              {messages.map((msg, index) => (
                <div key={index} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-pink-300 bg-gradient-to-br from-pink-100 to-green-100 shadow-sm">
                      <img src={parentAvatarSrc} alt={parentName} className="h-full w-full object-cover" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      msg.role === "user" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-muted"
                    }`}
                  >
                    {msg.images && msg.images.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-2">
                        {msg.images.map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt={`attachment ${i + 1}`}
                            className="h-20 w-20 rounded-lg border object-cover"
                          />
                        ))}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>

                  {msg.role === "user" && (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-cyan-400">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-3 justify-start">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-green-400 text-lg text-white">
                    {parentEmoji}
                  </div>
                  <div className="rounded-2xl rounded-bl-md bg-muted p-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="mt-4 flex flex-col gap-2 border-t pt-4">
            {attachedImages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachedImages.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img.dataUrl} alt={img.name} className="h-16 w-16 rounded-lg border object-cover" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs leading-none text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0 h-auto py-3"
                disabled={isLoading || attachedImages.length >= 10}
                onClick={() => fileInputRef.current?.click()}
                title={attachedImages.length >= 10 ? "Max 10 photos" : "Attach up to 10 photos"}
              >
                <Paperclip className="h-5 w-5" />
              </Button>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  parentType === "mommy"
                    ? "Tell me what's on your heart, sweetheart..."
                    : "What's going on, kiddo? I'm all ears..."
                }
                className="min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={() => void handleSendMessage()}
                disabled={(!message.trim() && attachedImages.length === 0) || isLoading}
                className="h-auto px-6"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardContent className="pt-6">
          <p className="text-left text-sm text-muted-foreground">
            <strong>Remember:</strong> While your virtual parent is here to provide comfort and support,
            if you're experiencing a crisis or thoughts of self-harm, please reach out to real help:
            <br />
            <span className="font-semibold text-red-600 dark:text-red-400">
              📞 Call/Text 988 (Suicide & Crisis Lifeline) | 💬 Text HOME to 741741
            </span>
          </p>
        </CardContent>
      </Card>

      <Card className="mt-6 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:border-amber-800 dark:from-amber-950/20 dark:to-orange-950/20">
        <CardContent className="pt-6">
          <h3 className="mb-3 text-center text-lg font-semibold">Daily Affirmation • {todaysAffirmation.theme}</h3>
          <p className="mb-3 text-center italic text-muted-foreground">"{todaysAffirmation.text}"</p>
          <p className="text-center text-xs text-muted-foreground">— {todaysAffirmation.source}</p>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageCircleHeart className="h-5 w-5 text-primary" />
            Session log
          </CardTitle>
          <CardDescription>{currentSessionSummary}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="session-title">Session title</Label>
            <input
              id="session-title"
              value={sessionTitle}
              onChange={(e) => setSessionTitle(e.target.value)}
              placeholder={`${todaysAffirmation.theme} session`}
              className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant={isRecordingSession ? "destructive" : "outline"} onClick={handleToggleRecording}>
              <Square className="mr-2 h-4 w-4" />
              {isRecordingSession ? "Stop Recording" : "Record Session"}
            </Button>
            <Button onClick={handleSaveSession} disabled={messages.length === 0}>
              <Save className="mr-2 h-4 w-4" />
              Save Log
            </Button>
            <Button
              variant="outline"
              onClick={() => void handleShareSession(currentPreviewSession ?? undefined)}
              disabled={!currentPreviewSession}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Current
            </Button>
            <Button variant="outline" onClick={() => setIsSessionsModalOpen(true)}>
              View Saved Logs ({savedSessions.length})
            </Button>
          </div>

          {statusMessage && (
            <p className="rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground" role="status">
              {statusMessage}
            </p>
          )}

          {liveSessionPreview && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
              Recording "{liveSessionPreview.title}" with {liveSessionPreview.messages.length} messages.
            </div>
          )}

          {recentSavedSessions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Recent saved logs</h4>
              {recentSavedSessions.map((session) => {
                const isPlayingSession = playbackState.sessionId === session.id && playbackState.isPlaying;
                return (
                  <div key={session.id} className="rounded-lg border p-3">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="font-medium">{session.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimestamp(session.updatedAt)} • {session.messages.length} messages • {session.parentType}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleRestoreSession(session)}>
                          <RotateCcw className="mr-2 h-3 w-3" />
                          Restore
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handlePlaybackToggle(session)}>
                          {isPlayingSession && !playbackState.isPaused ? (
                            <Pause className="mr-2 h-3 w-3" />
                          ) : (
                            <Play className="mr-2 h-3 w-3" />
                          )}
                          {isPlayingSession && !playbackState.isPaused ? "Pause" : "Play"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => void handleShareSession(session)}>
                          <Share2 className="mr-2 h-3 w-3" />
                          Share
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDeleteSession(session.id)}>
                          <Trash2 className="mr-2 h-3 w-3" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal isOpen={isSessionsModalOpen} onClose={() => setIsSessionsModalOpen(false)} title="Saved session logs">
        {savedSessions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No saved logs yet. Start a conversation, then save it here.</p>
        ) : (
          <div className="space-y-3">
            {savedSessions.map((session) => (
              <div key={session.id} className="rounded-lg border p-3">
                <div className="font-medium">{session.title}</div>
                <div className="text-xs text-muted-foreground">
                  {formatTimestamp(session.updatedAt)} • {session.messages.length} messages • {session.affirmationTheme}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleRestoreSession(session)}>
                    <RotateCcw className="mr-2 h-3 w-3" />
                    Restore
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handlePlaybackToggle(session)}>
                    <Play className="mr-2 h-3 w-3" />
                    Play
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => void handleShareSession(session)}>
                    <Share2 className="mr-2 h-3 w-3" />
                    Share
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteSession(session.id)}>
                    <Trash2 className="mr-2 h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
