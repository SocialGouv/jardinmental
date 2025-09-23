import { createStorage } from "./createStorage";
import { STORAGE_KEY_GOALS } from "../constants";
import uuid from "react-native-uuid";
import { dayFormat } from "./utils";
import { DAYS_OF_WEEK } from "../date/daysOfWeek";
import { setDay, getDay, format } from "date-fns";
import { fr } from "date-fns/locale";
import NotificationService from "../../services/notifications";
import * as RNLocalize from "react-native-localize";
import API from "../../services/api";

const { getData, saveData, clearData } = createStorage({
  storageKey: STORAGE_KEY_GOALS,
});

export const getGoalsData = getData;
export const saveGoalsData = saveData;
export const clearGoalsData = clearData;

export const goalIdFromLabel = (label) => (label ? label.toLowerCase().trim().split(" ").join("_") : undefined);

export const setGoalTracked = async ({
  id,
  label,
  enabled,
  order,
  daysOfWeek,
  reminder,
}: {
  id: string;
  label?: string;
  enabled?: boolean;
  order?: number;
  daysOfWeek?: string[];
  reminder?: boolean;
}) => {
  if (!id) id = goalIdFromLabel(label);

  let data = await getData();

  const existingGoal = data.goals?.data?.[id];

  const goal = {
    id,
    label: label ?? existingGoal?.label ?? undefined,
    enabled: enabled ?? existingGoal?.enabled ?? true,
    order: order ?? existingGoal?.order ?? 0,
    daysOfWeek: daysOfWeek ?? existingGoal?.daysOfWeek ?? undefined,
    reminder: reminder !== undefined ? reminder : existingGoal?.reminder ?? null,
  };

  data = {
    ...data,
    goals: {
      ...data.goals,
      data: {
        ...data.goals?.data,
        [id]: goal,
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

  await updateApiReminer(goal);

  return goal;
};

export const updateApiReminer = async ({ id, daysOfWeek, enabled, reminder }) => {
  if (!(await NotificationService.hasToken())) return;

  const body = {
    pushNotifToken: await NotificationService.getToken(),
    type: "Goal",
    timezone: RNLocalize.getTimeZone(),
    localId: id,
    disabled: true,
    timeHours: undefined,
    timeMinutes: undefined,
    daysOfWeek: null,
  };

  if (reminder && enabled) {
    body.disabled = false;

    const time = new Date(reminder);
    body.timeHours = time.getHours();
    body.timeMinutes = time.getMinutes();

    body.daysOfWeek = DAYS_OF_WEEK.reduce((acc, day) => {
      acc[day] = daysOfWeek[day] ?? false;
      return acc;
    }, {});
  }

  return await API.put({
    path: "/reminder",
    body,
  });
};

export const getGoalsTracked = async ({ date, enabled = true } = { date: undefined, enabled: true }) => {
  const data = await getData();

  return getGoalsTrackedFromData({ data, date, enabled });
};

export const getGoalsTrackedFromData = ({ data, date, enabled = true } = { data: {}, date: undefined, enabled: true }) => {
  if (!data?.goals?.byOrder?.length) return [];

  const goalsTracked = data.goals.byOrder.map((id) => data.goals.data[id]).filter((goal) => goal.enabled === enabled);

  if (!date) return goalsTracked;

  const day = DAYS_OF_WEEK[getDay(new Date(date))];

  return goalsTracked.filter((goal) => goal.daysOfWeek?.[day] === true);
};

export const setGoalDailyRecord = async ({ goalId, value, comment, date }) => {
  date = dayFormat(date);

  let data = await getData();

  const existingRecordId = data.records?.byDate?.[date]?.find?.((recordId) => data.records.data[recordId]?.goalId === goalId);
  const existingRecord = existingRecordId ? data.records.data[existingRecordId] : undefined;

  const id = existingRecordId ?? uuid.v4();

  const record = {
    id,
    goalId,
    value: value ?? existingRecord?.value,
    comment: comment ?? existingRecord?.comment,
    date,
  };

  data = {
    ...data,
    records: {
      ...data.records,
      data: {
        ...data.records?.data,
        [id]: record,
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

export const getGoalsDailyRecords = async (
  {
    date,
    goalId,
  }: {
    date?: string;
    goalId?: string;
  } = { date: undefined, goalId: undefined }
) => {
  let data = await getData();

  if (date) {
    date = dayFormat(date);

    if (!data.records?.byDate?.[date]?.length) return [];

    return data.records.byDate[date].map((recordId) => data.records.data[recordId]).filter((record) => !!record);
  }

  if (goalId) {
    if (!data.records?.byGoalId?.[goalId]?.length) return [];

    return data.records.byGoalId[goalId].map((recordId) => data.records.data[recordId]).filter((record) => !!record);
  }

  return [];
};

export const getDaysOfWeekLabel = (daysOfWeek) => {
  if (!daysOfWeek) return "";

  const _daysOfWeek = DAYS_OF_WEEK.map((day, index) => ({
    day,
    index,
  })).filter(({ day, index }) => daysOfWeek[day]);
  if (_daysOfWeek.length === 7) return "all";
  else if (_daysOfWeek.length === 0) return "";
  else
    return _daysOfWeek
      .sort((a, b) => (b.index === 0 ? -1 : 0))
      .map(({ day, index }) => format(setDay(new Date(), index), "eee", { locale: fr }))
      .map((label) => `${label[0].toUpperCase()}${label.slice(1)}`)
      .map((label) => (label.slice(-1) === "." ? label.slice(0, -1) : label))
      .join(" ");
};

export const getGoalsAndRecords = async () => {
  let _goals = await getGoalsTracked();
  _goals = await Promise.all(
    _goals.map(async (goal) => {
      const records = await getGoalsDailyRecords({ goalId: goal.id });
      return { goal, records };
    })
  );
  return _goals;
};
