import request from "supertest";
import { jest } from "@jest/globals";
import express, { Application } from "express";

// Types pour les mocks
type MockFunction = jest.MockedFunction<any>;

// Mock Prisma avant l'import
const mockPrisma = {
  anonymisedUser: {
    findUnique: jest.fn() as MockFunction,
    create: jest.fn() as MockFunction,
    update: jest.fn() as MockFunction,
  },
  reminder: {
    findFirst: jest.fn() as MockFunction,
    create: jest.fn() as MockFunction,
    update: jest.fn() as MockFunction,
  },
};

// Mock du module prisma
jest.mock("../prisma", () => ({
  prisma: mockPrisma,
}));

// Mock des middlewares
jest.mock("../middlewares/errors", () => ({
  catchErrors: (fn: any) => fn,
}));

// Import du router après les mocks
const { router } = require("../controllers/reminder");

describe("Reminder API", () => {
  let app: Application;

  beforeEach(() => {
    // Créer une nouvelle app Express pour chaque test
    app = express();
    app.use(express.json());
    app.use("/reminder", router);

    // Reset tous les mocks
    jest.clearAllMocks();
  });

  describe("PUT /reminder", () => {
    const validReminderData = {
      pushNotifToken: "test-token-123",
      type: "Main",
      timeHours: 9,
      timeMinutes: 30,
      timezone: "Europe/Paris",
      daysOfWeek: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
      },
      disabled: false,
    };

    const mockUser = {
      id: "user-123",
      pushNotifToken: "test-token-123",
    };

    const mockReminder = {
      id: "reminder-123",
      userId: "user-123",
      type: "Main",
      utcTimeHours: 7,
      utcTimeMinutes: 30,
      utcDaysOfWeek: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false,
      },
      disabled: false,
    };

    it("should create a new reminder for a new user", async () => {
      // Mock: utilisateur n'existe pas
      mockPrisma.anonymisedUser.findUnique.mockResolvedValue(null);
      mockPrisma.anonymisedUser.create.mockResolvedValue(mockUser);

      // Mock: reminder n'existe pas
      mockPrisma.reminder.findFirst.mockResolvedValue(null);
      mockPrisma.reminder.create.mockResolvedValue(mockReminder);

      const response = await request(app).put("/reminder").send(validReminderData).expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.reminder).toEqual(mockReminder);

      // Vérifier que l'utilisateur a été créé
      expect(mockPrisma.anonymisedUser.create).toHaveBeenCalledWith({
        data: { pushNotifToken: "test-token-123" },
      });

      // Vérifier que le reminder a été créé
      expect(mockPrisma.reminder.create).toHaveBeenCalled();
    });

    it("should update an existing reminder for an existing user", async () => {
      // Mock: utilisateur existe
      mockPrisma.anonymisedUser.findUnique.mockResolvedValue(mockUser);

      // Mock: reminder existe
      mockPrisma.reminder.findFirst.mockResolvedValue(mockReminder);
      mockPrisma.reminder.update.mockResolvedValue(mockReminder);

      const response = await request(app).put("/reminder").send(validReminderData).expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.reminder).toEqual(mockReminder);

      // Vérifier que l'utilisateur n'a pas été créé
      expect(mockPrisma.anonymisedUser.create).not.toHaveBeenCalled();

      // Vérifier que le reminder a été mis à jour
      expect(mockPrisma.reminder.update).toHaveBeenCalledWith({
        where: { id: mockReminder.id },
        data: expect.objectContaining({
          type: "Main",
          disabled: false,
        }),
        include: { utcDaysOfWeek: true },
      });
    });

    it("should handle Goal type reminder with localId", async () => {
      const goalReminderData = {
        ...validReminderData,
        type: "Goal",
        localId: "goal-local-123",
      };

      mockPrisma.anonymisedUser.findUnique.mockResolvedValue(mockUser);
      mockPrisma.reminder.findFirst.mockResolvedValue(null);
      mockPrisma.reminder.create.mockResolvedValue(mockReminder);

      const response = await request(app).put("/reminder").send(goalReminderData).expect(200);

      expect(response.body.ok).toBe(true);
      expect(mockPrisma.reminder.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: "Goal",
          localId: "goal-local-123",
        }),
        include: { utcDaysOfWeek: true },
      });
    });

    it("should handle disabled reminder", async () => {
      const disabledReminderData = {
        pushNotifToken: "test-token-123",
        type: "Main",
        disabled: true,
      };

      mockPrisma.anonymisedUser.findUnique.mockResolvedValue(mockUser);
      mockPrisma.reminder.findFirst.mockResolvedValue(null);
      mockPrisma.reminder.create.mockResolvedValue({ ...mockReminder, disabled: true });

      const response = await request(app).put("/reminder").send(disabledReminderData).expect(200);

      expect(response.body.ok).toBe(true);
      expect(mockPrisma.reminder.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          disabled: true,
        }),
        include: { utcDaysOfWeek: true },
      });
    });

    it("should create reminder with customMessage", async () => {
      const reminderDataWithCustomMessage = {
        ...validReminderData,
        customMessage: "Remember to take your medication",
      };

      mockPrisma.anonymisedUser.findUnique.mockResolvedValue(null);
      mockPrisma.anonymisedUser.create.mockResolvedValue(mockUser);
      mockPrisma.reminder.findFirst.mockResolvedValue(null);
      mockPrisma.reminder.create.mockResolvedValue({
        ...mockReminder,
        customMessage: "Remember to take your medication",
      });

      const response = await request(app).put("/reminder").send(reminderDataWithCustomMessage).expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.reminder.customMessage).toBe("Remember to take your medication");

      expect(mockPrisma.reminder.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          customMessage: "Remember to take your medication",
        }),
        include: { utcDaysOfWeek: true },
      });
    });

    it("should update existing reminder with customMessage", async () => {
      const reminderDataWithCustomMessage = {
        ...validReminderData,
        customMessage: "Updated custom message",
      };

      mockPrisma.anonymisedUser.findUnique.mockResolvedValue(mockUser);
      mockPrisma.reminder.findFirst.mockResolvedValue(mockReminder);
      mockPrisma.reminder.update.mockResolvedValue({
        ...mockReminder,
        customMessage: "Updated custom message",
      });

      const response = await request(app).put("/reminder").send(reminderDataWithCustomMessage).expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.reminder.customMessage).toBe("Updated custom message");

      expect(mockPrisma.reminder.update).toHaveBeenCalledWith({
        where: { id: mockReminder.id },
        data: expect.objectContaining({
          customMessage: "Updated custom message",
        }),
        include: { utcDaysOfWeek: true },
      });
    });

    it("should create reminder without customMessage (null)", async () => {
      mockPrisma.anonymisedUser.findUnique.mockResolvedValue(null);
      mockPrisma.anonymisedUser.create.mockResolvedValue(mockUser);
      mockPrisma.reminder.findFirst.mockResolvedValue(null);
      mockPrisma.reminder.create.mockResolvedValue({
        ...mockReminder,
        customMessage: null,
      });

      const response = await request(app).put("/reminder").send(validReminderData).expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.reminder.customMessage).toBe(null);

      expect(mockPrisma.reminder.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          customMessage: null,
        }),
        include: { utcDaysOfWeek: true },
      });
    });

    it("should handle empty string customMessage", async () => {
      const reminderDataWithEmptyMessage = {
        ...validReminderData,
        customMessage: "",
      };

      mockPrisma.anonymisedUser.findUnique.mockResolvedValue(null);
      mockPrisma.anonymisedUser.create.mockResolvedValue(mockUser);
      mockPrisma.reminder.findFirst.mockResolvedValue(null);
      mockPrisma.reminder.create.mockResolvedValue({
        ...mockReminder,
        customMessage: null,
      });

      const response = await request(app).put("/reminder").send(reminderDataWithEmptyMessage).expect(200);

      expect(response.body.ok).toBe(true);

      expect(mockPrisma.reminder.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          customMessage: null,
        }),
        include: { utcDaysOfWeek: true },
      });
    });

    it("should handle customMessage with different reminder types", async () => {
      const goalReminderWithCustomMessage = {
        ...validReminderData,
        type: "Goal",
        localId: "goal-local-123",
        customMessage: "Goal reminder message",
      };

      mockPrisma.anonymisedUser.findUnique.mockResolvedValue(mockUser);
      mockPrisma.reminder.findFirst.mockResolvedValue(null);
      mockPrisma.reminder.create.mockResolvedValue({
        ...mockReminder,
        type: "Goal",
        localId: "goal-local-123",
        customMessage: "Goal reminder message",
      });

      const response = await request(app).put("/reminder").send(goalReminderWithCustomMessage).expect(200);

      expect(response.body.ok).toBe(true);
      expect(response.body.reminder.customMessage).toBe("Goal reminder message");

      expect(mockPrisma.reminder.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          type: "Goal",
          localId: "goal-local-123",
          customMessage: "Goal reminder message",
        }),
        include: { utcDaysOfWeek: true },
      });
    });

    describe("Validation errors", () => {
      it("should return 400 if pushNotifToken is missing", async () => {
        const invalidData = {
          type: "Main",
          timeHours: 9,
          timeMinutes: 30,
          timezone: "Europe/Paris",
          disabled: false,
        };

        const response = await request(app).put("/reminder").send(invalidData).expect(400);

        expect(response.body.ok).toBe(false);
        expect(response.body.error).toBe("wrong parameters");
      });

      it("should return 400 if type is invalid", async () => {
        const invalidData = {
          pushNotifToken: "test-token-123",
          type: "InvalidType",
          timeHours: 9,
          timeMinutes: 30,
          timezone: "Europe/Paris",
          disabled: false,
        };

        const response = await request(app).put("/reminder").send(invalidData).expect(400);

        expect(response.body.ok).toBe(false);
        expect(response.body.error).toBe("wrong parameters");
      });

      it("should return 400 if timezone is missing for non-disabled reminder", async () => {
        const invalidData = {
          pushNotifToken: "test-token-123",
          type: "Main",
          timeHours: 9,
          timeMinutes: 30,
          disabled: false,
        };

        const response = await request(app).put("/reminder").send(invalidData).expect(400);

        expect(response.body.ok).toBe(false);
        expect(response.body.error).toBe("wrong parameters");
      });

      it("should return 400 if timeHours is invalid", async () => {
        const invalidData = {
          pushNotifToken: "test-token-123",
          type: "Main",
          timeHours: "invalid",
          timeMinutes: 30,
          timezone: "Europe/Paris",
          disabled: false,
        };

        const response = await request(app).put("/reminder").send(invalidData).expect(400);

        expect(response.body.ok).toBe(false);
        expect(response.body.error).toBe("wrong parameters");
      });

      it("should return 400 if customMessage is longer than 200 characters", async () => {
        const longMessage = "a".repeat(201); // 201 characters
        const invalidData = {
          ...validReminderData,
          customMessage: longMessage,
        };

        const response = await request(app).put("/reminder").send(invalidData).expect(400);

        expect(response.body.ok).toBe(false);
        expect(response.body.error).toBe("customMessage must be a string with max 200 characters");
      });

      it("should return 400 if customMessage is not a string", async () => {
        const invalidData = {
          ...validReminderData,
          customMessage: 12345, // number instead of string
        };

        const response = await request(app).put("/reminder").send(invalidData).expect(400);

        expect(response.body.ok).toBe(false);
        expect(response.body.error).toBe("customMessage must be a string with max 200 characters");
      });

      it("should accept customMessage with exactly 200 characters", async () => {
        const exactMessage = "a".repeat(200); // exactly 200 characters
        const validData = {
          ...validReminderData,
          customMessage: exactMessage,
        };

        mockPrisma.anonymisedUser.findUnique.mockResolvedValue(null);
        mockPrisma.anonymisedUser.create.mockResolvedValue(mockUser);
        mockPrisma.reminder.findFirst.mockResolvedValue(null);
        mockPrisma.reminder.create.mockResolvedValue({
          ...mockReminder,
          customMessage: exactMessage,
        });

        const response = await request(app).put("/reminder").send(validData).expect(200);

        expect(response.body.ok).toBe(true);
        expect(response.body.reminder.customMessage).toBe(exactMessage);
      });
    });
  });

  describe("PUT /reminder/refreshPushNotifToken", () => {
    const mockUser = {
      id: "user-123",
      pushNotifToken: "old-token-123",
    };

    it("should update push notification token for existing user", async () => {
      mockPrisma.anonymisedUser.findUnique.mockResolvedValue(mockUser);
      mockPrisma.anonymisedUser.update.mockResolvedValue({
        ...mockUser,
        pushNotifToken: "new-token-456",
      });

      const response = await request(app)
        .put("/reminder/refreshPushNotifToken")
        .send({
          oldPushNotifToken: "old-token-123",
          newPushNotifToken: "new-token-456",
        })
        .expect(200);

      expect(response.body.ok).toBe(true);

      expect(mockPrisma.anonymisedUser.findUnique).toHaveBeenCalledWith({
        where: { pushNotifToken: "old-token-123" },
      });

      expect(mockPrisma.anonymisedUser.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: { pushNotifToken: "new-token-456" },
      });
    });

    it("should handle non-existing user gracefully", async () => {
      mockPrisma.anonymisedUser.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put("/reminder/refreshPushNotifToken")
        .send({
          oldPushNotifToken: "non-existing-token",
          newPushNotifToken: "new-token-456",
        })
        .expect(200);

      expect(response.body.ok).toBe(true);
      expect(mockPrisma.anonymisedUser.update).not.toHaveBeenCalled();
    });

    describe("Validation errors", () => {
      it("should return 400 if newPushNotifToken is missing", async () => {
        const response = await request(app)
          .put("/reminder/refreshPushNotifToken")
          .send({
            oldPushNotifToken: "old-token-123",
          })
          .expect(400);

        expect(response.body.ok).toBe(false);
        expect(response.body.error).toBe("wrong parameters");
      });

      it("should return 400 if oldPushNotifToken is missing", async () => {
        const response = await request(app)
          .put("/reminder/refreshPushNotifToken")
          .send({
            newPushNotifToken: "new-token-456",
          })
          .expect(400);

        expect(response.body.ok).toBe(false);
        expect(response.body.error).toBe("wrong parameters");
      });

      it("should return 400 if both tokens are missing", async () => {
        const response = await request(app).put("/reminder/refreshPushNotifToken").send({}).expect(400);

        expect(response.body.ok).toBe(false);
        expect(response.body.error).toBe("wrong parameters");
      });
    });
  });

  describe("Timezone conversion", () => {
    it("should correctly convert timezone for different timezones", async () => {
      const reminderData = {
        pushNotifToken: "test-token-123",
        type: "Main",
        timeHours: 9,
        timeMinutes: 30,
        timezone: "America/New_York",
        daysOfWeek: {
          monday: true,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        },
        disabled: false,
      };

      const mockUser = { id: "user-123", pushNotifToken: "test-token-123" };
      mockPrisma.anonymisedUser.findUnique.mockResolvedValue(mockUser);
      mockPrisma.reminder.findFirst.mockResolvedValue(null);
      mockPrisma.reminder.create.mockResolvedValue({
        id: "reminder-123",
        userId: "user-123",
        type: "Main",
        utcTimeHours: 14, // 9h New York = 14h UTC (en hiver)
        utcTimeMinutes: 30,
        disabled: false,
      });

      const response = await request(app).put("/reminder").send(reminderData).expect(200);

      expect(response.body.ok).toBe(true);

      // Vérifier que la conversion de timezone a été appliquée
      expect(mockPrisma.reminder.create).toHaveBeenCalled();
      const createCall = mockPrisma.reminder.create.mock.calls[0][0] as any;
      expect(createCall.data.utcTimeHours).toBeDefined();
      expect(createCall.data.utcTimeMinutes).toBe(30);
    });
  });
});
