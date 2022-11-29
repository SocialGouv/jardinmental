import AsyncStorage from "@react-native-async-storage/async-storage";

export const createStorage = ({
  currentVersion = 0,
  versionTransformations = {
    0: (dataV0) => {
      return dataV0;
    },
  },
  storageKey,
}) => {
  const updateDataIfNeeded = async (data) => {
    if (!data) {
      data = {
        version: currentVersion,
      };
    } else {
      const dataVersion = data?.version || 0;
      if (dataVersion !== currentVersion) {
        for (let i = dataVersion + 1; i <= currentVersion; i++) {
          data = versionTransformations[i](data);
        }
        data.version = currentVersion;
      }
    }

    await saveData(data);
    return data;
  };

  const getData = async () => {
    let data = await AsyncStorage.getItem(storageKey);
    data = JSON.parse(data);
    data = updateDataIfNeeded(data);
    return data;
  };

  const saveData = async (data) => {
    await AsyncStorage.setItem(storageKey, JSON.stringify(data));
    return data;
  };

  const clearData = async () => {
    const data = await updateDataIfNeeded({});
    return data;
  };

  return {
    getData,
    saveData,
    clearData,
  };
};
