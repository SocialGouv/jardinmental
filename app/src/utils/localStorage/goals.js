import { createStorage } from "./createStorage";
import { STORAGE_KEY_GOALS } from "../constants";
import uuid from "react-native-uuid";

const { getData, saveData } = createStorage({
  storageKey: STORAGE_KEY_GOALS,
});

export const getGoalsData = getData;
export const saveGoalsData = saveData;

export const setGoalTracked = async ({ id, label, enabled = true, order = 0 }) => {
  id = id ?? label ? label.toLowerCase().trim().split(" ").join("_") : undefined;

  let data = await getData();

  data = {
    ...data,
    goals: {
      ...data.goals,
      data: {
        ...data.goals?.data,
        [id]: {
          id,
          label,
          enabled,
          order,
        },
      },
    },
  };

  data = {
    ...data,
    goals: {
      ...data.goals,
      byOrder: Object.values(data.goals.data)
        .sort((a, b) => a.order - b.order)
        .map((g) => g.id),
    },
  };

  await saveData(data);
  return data;
};

export const getGoalsTracked = async () => {
  const data = await getData();
  console.log(data);

  if (!data.goals?.byOrder?.length) return [];

  return data.goals.byOrder.map((id) => data.goals.data[id]);
};

export const setGoalDailyRecord = async ({ goalId, value, date }) => {
  date = dayFormat(date);

  let data = await getData();

  const existingRecordId = data.records?.byDate?.[date];
  const id = existingRecordId ?? uuid.v4();

  data = {
    ...data,
    records: {
      ...data.records,
      data: {
        ...data.records?.data,
        [id]: { id, goalId, value, date },
      },
      byDate: {
        ...data.records.byDate,
        [date]: id,
      },
      byGoalId: {
        ...data.records.byGoalId,
        [goalId]: id,
      },
    },
  };

  await saveData(data);
  return data;
};
