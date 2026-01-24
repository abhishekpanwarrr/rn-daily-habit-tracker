import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "HABITO_CUSTOM_CATEGORIES";

export const getCategories = async (): Promise<string[]> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
};

export const addCategory = async (name: string) => {
  const current = await getCategories();
  if (current.includes(name)) return;

  const updated = [...current, name];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const removeCategory = async (name: string) => {
  const current = await getCategories();
  const updated = current.filter((c) => c !== name);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
