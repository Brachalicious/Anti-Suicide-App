import { Router } from "express";
import { z } from "zod";
import type { IStorage } from "./storage";
import {
  insertMoodEntrySchema,
  insertJournalEntrySchema,
  insertEmergencyContactSchema,
  insertUserProfileSchema,
  insertSafetyPlanSchema,
} from "../shared/schema.js";

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
    void req;
    console.log("Test route hit!");
    res.json({ status: "ok" });
  });

  return router;
}
