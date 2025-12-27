import { useThemeMode } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const { mode, setMode } = useThemeMode();
  const text = useThemeColor({}, "text");
  const card = useThemeColor({}, "card");

  const Option = ({ label, value }: any) => (
    <TouchableOpacity
      onPress={() => setMode(value)}
      style={{
        padding: 16,
        backgroundColor: card,
        marginBottom: 12,
        borderRadius: 12,
      }}
    >
      <Text style={{ color: text }}>
        {label} {mode === value ? "✓" : ""}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ padding: 16 }}>
      <Text style={{ fontSize: 20, marginBottom: 16, color: text }}>Theme</Text>

      <Option label="System default" value="system" />
      <Option label="Light mode" value="light" />
      <Option label="Dark mode" value="dark" />
    </SafeAreaView>
  );
}
