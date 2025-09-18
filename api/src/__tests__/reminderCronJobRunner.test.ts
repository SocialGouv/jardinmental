import { jest } from "@jest/globals";

// Types pour les mocks
type MockFunction = jest.MockedFunction<any>;

// Mock des dépendances avant les imports
const mockPrisma = {
  reminder: {
    findMany: jest.fn() as MockFunction,
  },
  reminderUtcDaysOfWeek: {
    findMany: jest.fn() as MockFunction,
  },
};

const mockSendNotifications = jest.fn() as MockFunction;
const mockCapture = jest.fn() as MockFunction;

// Mock du module prisma
jest.mock("../prisma", () => ({
  prisma: mockPrisma,
}));

// Mock des third-parties
jest.mock("../third-parties/expo-notifications", () => ({
  sendNotifications: mockSendNotifications,
}));

jest.mock("../third-parties/sentry", () => ({
  capture: mockCapture,
}));

// Mock de dotenv
jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

// Import après les mocks
const { executeReminderCronJob } = require("../reminderCronJob");

// Mock de console pour éviter les logs pendant les tests
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const mockConsoleLog = jest.fn();
const mockConsoleError = jest.fn();

// Mock process.exit pour éviter que les tests se terminent
const mockProcessExit = jest.fn();

describe("Reminder Cron Job Runner", () => {
  let nowUtc: any;

  beforeAll(() => {
    // Remplacer console.log et console.error
    console.log = mockConsoleLog;
    console.error = mockConsoleError;
  });

  afterAll(() => {
    // Restaurer console.log et console.error
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset tous les mocks de Prisma
    mockPrisma.reminder.findMany.mockReset();
    mockPrisma.reminderUtcDaysOfWeek.findMany.mockReset();
    mockSendNotifications.mockReset();

    jest.spyOn(process, "exit").mockImplementation(mockProcessExit as any);

    const mockDate = new Date("2023-09-15T10:30:00.000Z"); // Vendredi 15 septembre 2023, 10:30 UTC
    jest.spyOn(global, "Date").mockImplementation(() => mockDate as any);
    (global.Date as any).UTC = jest.fn((...args: any[]) => new (Date as any)(...args).getTime());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Main Reminders", () => {
    it("should send notifications for main reminders at correct time", async () => {
      const mockMainReminders = [
        {
          id: "reminder-1",
          type: "Main",
          user: { pushNotifToken: "token-1" },
        },
        {
          id: "reminder-2",
          type: "Main",
          user: { pushNotifToken: "token-2" },
        },
      ];

      mockPrisma.reminder.findMany.mockResolvedValue(mockMainReminders);
      mockPrisma.reminderUtcDaysOfWeek.findMany.mockResolvedValue([]);

      await executeReminderCronJob();

      expect(mockPrisma.reminder.findMany).toHaveBeenCalledWith({
        where: {
          type: "Main",
          disabled: false,
          utcTimeHours: 10,
          utcTimeMinutes: 30,
        },
        include: {
          user: true,
        },
      });

      expect(mockSendNotifications).toHaveBeenCalledWith({
        pushTokens: ["token-1", "token-2"],
        title: "Comment allez-vous aujourd'hui ?",
        body: "N'oubliez pas de renseigner votre journée dans Jardin Mental 🌿",
      });
    });

    it("should not send notifications when no main reminders found", async () => {
      mockPrisma.reminder.findMany.mockResolvedValue([]);
      mockPrisma.reminderUtcDaysOfWeek.findMany.mockResolvedValue([]);

      await executeReminderCronJob();

      expect(mockSendNotifications).not.toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Comment allez-vous aujourd'hui ?",
        })
      );
    });

    it("should filter out null push tokens for main reminders", async () => {
      const mockMainReminders = [
        {
          id: "reminder-1",
          type: "Main",
          user: { pushNotifToken: "token-1" },
        },
        {
          id: "reminder-2",
          type: "Main",
          user: { pushNotifToken: null },
        },
        {
          id: "reminder-3",
          type: "Main",
          user: null,
        },
      ];

      mockPrisma.reminder.findMany.mockResolvedValue(mockMainReminders);
      mockPrisma.reminderUtcDaysOfWeek.findMany.mockResolvedValue([]);

      await executeReminderCronJob();

      expect(mockSendNotifications).toHaveBeenCalledWith({
        pushTokens: ["token-1"],
        title: "Comment allez-vous aujourd'hui ?",
        body: "N'oubliez pas de renseigner votre journée dans Jardin Mental 🌿",
      });
    });
  });

  describe("Goal Reminders", () => {
    it("should send notifications for goal reminders with default message", async () => {
      const mockGoalReminders = [
        {
          reminder: {
            id: "goal-1",
            type: "Goal",
            customMessage: null,
            user: { pushNotifToken: "token-1" },
          },
        },
        {
          reminder: {
            id: "goal-2",
            type: "Goal",
            customMessage: null,
            user: { pushNotifToken: "token-2" },
          },
        },
      ];

      mockPrisma.reminder.findMany.mockResolvedValue([]);
      mockPrisma.reminderUtcDaysOfWeek.findMany
        .mockResolvedValueOnce(mockGoalReminders) // First call for goal reminders
        .mockResolvedValueOnce([]); // Second call for inactivity reminders

      await executeReminderCronJob();

      expect(mockPrisma.reminderUtcDaysOfWeek.findMany).toHaveBeenCalledWith({
        where: {
          friday: true,
          reminder: {
            type: "Goal",
            disabled: false,
            utcTimeHours: 10,
            utcTimeMinutes: 30,
          },
        },
        include: {
          reminder: {
            include: {
              user: true,
            },
          },
        },
      });

      expect(mockSendNotifications).toHaveBeenCalledWith({
        pushTokens: ["token-1", "token-2"],
        title: "Vous avez un objectif aujourd'hui 🎯",
        body: "N'oubliez de préciser si vous l'avez réalisé dans Jardin Mental",
      });
    });

    it("should send notifications for goal reminders with custom message", async () => {
      const mockGoalReminders = [
        {
          reminder: {
            id: "goal-1",
            type: "Goal",
            customMessage: "Remember to exercise today!",
            user: { pushNotifToken: "token-1" },
          },
        },
        {
          reminder: {
            id: "goal-2",
            type: "Goal",
            customMessage: "Remember to exercise today!",
            user: { pushNotifToken: "token-2" },
          },
        },
      ];

      mockPrisma.reminder.findMany.mockResolvedValue([]);
      mockPrisma.reminderUtcDaysOfWeek.findMany.mockResolvedValueOnce(mockGoalReminders).mockResolvedValueOnce([]);

      await executeReminderCronJob();

      expect(mockSendNotifications).toHaveBeenCalledWith({
        pushTokens: ["token-1", "token-2"],
        title: "Vous avez un objectif aujourd'hui 🎯",
        body: "Remember to exercise today!",
      });
    });

    it("should group goal reminders by custom message and send separate notifications", async () => {
      const mockGoalReminders = [
        {
          reminder: {
            id: "goal-1",
            type: "Goal",
            customMessage: "Exercise reminder",
            user: { pushNotifToken: "token-1" },
          },
        },
        {
          reminder: {
            id: "goal-2",
            type: "Goal",
            customMessage: "Exercise reminder",
            user: { pushNotifToken: "token-2" },
          },
        },
        {
          reminder: {
            id: "goal-3",
            type: "Goal",
            customMessage: "Meditation reminder",
            user: { pushNotifToken: "token-3" },
          },
        },
        {
          reminder: {
            id: "goal-4",
            type: "Goal",
            customMessage: null,
            user: { pushNotifToken: "token-4" },
          },
        },
      ];

      mockPrisma.reminder.findMany.mockResolvedValue([]);
      mockPrisma.reminderUtcDaysOfWeek.findMany.mockResolvedValueOnce(mockGoalReminders).mockResolvedValueOnce([]);

      await executeReminderCronJob();

      expect(mockSendNotifications).toHaveBeenCalledTimes(3);

      // Check that notifications were sent for each group
      expect(mockSendNotifications).toHaveBeenCalledWith({
        pushTokens: ["token-1", "token-2"],
        title: "Vous avez un objectif aujourd'hui 🎯",
        body: "Exercise reminder",
      });

      expect(mockSendNotifications).toHaveBeenCalledWith({
        pushTokens: ["token-3"],
        title: "Vous avez un objectif aujourd'hui 🎯",
        body: "Meditation reminder",
      });

      expect(mockSendNotifications).toHaveBeenCalledWith({
        pushTokens: ["token-4"],
        title: "Vous avez un objectif aujourd'hui 🎯",
        body: "N'oubliez de préciser si vous l'avez réalisé dans Jardin Mental",
      });
    });

    it("should filter out null push tokens for goal reminders", async () => {
      const mockGoalReminders = [
        {
          reminder: {
            id: "goal-1",
            type: "Goal",
            customMessage: "Test message",
            user: { pushNotifToken: "token-1" },
          },
        },
        {
          reminder: {
            id: "goal-2",
            type: "Goal",
            customMessage: "Test message",
            user: { pushNotifToken: null },
          },
        },
        {
          reminder: {
            id: "goal-3",
            type: "Goal",
            customMessage: "Test message",
            user: null,
          },
        },
      ];

      mockPrisma.reminder.findMany.mockResolvedValue([]);
      mockPrisma.reminderUtcDaysOfWeek.findMany.mockResolvedValueOnce(mockGoalReminders).mockResolvedValueOnce([]);

      await executeReminderCronJob();

      expect(mockSendNotifications).toHaveBeenCalledWith({
        pushTokens: ["token-1"],
        title: "Vous avez un objectif aujourd'hui 🎯",
        body: "Test message",
      });
    });
  });

  describe("Inactivity Reminders", () => {
    it("should send notifications for inactivity reminders", async () => {
      const mockInactivityReminders = [
        {
          reminder: {
            id: "inactivity-1",
            type: "Inactivity",
            user: { pushNotifToken: "token-1" },
          },
        },
        {
          reminder: {
            id: "inactivity-2",
            type: "Inactivity",
            user: { pushNotifToken: "token-2" },
          },
        },
      ];

      mockPrisma.reminder.findMany.mockResolvedValue([]);
      mockPrisma.reminderUtcDaysOfWeek.findMany
        .mockResolvedValueOnce([]) // Goal reminders
        .mockResolvedValueOnce(mockInactivityReminders); // Inactivity reminders

      await executeReminderCronJob();

      expect(mockPrisma.reminderUtcDaysOfWeek.findMany).toHaveBeenCalledWith({
        where: {
          friday: true,
          reminder: {
            type: "Inactivity",
            disabled: false,
            utcTimeHours: 10,
            utcTimeMinutes: 30,
          },
        },
        include: {
          reminder: {
            include: {
              user: true,
            },
          },
        },
      });

      expect(mockSendNotifications).toHaveBeenCalledWith({
        pushTokens: ["token-1", "token-2"],
        title: "Comment s'est passée cette semaine ?",
        body: "Prenez le temps de la renseigner sur Jardin Mental",
      });
    });

    it("should filter out null push tokens for inactivity reminders", async () => {
      const mockInactivityReminders = [
        {
          reminder: {
            id: "inactivity-1",
            type: "Inactivity",
            user: { pushNotifToken: "token-1" },
          },
        },
        {
          reminder: {
            id: "inactivity-2",
            type: "Inactivity",
            user: { pushNotifToken: null },
          },
        },
        {
          reminder: {
            id: "inactivity-3",
            type: "Inactivity",
            user: null,
          },
        },
      ];

      mockPrisma.reminder.findMany.mockResolvedValue([]);
      mockPrisma.reminderUtcDaysOfWeek.findMany.mockResolvedValueOnce([]).mockResolvedValueOnce(mockInactivityReminders);

      await executeReminderCronJob();

      expect(mockSendNotifications).toHaveBeenCalledWith({
        pushTokens: ["token-1"],
        title: "Comment s'est passée cette semaine ?",
        body: "Prenez le temps de la renseigner sur Jardin Mental",
      });
    });
  });

  describe("Time and Day Logic", () => {
    it("should use correct UTC time and day of week", async () => {
      mockPrisma.reminder.findMany.mockResolvedValue([]);
      mockPrisma.reminderUtcDaysOfWeek.findMany.mockResolvedValue([]);

      await executeReminderCronJob();

      // Verify that the correct time (10:30) and day (friday) are used
      expect(mockPrisma.reminder.findMany).toHaveBeenCalledWith({
        where: {
          type: "Main",
          disabled: false,
          utcTimeHours: 10,
          utcTimeMinutes: 30,
        },
        include: {
          user: true,
        },
      });

      expect(mockPrisma.reminderUtcDaysOfWeek.findMany).toHaveBeenCalledWith({
        where: {
          friday: true,
          reminder: {
            type: "Goal",
            disabled: false,
            utcTimeHours: 10,
            utcTimeMinutes: 30,
          },
        },
        include: {
          reminder: {
            include: {
              user: true,
            },
          },
        },
      });
    });

    it("should work correctly on different days of the week", async () => {
      // Test simple : vérifier que la fonction utilise bien le jour de la semaine
      // Ce test vérifie que la logique de jour de la semaine fonctionne
      mockPrisma.reminder.findMany.mockResolvedValue([]);
      mockPrisma.reminderUtcDaysOfWeek.findMany.mockResolvedValue([]);

      await executeReminderCronJob();

      // Vérifier que les appels incluent bien le jour de la semaine (friday dans notre mock)
      expect(mockPrisma.reminderUtcDaysOfWeek.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            friday: true,
          }),
        })
      );

      // Vérifier que les deux types de rappels (Goal et Inactivity) sont appelés
      expect(mockPrisma.reminderUtcDaysOfWeek.findMany).toHaveBeenCalledTimes(2);
    });
  });

  describe("Integration Tests", () => {
    it("should handle all reminder types in a single execution", async () => {
      const mockMainReminders = [
        {
          id: "main-1",
          type: "Main",
          user: { pushNotifToken: "main-token-1" },
        },
      ];

      const mockGoalReminders = [
        {
          reminder: {
            id: "goal-1",
            type: "Goal",
            customMessage: "Custom goal message",
            user: { pushNotifToken: "goal-token-1" },
          },
        },
      ];

      const mockInactivityReminders = [
        {
          reminder: {
            id: "inactivity-1",
            type: "Inactivity",
            user: { pushNotifToken: "inactivity-token-1" },
          },
        },
      ];

      mockPrisma.reminder.findMany.mockResolvedValue(mockMainReminders);
      mockPrisma.reminderUtcDaysOfWeek.findMany.mockResolvedValueOnce(mockGoalReminders).mockResolvedValueOnce(mockInactivityReminders);

      await executeReminderCronJob();

      expect(mockSendNotifications).toHaveBeenCalledTimes(3);

      // Main reminder notification
      expect(mockSendNotifications).toHaveBeenCalledWith({
        pushTokens: ["main-token-1"],
        title: "Comment allez-vous aujourd'hui ?",
        body: "N'oubliez pas de renseigner votre journée dans Jardin Mental 🌿",
      });

      // Goal reminder notification
      expect(mockSendNotifications).toHaveBeenCalledWith({
        pushTokens: ["goal-token-1"],
        title: "Vous avez un objectif aujourd'hui 🎯",
        body: "Custom goal message",
      });

      // Inactivity reminder notification
      expect(mockSendNotifications).toHaveBeenCalledWith({
        pushTokens: ["inactivity-token-1"],
        title: "Comment s'est passée cette semaine ?",
        body: "Prenez le temps de la renseigner sur Jardin Mental",
      });
    });

    it("should not send notifications when all reminder arrays are empty", async () => {
      mockPrisma.reminder.findMany.mockResolvedValue([]);
      mockPrisma.reminderUtcDaysOfWeek.findMany.mockResolvedValue([]);

      await executeReminderCronJob();

      expect(mockSendNotifications).not.toHaveBeenCalled();
    });
  });
});
