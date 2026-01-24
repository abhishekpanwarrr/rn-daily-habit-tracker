import { CATEGORIES } from "@/utils/extra";
import { addCategory, getCategories, removeCategory } from "@/db/categories";
import { useTheme } from "@/hooks/useTheme";
import { useEffect, useState } from "react";
import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  value: string;
  onChange: (category: string) => void;
};

export default function CategorySelector({ value, onChange }: Props) {
  const { colors } = useTheme();
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const allCategories = [...CATEGORIES, ...customCategories];

  useEffect(() => {
    (async () => {
      const stored = await getCategories();
      setCustomCategories(stored);
    })();
  }, []);

  const onAdd = async () => {
    const name = newCategory.trim();
    if (!name) return;

    await addCategory(name);
    const updated = await getCategories();

    setCustomCategories(updated);
    onChange(name);
    setNewCategory("");
    setModalVisible(false);
  };

  const confirmDelete = (name: string) => {
    Alert.alert("Delete category?", `"${name}" will be removed permanently.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeCategory(name);
          const updated = await getCategories();
          setCustomCategories(updated);

          if (value === name) {
            onChange(CATEGORIES[0]);
          }
        },
      },
    ]);
  };

  const isDefault = (c: string) => CATEGORIES.includes(c);

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>Category</Text>

      <View style={styles.categoryRow}>
        {allCategories.map((c) => {
          const active = value === c;
          const deletable = !isDefault(c);

          return (
            <View key={c} style={styles.chipWrapper}>
              <TouchableOpacity
                onPress={() => onChange(c)}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: active ? colors.primary : colors.border,
                    paddingRight: deletable ? 28 : 12,
                  },
                ]}
              >
                <Text style={{ color: active ? "#fff" : colors.text }}>{c}</Text>
              </TouchableOpacity>

              {deletable && (
                <TouchableOpacity onPress={() => confirmDelete(c)} style={styles.deleteIcon}>
                  <Ionicons name="close-circle" size={16} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {/* ➕ Add */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={[
            styles.categoryChip,
            {
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
              marginLeft: 8,
            },
          ]}
        >
          <Text style={{ color: colors.text }}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* Add modal */}
      <Modal transparent animationType="fade" visible={modalVisible}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>New category</Text>

            <TextInput
              autoFocus
              value={newCategory}
              onChangeText={setNewCategory}
              placeholder="Category name"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, { color: colors.text }]}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: colors.textSecondary }}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onAdd}>
                <Text style={{ color: colors.primary, fontWeight: "600" }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },

  modalCard: {
    width: "85%",
    borderRadius: 16,
    padding: 16,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 16,
  },
  card: {
    marginTop: 4,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 6,
    borderWidth: 1,
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    marginBottom: 8,
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    paddingVertical: 8,
    paddingLeft: 6,
  },
  chipWrapper: {
    position: "relative",
  },

  deleteIcon: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
});
