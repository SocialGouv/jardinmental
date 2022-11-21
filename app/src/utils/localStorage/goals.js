import { createStorage } from "./createStorage";
import { STORAGE_KEY_GOALS } from "../constants";
import uuid from "react-native-uuid";
import { dayFormat } from "./utils";

const { getData, saveData, clearData } = createStorage({
  storageKey: STORAGE_KEY_GOALS,
});

export const getGoalsData = getData;
export const saveGoalsData = saveData;
export const clearGoalsData = clearData;

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

  if (!data.goals?.byOrder?.length) return [];

  return data.goals.byOrder.map((id) => data.goals.data[id]);
};

export const setGoalDailyRecord = async ({ goalId, value, comment, date }) => {
  date = dayFormat(date);

  let data = await getData();

  const existingRecordId = data.records?.byDate?.[date]?.find?.(
    (recordId) => data.records.data[recordId]?.goalId === goalId
  );
  const existingRecord = existingRecordId ? data.records.data[existingRecordId] : undefined;

  const id = existingRecordId ?? uuid.v4();

  data = {
    ...data,
    records: {
      ...data.records,
      data: {
        ...data.records?.data,
        [id]: {
          id,
          goalId,
          value: value ?? existingRecord?.value,
          comment: comment ?? existingRecord?.comment,
          date,
        },
      },
      byDate: {
        ...data.records?.byDate,
        [date]: [...(data.records?.byDate?.[date]?.filter?.((_id) => _id !== id) || []), id],
      },
      byGoalId: {
        ...data.records?.byGoalId,
        [goalId]: [...(data.records?.byGoalId?.[goalId]?.filter?.((_id) => _id !== id) || []), id],
      },
    },
  };

  await saveData(data);
  return data;
};

export const getGoalsDailyRecords = async ({ date } = { date: new Date() }) => {
  date = dayFormat(date);

  let data = await getData();

  if (!data.records?.byDate?.[date]?.length) return [];

  return data.records.byDate[date]
    .map((recordId) => data.records.data[recordId])
    .filter((record) => !!record);
};
