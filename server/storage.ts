import type {
  CrisisHotline,
  MoodEntry,
  InsertMoodEntry,
  JournalEntry,
  InsertJournalEntry,
  EmergencyContact,
  InsertEmergencyContact,
  Resource,
  UserProfile,
  InsertUserProfile,
  WellnessActivity,
  SafetyPlan,
  InsertSafetyPlan,
} from "../shared/schema.js";

export interface IStorage {
  // Crisis Hotlines
  getCrisisHotlines(): Promise<CrisisHotline[]>;
  getCrisisHotlinesByCountry(country: string): Promise<CrisisHotline[]>;

  // Mood Entries
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;
  getMoodEntriesByUser(userId: string): Promise<MoodEntry[]>;
  getMoodEntryById(id: string): Promise<MoodEntry | null>;
  deleteMoodEntry(id: string): Promise<boolean>;

  // Journal Entries
  createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry>;
  getJournalEntriesByUser(userId: string): Promise<JournalEntry[]>;
  getJournalEntryById(id: string): Promise<JournalEntry | null>;
  updateJournalEntry(id: string, updates: Partial<InsertJournalEntry>): Promise<JournalEntry | null>;
  deleteJournalEntry(id: string): Promise<boolean>;

  // Emergency Contacts
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  getEmergencyContactsByUser(userId: string): Promise<EmergencyContact[]>;
  updateEmergencyContact(id: string, updates: Partial<InsertEmergencyContact>): Promise<EmergencyContact | null>;
  deleteEmergencyContact(id: string): Promise<boolean>;

  // Resources
  getResources(): Promise<Resource[]>;
  getResourcesByCategory(category: string): Promise<Resource[]>;
  getEmergencyResources(): Promise<Resource[]>;
  getResourceById(id: string): Promise<Resource | null>;

  // User Profiles
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  getUserProfile(id: string): Promise<UserProfile | null>;
  updateUserProfile(id: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | null>;

  // Wellness Activities
  getWellnessActivities(): Promise<WellnessActivity[]>;
  getWellnessActivitiesByCategory(category: string): Promise<WellnessActivity[]>;
  getWellnessActivityById(id: string): Promise<WellnessActivity | null>;

  // Safety Plans
  createSafetyPlan(plan: InsertSafetyPlan): Promise<SafetyPlan>;
  getSafetyPlanByUser(userId: string): Promise<SafetyPlan | null>;
  updateSafetyPlan(id: string, updates: Partial<InsertSafetyPlan>): Promise<SafetyPlan | null>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private crisisHotlines: CrisisHotline[] = [];
  private moodEntries: MoodEntry[] = [];
  private journalEntries: JournalEntry[] = [];
  private emergencyContacts: EmergencyContact[] = [];
  private resources: Resource[] = [];
  private userProfiles: UserProfile[] = [];
  private wellnessActivities: WellnessActivity[] = [];
  private safetyPlans: SafetyPlan[] = [];

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed crisis hotlines
    this.crisisHotlines = [
      {
        id: "1",
        name: "988 Suicide & Crisis Lifeline",
        phoneNumber: "988",
        website: "https://988lifeline.org",
        description: "Free and confidential emotional support to people in suicidal crisis or emotional distress 24 hours a day, 7 days a week.",
        country: "US",
        available247: true,
        languages: ["English", "Spanish"]
      },
      {
        id: "2",
        name: "Crisis Text Line",
        phoneNumber: "Text HOME to 741741",
        website: "https://crisistextline.org",
        description: "Free, 24/7 support for those in crisis. Text HOME to 741741 from anywhere in the US.",
        country: "US",
        available247: true,
        languages: ["English", "Spanish"]
      },
      {
        id: "3",
        name: "International Association for Suicide Prevention",
        phoneNumber: "Various",
        website: "https://www.iasp.info/resources/Crisis_Centres",
        description: "Directory of crisis centers worldwide.",
        country: "International",
        available247: false,
        languages: ["Multiple"]
      }
    ];

    // Seed resources
    this.resources = [
      {
        id: "1",
        title: "Understanding Suicidal Thoughts",
        content: "Suicidal thoughts are more common than you might think. They can be a sign that you're experiencing more pain than you can cope with right now. These thoughts don't mean you're weak or flawed - they mean you're human and you're hurting. The important thing to remember is that these feelings are temporary, even when it doesn't feel that way.",
        category: "education",
        tags: ["crisis", "understanding", "support"],
        readTime: 3,
        isEmergency: false
      },
      {
        id: "2",
        title: "Breathing Exercise for Anxiety",
        content: "When you're feeling overwhelmed, try the 4-7-8 breathing technique: Inhale for 4 counts, hold for 7 counts, exhale for 8 counts. Repeat this cycle 3-4 times. This helps activate your body's relaxation response and can reduce immediate feelings of panic or distress.",
        category: "coping",
        tags: ["breathing", "anxiety", "immediate-help"],
        readTime: 2,
        isEmergency: true
      },
      {
        id: "3",
        title: "Creating a Support Network",
        content: "Building connections with others is crucial for mental health. Start small - reach out to one person today. This could be a friend, family member, counselor, or support group. Having people who care about you creates a safety net for difficult times.",
        category: "wellness",
        tags: ["support", "relationships", "community"],
        readTime: 5,
        isEmergency: false
      },
      {
        id: "4",
        title: "Bikur Cholim Partners In Health",
        content: "Founded in 1981, Bikur Cholim has evolved into a multi-faceted organization uniquely positioned to meet the health needs of the Rockland community and beyond. Under Rabbi Simon Lauber's leadership, they provide innovative health-related services throughout the greater NYC area. With over 200 therapists on staff, their Achieve Behavioral Health division provides advanced mental health support with utmost sensitivity and professionalism. They offer comprehensive programs including health information, behavioral health services, Project H.E.A.R.T., and Project H.O.P.E. Contact: 845-425-7877 or visit bikurcholim.org.",
        category: "wellness",
        tags: ["jewish-community", "mental-health", "therapy", "behavioral-health", "support"],
        readTime: 4,
        isEmergency: false
      }
    ];

    // Seed wellness activities
    this.wellnessActivities = [
      {
        id: "1",
        title: "5-Minute Mindfulness Meditation",
        description: "A gentle introduction to mindfulness that can help ground you in the present moment.",
        category: "meditation",
        duration: 5,
        instructions: [
          "Find a comfortable seated position",
          "Close your eyes or soften your gaze",
          "Focus on your breath without changing it",
          "When your mind wanders, gently return to your breath",
          "End by taking three deep breaths"
        ],
        difficulty: "easy"
      },
      {
        id: "2",
        title: "Progressive Muscle Relaxation",
        description: "Release physical tension by systematically tensing and relaxing muscle groups.",
        category: "exercise",
        duration: 15,
        instructions: [
          "Lie down in a comfortable position",
          "Start with your toes - tense for 5 seconds, then relax",
          "Move up through each muscle group",
          "Notice the difference between tension and relaxation",
          "End by relaxing your entire body"
        ],
        difficulty: "easy"
      },
      {
        id: "3",
        title: "Gratitude Journaling",
        description: "Shift your focus to positive aspects of your life through structured reflection.",
        category: "creative",
        duration: 10,
        instructions: [
          "Write down 3 things you're grateful for today",
          "Include why each item is meaningful to you",
          "Focus on specific details rather than general statements",
          "Consider people, experiences, or simple pleasures",
          "Read your entries when you need a mood boost"
        ],
        difficulty: "easy"
      }
    ];
  }

  // Crisis Hotlines
  async getCrisisHotlines(): Promise<CrisisHotline[]> {
    return this.crisisHotlines;
  }

  async getCrisisHotlinesByCountry(country: string): Promise<CrisisHotline[]> {
    return this.crisisHotlines.filter(h => h.country === country || h.country === "International");
  }

  // Mood Entries
  async createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry> {
    const newEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    this.moodEntries.push(newEntry);
    return newEntry;
  }

  async getMoodEntriesByUser(userId: string): Promise<MoodEntry[]> {
    return this.moodEntries.filter(e => e.userId === userId).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getMoodEntryById(id: string): Promise<MoodEntry | null> {
    return this.moodEntries.find(e => e.id === id) || null;
  }

  async deleteMoodEntry(id: string): Promise<boolean> {
    const index = this.moodEntries.findIndex(e => e.id === id);
    if (index !== -1) {
      this.moodEntries.splice(index, 1);
      return true;
    }
    return false;
  }

  // Journal Entries
  async createJournalEntry(entry: InsertJournalEntry): Promise<JournalEntry> {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    this.journalEntries.push(newEntry);
    return newEntry;
  }

  async getJournalEntriesByUser(userId: string): Promise<JournalEntry[]> {
    return this.journalEntries.filter(e => e.userId === userId).sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  async getJournalEntryById(id: string): Promise<JournalEntry | null> {
    return this.journalEntries.find(e => e.id === id) || null;
  }

  async updateJournalEntry(id: string, updates: Partial<InsertJournalEntry>): Promise<JournalEntry | null> {
    const entry = this.journalEntries.find(e => e.id === id);
    if (entry) {
      Object.assign(entry, updates);
      return entry;
    }
    return null;
  }

  async deleteJournalEntry(id: string): Promise<boolean> {
    const index = this.journalEntries.findIndex(e => e.id === id);
    if (index !== -1) {
      this.journalEntries.splice(index, 1);
      return true;
    }
    return false;
  }

  // Emergency Contacts
  async createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact> {
    const newContact: EmergencyContact = {
      ...contact,
      id: Date.now().toString(),
    };
    this.emergencyContacts.push(newContact);
    return newContact;
  }

  async getEmergencyContactsByUser(userId: string): Promise<EmergencyContact[]> {
    return this.emergencyContacts.filter(c => c.userId === userId);
  }

  async updateEmergencyContact(id: string, updates: Partial<InsertEmergencyContact>): Promise<EmergencyContact | null> {
    const contact = this.emergencyContacts.find(c => c.id === id);
    if (contact) {
      Object.assign(contact, updates);
      return contact;
    }
    return null;
  }

  async deleteEmergencyContact(id: string): Promise<boolean> {
    const index = this.emergencyContacts.findIndex(c => c.id === id);
    if (index !== -1) {
      this.emergencyContacts.splice(index, 1);
      return true;
    }
    return false;
  }

  // Resources
  async getResources(): Promise<Resource[]> {
    return this.resources;
  }

  async getResourcesByCategory(category: string): Promise<Resource[]> {
    return this.resources.filter(r => r.category === category);
  }

  async getEmergencyResources(): Promise<Resource[]> {
    return this.resources.filter(r => r.isEmergency);
  }

  async getResourceById(id: string): Promise<Resource | null> {
    return this.resources.find(r => r.id === id) || null;
  }

  // User Profiles
  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const newProfile: UserProfile = {
      ...profile,
      id: Date.now().toString(),
    };
    this.userProfiles.push(newProfile);
    return newProfile;
  }

  async getUserProfile(id: string): Promise<UserProfile | null> {
    return this.userProfiles.find(p => p.id === id) || null;
  }

  async updateUserProfile(id: string, updates: Partial<InsertUserProfile>): Promise<UserProfile | null> {
    const profile = this.userProfiles.find(p => p.id === id);
    if (profile) {
      Object.assign(profile, updates);
      return profile;
    }
    return null;
  }

  // Wellness Activities
  async getWellnessActivities(): Promise<WellnessActivity[]> {
    return this.wellnessActivities;
  }

  async getWellnessActivitiesByCategory(category: string): Promise<WellnessActivity[]> {
    return this.wellnessActivities.filter(a => a.category === category);
  }

  async getWellnessActivityById(id: string): Promise<WellnessActivity | null> {
    return this.wellnessActivities.find(a => a.id === id) || null;
  }

  // Safety Plans
  async createSafetyPlan(plan: InsertSafetyPlan): Promise<SafetyPlan> {
    const newPlan: SafetyPlan = {
      ...plan,
      id: Date.now().toString(),
    };
    this.safetyPlans.push(newPlan);
    return newPlan;
  }

  async getSafetyPlanByUser(userId: string): Promise<SafetyPlan | null> {
    return this.safetyPlans.find(p => p.userId === userId) || null;
  }

  async updateSafetyPlan(id: string, updates: Partial<InsertSafetyPlan>): Promise<SafetyPlan | null> {
    const plan = this.safetyPlans.find(p => p.id === id);
    if (plan) {
      Object.assign(plan, updates);
      return plan;
    }
    return null;
  }
}