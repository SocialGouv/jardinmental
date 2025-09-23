import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  goalIdFromLabel,
  setGoalTracked,
  getGoalsTracked,
  getGoalsTrackedFromData,
  setGoalDailyRecord,
  getGoalsDailyRecords,
  getDaysOfWeekLabel,
  getGoalsAndRecords,
  updateApiReminer,
  getGoalsData,
  saveGoalsData,
  clearGoalsData,
} from "../../src/utils/localStorage/goals";

// Mock dependencies with minimal mocking
jest.mock("react-native-uuid", () => ({
  v4: jest.fn(() => "mock-uuid-123"),
}));

jest.mock("../../src/services/notifications", () => ({
  hasToken: jest.fn(() => Promise.resolve(true)),
  getToken: jest.fn(() => Promise.resolve("mock-token")),
}));

jest.mock("../../src/services/api", () => ({
  put: jest.fn(() => Promise.resolve({ success: true })),
}));

jest.mock("react-native-localize", () => ({
  getTimeZone: jest.fn(() => "Europe/Paris"),
}));

import uuid from "react-native-uuid";
import NotificationService from "../../src/services/notifications";
import API from "../../src/services/api";

describe("goals.ts", () => {
  beforeEach(() => {
    // Clear AsyncStorage before each test
    AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe("goalIdFromLabel", () => {
    it("should convert label to lowercase id with underscores", () => {
      expect(goalIdFromLabel("My Goal Label")).toBe("my_goal_label");
    });

    it("should handle extra spaces", () => {
      expect(goalIdFromLabel("  Spaced   Goal  ")).toBe("spaced___goal");
    });

    it("should return undefined for empty or null label", () => {
      expect(goalIdFromLabel("")).toBeUndefined();
      expect(goalIdFromLabel(null)).toBeUndefined();
      expect(goalIdFromLabel(undefined)).toBeUndefined();
    });
  });

  describe("Storage functions", () => {
    it("should save and retrieve goals data", async () => {
      const testData = { goals: { data: {}, byOrder: [] } };

      await saveGoalsData(testData);
      const retrievedData = await getGoalsData();

      expect(retrievedData).toEqual(expect.objectContaining(testData));
    });

    it("should clear goals data", async () => {
      const testData = { goals: { data: { test: "value" } } };
      await saveGoalsData(testData);

      const clearedData = await clearGoalsData();

      expect(clearedData.goals).toBeUndefined();
    });
  });

  describe("setGoalTracked", () => {
    it("should create a new goal with all parameters", async () => {
      const goalData = {
        id: "test_goal",
        label: "Test Goal",
        enabled: true,
        order: 1,
        daysOfWeek: { monday: true, tuesday: false },
        reminder: new Date("2023-01-01T10:00:00Z"),
      };

      const result = await setGoalTracked(goalData);

      expect(result).toEqual({
        ...goalData,
        customMessage: null,
      });
      expect(API.put).toHaveBeenCalledWith({
        path: "/reminder",
        body: expect.objectContaining({
          pushNotifToken: "mock-token",
          type: "Goal",
          timezone: "Europe/Paris",
          localId: "test_goal",
          disabled: false,
          daysOfWeek: expect.objectContaining({
            sunday: false,
            monday: true,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
          }),
        }),
      });
    });

    it("should generate id from label if not provided", async () => {
      const result = await setGoalTracked({
        label: "Auto Generated ID",
        enabled: true,
      } as any);

      expect(result.id).toBe("auto_generated_id");
    });

    it("should update existing goal", async () => {
      // First create a goal
      await setGoalTracked({
        id: "existing_goal",
        label: "Original Label",
        enabled: true,
        order: 1,
      } as any);

      // Then update it
      const result = await setGoalTracked({
        id: "existing_goal",
        label: "Updated Label",
        order: 2,
      } as any);

      expect(result.label).toBe("Updated Label");
      expect(result.order).toBe(2);
      expect(result.enabled).toBe(true); // Should keep original value
    });

    it("should maintain byOrder array sorted by order", async () => {
      await setGoalTracked({ id: "goal_3", label: "Goal 3", order: 3 } as any);
      await setGoalTracked({ id: "goal_1", label: "Goal 1", order: 1 } as any);
      await setGoalTracked({ id: "goal_2", label: "Goal 2", order: 2 } as any);

      const data = (await getGoalsData()) as any;
      expect(data?.goals?.byOrder).toEqual(["goal_1", "goal_2", "goal_3"]);
    });
  });

  describe("getGoalsTracked", () => {
    beforeEach(async () => {
      // Setup test data
      await setGoalTracked({
        id: "daily_goal",
        label: "Daily Goal",
        enabled: true,
        daysOfWeek: { monday: true, tuesday: true, wednesday: false },
      } as any);
      await setGoalTracked({
        id: "disabled_goal",
        label: "Disabled Goal",
        enabled: false,
      } as any);
    });

    it("should return enabled goals by default", async () => {
      const goals = await getGoalsTracked();

      expect(goals).toHaveLength(1);
      expect(goals[0].id).toBe("daily_goal");
      expect(goals[0].enabled).toBe(true);
    });

    it("should return disabled goals when enabled=false", async () => {
      const goals = await getGoalsTracked({ enabled: false } as any);

      expect(goals).toHaveLength(1);
      expect(goals[0].id).toBe("disabled_goal");
      expect(goals[0].enabled).toBe(false);
    });

    it("should filter by date (day of week)", async () => {
      // Monday (day 1 in date-fns)
      const mondayDate = new Date("2023-01-02"); // This is a Monday
      const goals = await getGoalsTracked({ date: mondayDate } as any);

      expect(goals).toHaveLength(1);
      expect(goals[0].id).toBe("daily_goal");

      // Wednesday (day 3 in date-fns)
      const wednesdayDate = new Date("2023-01-04"); // This is a Wednesday
      const wednesdayGoals = await getGoalsTracked({ date: wednesdayDate } as any);

      expect(wednesdayGoals).toHaveLength(0);
    });
  });

  describe("getGoalsTrackedFromData", () => {
    const testData = {
      goals: {
        data: {
          goal1: { id: "goal1", enabled: true, daysOfWeek: { monday: true } },
          goal2: { id: "goal2", enabled: false, daysOfWeek: { monday: true } },
        },
        byOrder: ["goal1", "goal2"],
      },
    };

    it("should return empty array for empty data", () => {
      const result = getGoalsTrackedFromData({ data: {}, date: undefined });
      expect(result).toEqual([]);
    });

    it("should filter by enabled status", () => {
      const enabledGoals = getGoalsTrackedFromData({ data: testData, date: undefined, enabled: true });
      expect(enabledGoals).toHaveLength(1);
      expect(enabledGoals[0].id).toBe("goal1");

      const disabledGoals = getGoalsTrackedFromData({ data: testData, date: undefined, enabled: false } as any);
      expect(disabledGoals).toHaveLength(1);
      expect(disabledGoals[0].id).toBe("goal2");
    });

    it("should filter by date", () => {
      const mondayDate = new Date("2023-01-02"); // Monday
      const mondayGoals = getGoalsTrackedFromData({
        data: testData,
        date: mondayDate,
        enabled: true,
      } as any);

      expect(mondayGoals).toHaveLength(1);
      expect(mondayGoals[0].id).toBe("goal1");
    });
  });

  describe("setGoalDailyRecord", () => {
    beforeEach(async () => {
      await setGoalTracked({
        id: "test_goal",
        label: "Test Goal",
        enabled: true,
      } as any);
    });

    it("should create a new daily record", async () => {
      const recordData = {
        goalId: "test_goal",
        value: 4,
        comment: "Good progress",
        date: new Date("2023-01-01"),
      };

      const result = (await setGoalDailyRecord(recordData)) as any;

      expect(result?.records?.data?.["mock-uuid-123"]).toEqual({
        id: "mock-uuid-123",
        goalId: "test_goal",
        value: 4,
        comment: "Good progress",
        date: "2023-01-01",
      });
    });

    it("should update existing record for same goal and date", async () => {
      const date = new Date("2023-01-01");

      // Create first record
      await setGoalDailyRecord({
        goalId: "test_goal",
        value: 3,
        comment: "Initial",
        date,
      });

      // Update with new value
      const result = (await setGoalDailyRecord({
        goalId: "test_goal",
        value: 5,
        comment: "Updated",
        date,
      })) as any;

      const records = Object.values(result?.records?.data || {});
      expect(records).toHaveLength(1);
      expect((records[0] as any).value).toBe(5);
      expect((records[0] as any).comment).toBe("Updated");
    });

    it("should maintain byDate and byGoalId indexes", async () => {
      await setGoalDailyRecord({
        goalId: "test_goal",
        value: 4,
        date: new Date("2023-01-01"),
      } as any);

      const data = (await getGoalsData()) as any;

      expect(data?.records?.byDate?.["2023-01-01"]).toContain("mock-uuid-123");
      expect(data?.records?.byGoalId?.["test_goal"]).toContain("mock-uuid-123");
    });
  });

  describe("getGoalsDailyRecords", () => {
    beforeEach(async () => {
      await setGoalTracked({ id: "goal1", label: "Goal 1" } as any);
      await setGoalTracked({ id: "goal2", label: "Goal 2" } as any);

      // Create some test records
      await setGoalDailyRecord({
        goalId: "goal1",
        value: 4,
        date: new Date("2023-01-01"),
      } as any);

      (uuid.v4 as jest.Mock).mockReturnValueOnce("record-2");
      await setGoalDailyRecord({
        goalId: "goal2",
        value: 3,
        date: new Date("2023-01-01"),
      } as any);

      (uuid.v4 as jest.Mock).mockReturnValueOnce("record-3");
      await setGoalDailyRecord({
        goalId: "goal1",
        value: 5,
        date: new Date("2023-01-02"),
      } as any);
    });

    it("should return records by date", async () => {
      const records = await getGoalsDailyRecords({ date: new Date("2023-01-01") } as any);

      expect(records).toHaveLength(2);
      expect(records.map((r) => r.goalId)).toContain("goal1");
      expect(records.map((r) => r.goalId)).toContain("goal2");
    });

    it("should return records by goalId", async () => {
      const records = await getGoalsDailyRecords({ goalId: "goal1" } as any);

      expect(records).toHaveLength(2);
      expect(records.every((r) => r.goalId === "goal1")).toBe(true);
    });

    it("should return empty array for non-existent date", async () => {
      const records = await getGoalsDailyRecords({ date: new Date("2023-12-31") } as any);
      expect(records).toEqual([]);
    });

    it("should return empty array for non-existent goalId", async () => {
      const records = await getGoalsDailyRecords({ goalId: "non_existent" } as any);
      expect(records).toEqual([]);
    });
  });

  describe("getDaysOfWeekLabel", () => {
    it('should return "all" for all days selected', () => {
      const allDays = {
        sunday: true,
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
      };

      expect(getDaysOfWeekLabel(allDays)).toBe("all");
    });

    it("should return empty string for no days selected", () => {
      const noDays = {
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
      };

      expect(getDaysOfWeekLabel(noDays)).toBe("");
    });

    it("should return empty string for undefined", () => {
      expect(getDaysOfWeekLabel(undefined)).toBe("");
      expect(getDaysOfWeekLabel(null)).toBe("");
    });

    it("should return formatted days for partial selection", () => {
      const weekdays = {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
      };

      const result = getDaysOfWeekLabel(weekdays);
      expect(result).toContain("Lun");
      expect(result).toContain("Mar");
      expect(result).toContain("Mer");
      expect(result).toContain("Jeu");
      expect(result).toContain("Ven");
    });
  });

  describe("getGoalsAndRecords", () => {
    beforeEach(async () => {
      await setGoalTracked({
        id: "goal_with_records",
        label: "Goal with Records",
        enabled: true,
      } as any);

      await setGoalDailyRecord({
        goalId: "goal_with_records",
        value: 4,
        date: new Date("2023-01-01"),
      } as any);
    });

    it("should return goals with their associated records", async () => {
      const result = await getGoalsAndRecords();

      expect(result).toHaveLength(1);
      expect(result[0].goal.id).toBe("goal_with_records");
      expect(result[0].records).toHaveLength(1);
      expect(result[0].records[0].goalId).toBe("goal_with_records");
    });
  });

  describe("updateApiReminer", () => {
    it("should not call API if no notification token", async () => {
      (NotificationService.hasToken as jest.Mock).mockResolvedValueOnce(false);

      await updateApiReminer({
        id: "test_goal",
        enabled: true,
        reminder: new Date("2023-01-01T10:00:00Z"),
        daysOfWeek: { monday: true },
      });

      expect(API.put).not.toHaveBeenCalled();
    });

    it("should call API with disabled reminder when goal is disabled", async () => {
      await updateApiReminer({
        id: "test_goal",
        enabled: false,
        reminder: new Date("2023-01-01T10:00:00Z"),
        daysOfWeek: { monday: true },
      });

      expect(API.put).toHaveBeenCalledWith({
        path: "/reminder",
        body: expect.objectContaining({
          disabled: true,
          timeHours: undefined,
          timeMinutes: undefined,
          daysOfWeek: null,
        }),
      });
    });

    it("should call API with enabled reminder when goal is enabled with reminder", async () => {
      await updateApiReminer({
        id: "test_goal",
        enabled: true,
        reminder: new Date("2023-01-01T14:30:00Z"),
        daysOfWeek: { monday: true, tuesday: false },
      });

      expect(API.put).toHaveBeenCalledWith({
        path: "/reminder",
        body: expect.objectContaining({
          pushNotifToken: "mock-token",
          type: "Goal",
          timezone: "Europe/Paris",
          localId: "test_goal",
          disabled: false,
          daysOfWeek: expect.objectContaining({
            sunday: false,
            monday: true,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
          }),
        }),
      });
    });
  });

  describe("Integration tests", () => {
    it("should handle complete goal lifecycle", async () => {
      // Reset UUID mock to ensure unique IDs for each record
      (uuid.v4 as jest.Mock).mockReturnValueOnce("integration-record-1");

      // Create goal
      const goal = await setGoalTracked({
        label: "Integration Test Goal",
        enabled: true,
        daysOfWeek: { monday: true, friday: true },
        reminder: new Date("2023-01-01T09:00:00Z"),
      } as any);

      // Add daily records with different UUIDs
      (uuid.v4 as jest.Mock).mockReturnValueOnce("integration-record-2");
      await setGoalDailyRecord({
        goalId: goal.id,
        value: 4,
        comment: "Good day",
        date: new Date("2023-01-02"), // Monday
      });

      (uuid.v4 as jest.Mock).mockReturnValueOnce("integration-record-3");
      await setGoalDailyRecord({
        goalId: goal.id,
        value: 3,
        comment: "Average day",
        date: new Date("2023-01-06"), // Friday
      });

      // Retrieve goals for Monday
      const mondayGoals = await getGoalsTracked({
        date: new Date("2023-01-02"),
      } as any);
      expect(mondayGoals).toHaveLength(1);

      // Retrieve records for the goal
      const records = await getGoalsDailyRecords({ goalId: goal.id } as any);
      expect(records).toHaveLength(2);

      // Get complete data
      const goalsAndRecords = await getGoalsAndRecords();
      expect(goalsAndRecords).toHaveLength(1);
      expect(goalsAndRecords[0].records).toHaveLength(2);
    });
  });
});
