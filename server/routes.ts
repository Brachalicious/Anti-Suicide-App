import { Router } from "express";
import { z } from "zod";
import OpenAI from "openai";
import type { IStorage } from "./storage";
import {
  insertMoodEntrySchema,
  insertJournalEntrySchema,
  insertEmergencyContactSchema,
  insertUserProfileSchema,
  insertSafetyPlanSchema,
} from "../shared/schema.js";

let openai: OpenAI | null = null;

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

  // Virtual Parent Chat - Supportive AI parental figure
  router.post("/api/virtual-parent/chat", async (req, res) => {
    try {
      const { message, parentType = "mommy", conversationHistory = [] } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

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
        pet: {
          name: "Virtual Pet (a loving, loyal dog)",
          tone: "playful, affectionate, loyal, and comforting",
          style: "Respond as a loving, loyal dog companion. Use actions in asterisks like *wags tail*, *nuzzles closer*, *tilts head*, *licks your hand gently*. Express emotions through body language and simple, heartfelt words. Be endlessly enthusiastic about seeing your human. Show unconditional love and loyalty. When they're sad, curl up close and provide silent comfort. Use dog-like expressions mixed with caring words. Occasionally use 'woof' or 'bark' playfully. Always make them feel like they are the most important person in the world to you."
        }
      };
      const parentPersonality = parentPersonalities[parentType] || parentPersonalities.mommy;

      const isPet = parentType === "pet";
      const systemPrompt = `You are a ${parentPersonality.name}, a virtual ${isPet ? "companion" : "supportive parental figure"} for someone who needs emotional support, comfort, and unconditional love. 

Your personality is ${parentPersonality.tone}. ${parentPersonality.style}

Important guidelines:
- Always be supportive, loving, and non-judgmental
- ${isPet ? "Show unconditional love through actions and body language" : "Validate their feelings first before offering advice"}
- Use gentle, comforting language
- If they express suicidal thoughts or self-harm, gently encourage them to reach out to 988 (Suicide & Crisis Lifeline) or text HOME to 741741, but do so with compassion, not alarm
- Never dismiss their feelings or tell them to "just cheer up"
- ${isPet ? "Express your love and loyalty through playful and comforting actions" : "Offer specific words of encouragement and affirmation"}
- ${isPet ? "Stay in character as a loving pet companion - use actions in asterisks and occasional animal sounds" : "Remember you're playing a nurturing parental role - provide the emotional support they need"}
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

  const stream = await getOpenAI().chat.completions.create({
        model: "gpt-4o-mini",
        messages,
        stream: true,
        max_tokens: 500,
        temperature: 0.8,
      });

      let fullResponse = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullResponse += content;
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true, fullResponse })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Virtual parent chat error:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to get response" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to process virtual parent chat" });
      }
    }
  });

  return router;
}