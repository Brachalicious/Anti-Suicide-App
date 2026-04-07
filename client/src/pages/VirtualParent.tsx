import { useState, useRef, useEffect } from "react";
import { Heart, Send, User, Loader2, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AttachedImage {
  dataUrl: string;   // base64 data URL for preview
  base64: string;    // raw base64 for API
  mimeType: string;
  name: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  images?: string[]; // preview URLs shown in the bubble
}

const dailyAffirmations = [
  {
    theme: "Your Existence",
    text: "The day you were born was the day Hashem decided the world could not exist without you",
    source: "Rabbi Nachman of Breslov"
  },
  {
    theme: "Choice & Purpose",
    text: "I have set before you life and death... Choose life",
    source: "Deuteronomy 30:19"
  },
  {
    theme: "Trust & Faith", 
    text: "The footsteps of humans are directed by G‑d",
    source: "Psalm 37:23"
  },
  {
    theme: "Resilience",
    text: "A righteous person falls down seven times and gets up",
    source: "Proverbs 24:16"
  },
  {
    theme: "Self-Care & Action",
    text: "If I am not for myself, who is for me? And if I am only for myself, what am I? And if not now, when?",
    source: "Hillel, Pirkei Avot 1:14"
  },
  {
    theme: "Identity",
    text: "Every human being is created in the image of God",
    source: "Genesis 1:26"
  },
  {
    theme: "Courage",
    text: "Be strong and courageous",
    source: "Joshua 1:9"
  },
  {
    theme: "Gratitude",
    text: "I am grateful for being able to hear/talk",
    source: "Based on morning blessings"
  },
  {
    theme: "Perspective",
    text: "Who is rich? The one who rejoices in his portion",
    source: "Pirkei Avot 4:1"
  },
  {
    theme: "Presence",
    text: "In all your speech, deeds and thoughts... you are standing in front of G-d",
    source: "Letter of Nachmonides"
  },
  {
    theme: "Love & Connection",
    text: "Let the good in me connect with the good in others, until all the world is transformed through the compelling power of love",
    source: "Rabbi Nachman"
  }
];

export default function VirtualParent() {
  const [parentType, setParentType] = useState<"mommy" | "daddy">("mommy");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [attachedImages, setAttachedImages] = useState<{ dataUrl: string; base64: string; mimeType: string; name: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Convert a File to base64 and data URL
  const readFile = (file: File): Promise<{ dataUrl: string; base64: string; mimeType: string; name: string }> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1];
        resolve({ dataUrl, base64, mimeType: file.type, name: file.name });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 10);
    const results = await Promise.all(files.map(readFile));
    setAttachedImages((prev) => [...prev, ...results].slice(0, 10));
    // reset so same file can be re-attached
    e.target.value = "";
  };

  const removeImage = (idx: number) => {
    setAttachedImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSendMessage = async () => {
    if ((!message.trim() && attachedImages.length === 0) || isLoading) return;

    const userMessage = message.trim();
    const imagesToSend = [...attachedImages];
    setMessage("");
    setAttachedImages([]);
    setIsLoading(true);
    setIsStarted(true);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        images: imagesToSend.map((img) => img.dataUrl),
      },
    ]);

    try {
      const response = await fetch("/api/virtual-parent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage || "(User attached image(s), please describe and respond to what you see with warmth and care.)",
          parentType,
          conversationHistory: messages,
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
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: "assistant",
                  content: assistantMessage,
                };
                return newMessages;
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
          content: parentType === "mommy"
            ? "Oh sweetheart, I'm having trouble connecting right now. Please know that I'm here for you, and you can always reach out to real support at 988 if you need to talk to someone. I love you."
            : "Hey champ, something went wrong on my end. But remember, I'm always proud of you, and if you need to talk to someone right now, you can always call 988. I believe in you, kiddo.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const parentName = parentType === "mommy" ? "Virtual Mommy" : "Virtual Daddy";
  const parentEmoji = parentType === "mommy" ? "👩‍👧" : "👨‍👧";

  // Avatar image for the mysticminded33 virtual parent chatbot.
  // Place the provided girl image at: /public/download-2026-04-05T09_23_05.jpg
  // (or update the path below if you use a different filename).
  const parentAvatarSrc = "/download-2026-04-05T09_23_05.jpg";

  // Get today's affirmation (changes daily based on date)
  const getTodaysAffirmation = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return dailyAffirmations[dayOfYear % dailyAffirmations.length];
  };

  const todaysAffirmation = getTodaysAffirmation();

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
  <Card className="mb-6 bg-gradient-to-r from-pink-50 to-green-50 dark:from-pink-950/20 dark:to-green-950/20 border-pink-200 dark:border-pink-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <span className="text-3xl">{parentEmoji}</span>
            {parentName}
            <Heart className="h-6 w-6 text-pink-500 fill-pink-500" />
          </CardTitle>
          <CardDescription className="text-base">
            Sometimes we all need a loving, supportive voice. Talk to your virtual parent who 
            will always listen, never judge, and remind you how loved and valued you are.
          </CardDescription>
        </CardHeader>
      </Card>

      {!isStarted && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Choose Your Virtual Parent</CardTitle>
            <CardDescription>
              Select the supportive figure you'd like to talk with today
            </CardDescription>
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
                    <div className="text-sm text-muted-foreground">
                      Warm, nurturing, gentle comfort
                    </div>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daddy" id="daddy" />
                <Label htmlFor="daddy" className="flex items-center gap-2 cursor-pointer">
                  <span className="text-2xl">👨‍👧</span>
                  <div>
                    <div className="font-medium">Virtual Daddy</div>
                    <div className="text-sm text-muted-foreground">
                      Supportive, protective, encouraging
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      <Card className="h-[500px] flex flex-col">
        <CardContent className="flex-1 flex flex-col p-4 pt-4">
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            <div className="space-y-4">
              {!isStarted && (
                <div className="text-center text-muted-foreground py-8">
                  <p className="text-lg mb-2">
                    {parentType === "mommy" 
                      ? "Hi sweetheart, I'm here whenever you need me. 💕"
                      : "Hey there, champ! I'm here for you whenever you're ready. 💪"}
                  </p>
                  <p className="text-sm">
                    Share what's on your mind, and I'll listen with all my heart.
                  </p>
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-300 shadow-sm shrink-0 bg-gradient-to-br from-pink-100 to-green-100">
                      <img
                        src={parentAvatarSrc}
                        alt={parentName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-muted rounded-bl-md"
                    }`}
                  >
                    {/* Show attached images inside the bubble */}
                    {msg.images && msg.images.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {msg.images.map((src, i) => (
                          <img
                            key={i}
                            src={src}
                            alt={`attachment ${i + 1}`}
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                        ))}
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center shrink-0">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-3 justify-start">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-green-400 flex items-center justify-center text-white text-lg shrink-0">
                    {parentEmoji}
                  </div>
                  <div className="bg-muted p-4 rounded-2xl rounded-bl-md">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2 mt-4 pt-4 border-t flex-col">
            {/* Image preview strip */}
            {attachedImages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {attachedImages.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img.dataUrl}
                      alt={img.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs leading-none"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              {/* Attach button */}
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
                onClick={handleSendMessage}
                disabled={(!message.trim() && attachedImages.length === 0) || isLoading}
                className="h-auto px-6"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-left">
            <strong>Remember:</strong> While your virtual parent is here to provide comfort and support, 
            if you're experiencing a crisis or thoughts of self-harm, please reach out to real help: 
            <br />
            <span className="text-red-600 dark:text-red-400 font-semibold">
              📞 Call/Text 988 (Suicide & Crisis Lifeline) | 💬 Text HOME to 741741
            </span>
          </p>
        </CardContent>
      </Card>

      {/* Daily Affirmation */}
      <Card className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-3 text-center">Daily Affirmation • {todaysAffirmation.theme}</h3>
          <p className="text-center text-muted-foreground italic mb-3">
            "{todaysAffirmation.text}"
          </p>
          <p className="text-xs text-muted-foreground text-center">— {todaysAffirmation.source}</p>
        </CardContent>
      </Card>
    </div>
  );
}
