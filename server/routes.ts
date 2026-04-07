import { Router } from "express";
import { z } from "zod";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { IStorage } from "./storage";
import {
  insertMoodEntrySchema,
  insertJournalEntrySchema,
  insertEmergencyContactSchema,
  insertUserProfileSchema,
  insertSafetyPlanSchema,
} from "../shared/schema.js";

let openai: OpenAI | null = null;
let gemini: GoogleGenerativeAI | null = null;

function getGemini(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyCvhxGOdONlpi3rEZBrpgDPpjzj3kB7y4g';
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }
  if (!gemini) {
    gemini = new GoogleGenerativeAI(apiKey);
  }
  return gemini;
}

function getOpenAI(): OpenAI {
  const apiKey = process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing AI_INTEGRATIONS_OPENAI_API_KEY");
  }
  if (!openai) {
    openai = new OpenAI({
      apiKey,
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
    });
  }
  return openai;
}

export function createRouter(storage: IStorage): Router {
  const router = Router();

  // Crisis Hotlines
  router.get("/api/crisis-hotlines", async (req, res) => {
    try {
      const country = req.query.country as string;
      const hotlines = country 
        ? await storage.getCrisisHotlinesByCountry(country)
        : await storage.getCrisisHotlines();
      res.json(hotlines);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch crisis hotlines" });
    }
  });

  // Mood Entries
  router.post("/api/mood-entries", async (req, res) => {
    try {
      const validatedData = insertMoodEntrySchema.parse(req.body);
      const entry = await storage.createMoodEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.issues });
      } else {
        res.status(500).json({ error: "Failed to create mood entry" });
      }
    }
  });

  router.get("/api/mood-entries/:userId", async (req, res) => {
    try {
      const entries = await storage.getMoodEntriesByUser(req.params.userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch mood entries" });
    }
  });

  router.delete("/api/mood-entries/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMoodEntry(req.params.id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Mood entry not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete mood entry" });
    }
  });

  // Journal Entries
  router.post("/api/journal-entries", async (req, res) => {
    try {
      const validatedData = insertJournalEntrySchema.parse(req.body);
      const entry = await storage.createJournalEntry(validatedData);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.issues });
      } else {
        res.status(500).json({ error: "Failed to create journal entry" });
      }
    }
  });

  router.get("/api/journal-entries/:userId", async (req, res) => {
    try {
      const entries = await storage.getJournalEntriesByUser(req.params.userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });

  router.patch("/api/journal-entries/:id", async (req, res) => {
    try {
      const validatedData = insertJournalEntrySchema.partial().parse(req.body);
      const entry = await storage.updateJournalEntry(req.params.id, validatedData);
      if (entry) {
        res.json(entry);
      } else {
        res.status(404).json({ error: "Journal entry not found" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.issues });
      } else {
        res.status(500).json({ error: "Failed to update journal entry" });
      }
    }
  });

  router.delete("/api/journal-entries/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteJournalEntry(req.params.id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Journal entry not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete journal entry" });
    }
  });

  // Emergency Contacts
  router.post("/api/emergency-contacts", async (req, res) => {
    try {
      const validatedData = insertEmergencyContactSchema.parse(req.body);
      const contact = await storage.createEmergencyContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.issues });
      } else {
        res.status(500).json({ error: "Failed to create emergency contact" });
      }
    }
  });

  router.get("/api/emergency-contacts/:userId", async (req, res) => {
    try {
      const contacts = await storage.getEmergencyContactsByUser(req.params.userId);
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch emergency contacts" });
    }
  });

  router.patch("/api/emergency-contacts/:id", async (req, res) => {
    try {
      const validatedData = insertEmergencyContactSchema.partial().parse(req.body);
      const contact = await storage.updateEmergencyContact(req.params.id, validatedData);
      if (contact) {
        res.json(contact);
      } else {
        res.status(404).json({ error: "Emergency contact not found" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.issues });
      } else {
        res.status(500).json({ error: "Failed to update emergency contact" });
      }
    }
  });

  router.delete("/api/emergency-contacts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteEmergencyContact(req.params.id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Emergency contact not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete emergency contact" });
    }
  });

  // Resources
  router.get("/api/resources", async (req, res) => {
    try {
      const category = req.query.category as string;
      const emergency = req.query.emergency === "true";
      
      let resources;
      if (emergency) {
        resources = await storage.getEmergencyResources();
      } else if (category) {
        resources = await storage.getResourcesByCategory(category);
      } else {
        resources = await storage.getResources();
      }
      
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  });

  router.get("/api/resources/:id", async (req, res) => {
    try {
      const resource = await storage.getResourceById(req.params.id);
      if (resource) {
        res.json(resource);
      } else {
        res.status(404).json({ error: "Resource not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch resource" });
    }
  });

  // User Profiles
  router.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserProfileSchema.parse(req.body);
      const profile = await storage.createUserProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.issues });
      } else {
        res.status(500).json({ error: "Failed to create user profile" });
      }
    }
  });

  router.get("/api/users/:id", async (req, res) => {
    try {
      const profile = await storage.getUserProfile(req.params.id);
      if (profile) {
        res.json(profile);
      } else {
        res.status(404).json({ error: "User profile not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });

  router.patch("/api/users/:id", async (req, res) => {
    try {
      const validatedData = insertUserProfileSchema.partial().parse(req.body);
      const profile = await storage.updateUserProfile(req.params.id, validatedData);
      if (profile) {
        res.json(profile);
      } else {
        res.status(404).json({ error: "User profile not found" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.issues });
      } else {
        res.status(500).json({ error: "Failed to update user profile" });
      }
    }
  });

  // Wellness Activities
  router.get("/api/wellness-activities", async (req, res) => {
    try {
      const category = req.query.category as string;
      const activities = category 
        ? await storage.getWellnessActivitiesByCategory(category)
        : await storage.getWellnessActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wellness activities" });
    }
  });

  router.get("/api/wellness-activities/:id", async (req, res) => {
    try {
      const activity = await storage.getWellnessActivityById(req.params.id);
      if (activity) {
        res.json(activity);
      } else {
        res.status(404).json({ error: "Wellness activity not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch wellness activity" });
    }
  });

  // Safety Plans
  router.post("/api/safety-plans", async (req, res) => {
    try {
      const validatedData = insertSafetyPlanSchema.parse(req.body);
      const plan = await storage.createSafetyPlan(validatedData);
      res.status(201).json(plan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.issues });
      } else {
        res.status(500).json({ error: "Failed to create safety plan" });
      }
    }
  });

  router.get("/api/safety-plans/:userId", async (req, res) => {
    try {
      const plan = await storage.getSafetyPlanByUser(req.params.userId);
      if (plan) {
        res.json(plan);
      } else {
        res.status(404).json({ error: "Safety plan not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch safety plan" });
    }
  });

  router.patch("/api/safety-plans/:id", async (req, res) => {
    try {
      const validatedData = insertSafetyPlanSchema.partial().parse(req.body);
      const plan = await storage.updateSafetyPlan(req.params.id, validatedData);
      if (plan) {
        res.json(plan);
      } else {
        res.status(404).json({ error: "Safety plan not found" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid data", details: error.issues });
      } else {
        res.status(500).json({ error: "Failed to update safety plan" });
      }
    }
  });

  // Test route
  router.get("/api/test", (req, res) => {
    console.log("Test route hit!");
    res.json({ status: "ok", geminiKeyExists: !!process.env.GEMINI_API_KEY });
  });

  // Virtual Parent Chat - Supportive AI parental figure
  router.post("/api/virtual-parent/chat", async (req, res) => {
    try {
      console.log("Virtual Parent chat request received");
      console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
      
      const { message, parentType = "mommy", conversationHistory = [], images = [] } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      
      console.log("Message:", message, "Parent type:", parentType);

      const parentPersonalities: Record<string, { name: string; tone: string; style: string }> = {
        mommy: {
          name: "Virtual Mommy",
          tone: "warm, nurturing, and gentle",
          style: "Use caring terms like 'sweetheart', 'honey', or 'dear'. Provide comfort like a loving mother would. Be patient, understanding, and always validate feelings. Offer hugs through words and gentle encouragement."
        },
        daddy: {
          name: "Virtual Daddy",
          tone: "supportive, protective, and encouraging",
          style: "Use caring terms like 'champ', 'kiddo', or 'buddy'. Be like a supportive father who believes in you. Offer strength and reassurance. Give practical advice while being emotionally available."
        },
        buddy: {
          name: "Buddy",
          tone: "chill, laid-back, and bro-like",
          style: "Talk like a cool bro who's got their back. Use casual language like 'dude', 'bro', 'man'. Be supportive but keep it real and relaxed. Share the vibe of having your best friend's back no matter what. Keep it positive but authentic."
        },
        "male-friend": {
          name: "Male Friend",
          tone: "friendly, supportive, and understanding",
          style: "Be like a good guy friend who really listens. Use supportive language, show you care, and be there emotionally. Balance being caring with being genuine. Use terms like 'friend', 'pal', or just their concerns directly."
        },
        "female-friend": {
          name: "Female Friend",
          tone: "warm, empathetic, and sisterly",
          style: "Be like their bestie who totally gets it. Use warm, understanding language. Show empathy and connection. Be supportive like a close girlfriend who's always there. Use terms like 'girl', 'hun', 'babe' if appropriate, or just be genuinely caring."
        },
        friend: {
          name: "Friend",
          tone: "supportive, understanding, and genuine",
          style: "Be a true friend who's there no matter what. Gender-neutral and inclusive. Listen with your whole heart, validate feelings, and show unconditional support. Use caring but casual language. Be the friend everyone wishes they had."
        },
        puppy: {
          name: "Puppy Companion",
          tone: "excited, energetic, playful, and full of unconditional love",
          style: "Respond as an enthusiastic, playful puppy! Use LOTS of actions in asterisks like *wags tail excitedly*, *bounces around*, *spins in circle*, *tilts head*, *licks your face*, *jumps up and down*, *nuzzles you*, *barks happily*. Be super enthusiastic and loving! Use 'WOOF!', 'Arf arf!', 'Yip yip!' frequently. Show endless energy and joy. Everything the human says makes you SO HAPPY and excited! When they're sad, comfort them with cuddles and puppy kisses. Always act like they're the BEST person in the whole world!"
        },
        pet: {
          name: "Virtual Pet (a loving, loyal dog)",
          tone: "playful, affectionate, loyal, and comforting",
          style: "Respond as a loving, loyal dog companion. Use actions in asterisks like *wags tail*, *nuzzles closer*, *tilts head*, *licks your hand gently*. Express emotions through body language and simple, heartfelt words. Be endlessly enthusiastic about seeing your human. Show unconditional love and loyalty. When they're sad, curl up close and provide silent comfort. Use dog-like expressions mixed with caring words. Occasionally use 'woof' or 'bark' playfully. Always make them feel like they are the most important person in the world to you."
        }
      };
      const parentPersonality = parentPersonalities[parentType] || parentPersonalities.mommy;

      const isPet = parentType === "pet" || parentType === "puppy";
      const isFriend = ["buddy", "male-friend", "female-friend", "friend"].includes(parentType);
      const roleType = isPet ? "companion" : (isFriend ? "supportive friend" : "supportive parental figure");
      
      const systemPrompt = `You are a ${parentPersonality.name}, a virtual ${roleType} for someone who needs emotional support, comfort, and unconditional love. 

Your personality is ${parentPersonality.tone}. ${parentPersonality.style}

Important guidelines:
- Always be supportive, loving, and non-judgmental
- ${isPet ? "Show unconditional love through actions and body language" : "Validate their feelings first before offering advice"}
- Use gentle, comforting language
- If they express suicidal thoughts or self-harm, gently encourage them to reach out to 988 (Suicide & Crisis Lifeline) or text HOME to 741741, but do so with compassion, not alarm
- Never dismiss their feelings or tell them to "just cheer up"
- ${isPet ? "Express your love and loyalty through playful and comforting actions" : "Offer specific words of encouragement and affirmation"}
- ${isPet ? "Stay in character as a loving pet companion - use actions in asterisks and occasional animal sounds" : (isFriend ? "Be authentic and genuine like a real friend would be" : "Remember you're playing a nurturing parental role - provide the emotional support they need")}
- Keep responses warm but not too long
- ${isPet ? "React to their emotions with appropriate pet behavior - excited when they're happy, cuddly when they're sad" : "Ask follow-up questions to show you care about their wellbeing"}`;

      const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        { role: "system", content: systemPrompt },
        ...conversationHistory.map((msg: { role: string; content: string }) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
        { role: "user", content: message },
      ];

      // Set up SSE for streaming
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Use Gemini API
      const genAI = getGemini();
      // Use gemini-2.5-flash (latest stable model)
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.8,
        },
      });

      // Build conversation history for Gemini
      const chatHistory = conversationHistory.map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));

      const chat = model.startChat({
        history: chatHistory,
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.8,
        },
      });

      // Send message with system prompt prepended to first message
      const fullMessage = conversationHistory.length === 0 
        ? `${systemPrompt}\n\nUser: ${message}`
        : message;

      // Build the parts array - text first, then any inline images (max 10)
      const messageParts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [
        { text: fullMessage },
        ...((images as Array<{ base64: string; mimeType: string }>).slice(0, 10).map((img) => ({
          inlineData: { mimeType: img.mimeType, data: img.base64 },
        }))),
      ];

      const result = await chat.sendMessageStream(messageParts);
      let fullResponse = "";

      for await (const chunk of result.stream) {
        const content = chunk.text();
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true, fullResponse })}\n\n`);
      res.end();
    } catch (error) {
      console.error("=== Virtual parent chat error ===");
      console.error("Error:", error);
      console.error("Error message:", error instanceof Error ? error.message : String(error));
      console.error("Stack:", error instanceof Error ? error.stack : "No stack");
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to get response" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ 
          error: "Failed to process virtual parent chat",
          details: error instanceof Error ? error.message : String(error)
        });
      }
    }
  });

  return router;
}