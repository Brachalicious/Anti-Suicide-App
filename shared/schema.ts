import { z } from "zod";
import { createInsertSchema } from "drizzle-zod";

// Crisis Hotlines
export const crisisHotlineSchema = z.object({
  id: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  website: z.string().optional(),
  description: z.string(),
  country: z.string(),
  available247: z.boolean(),
  languages: z.array(z.string()),
});

export type CrisisHotline = z.infer<typeof crisisHotlineSchema>;

// Mood Entry
export const moodEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  mood: z.number().min(1).max(10), // 1-10 scale
  emotions: z.array(z.string()),
  notes: z.string().optional(),
  triggers: z.array(z.string()).optional(),
  copingStrategies: z.array(z.string()).optional(),
  timestamp: z.string(),
});

export const insertMoodEntrySchema = moodEntrySchema.omit({ id: true });
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type MoodEntry = z.infer<typeof moodEntrySchema>;

// Journal Entry
export const journalEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().optional(),
  content: z.string(),
  mood: z.number().min(1).max(10).optional(),
  isPrivate: z.boolean().default(true),
  tags: z.array(z.string()).optional(),
  timestamp: z.string(),
});

export const insertJournalEntrySchema = journalEntrySchema.omit({ id: true });
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type JournalEntry = z.infer<typeof journalEntrySchema>;

// Emergency Contact
export const emergencyContactSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  phoneNumber: z.string(),
  relationship: z.string(),
  isPrimary: z.boolean().default(false),
});

export const insertEmergencyContactSchema = emergencyContactSchema.omit({ id: true });
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type EmergencyContact = z.infer<typeof emergencyContactSchema>;

// Resource/Article
export const resourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  category: z.string(), // 'coping', 'education', 'crisis', 'wellness'
  tags: z.array(z.string()),
  readTime: z.number(), // in minutes
  isEmergency: z.boolean().default(false),
});

export type Resource = z.infer<typeof resourceSchema>;

// User Profile (minimal for privacy)
export const userProfileSchema = z.object({
  id: z.string(),
  nickname: z.string().optional(),
  timezone: z.string().optional(),
  preferences: z.object({
    enableNotifications: z.boolean().default(true),
    darkMode: z.boolean().default(false),
    language: z.string().default("en"),
  }),
  lastActive: z.string(),
});

export const insertUserProfileSchema = userProfileSchema.omit({ id: true });
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;

// Wellness Activity
export const wellnessActivitySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.string(), // 'breathing', 'meditation', 'exercise', 'creative'
  duration: z.number(), // in minutes
  instructions: z.array(z.string()),
  difficulty: z.string(), // 'easy', 'medium', 'advanced'
});

export type WellnessActivity = z.infer<typeof wellnessActivitySchema>;

// Safety Plan Entry
export const safetyPlanSchema = z.object({
  id: z.string(),
  userId: z.string(),
  warningSignals: z.array(z.string()),
  copingStrategies: z.array(z.string()),
  socialSupports: z.array(z.string()),
  professionalContacts: z.array(z.string()),
  environmentalSafety: z.array(z.string()),
  lastUpdated: z.string(),
});

export const insertSafetyPlanSchema = safetyPlanSchema.omit({ id: true });
export type InsertSafetyPlan = z.infer<typeof insertSafetyPlanSchema>;
export type SafetyPlan = z.infer<typeof safetyPlanSchema>;