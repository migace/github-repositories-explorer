import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ErrorStateProps {
  message?: string;
}

export const ErrorState = ({
  message = "Something went wrong. Please try again.",
}: ErrorStateProps) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container} accessibilityRole="alert">
      <MaterialCommunityIcons
        name="alert-circle-outline"
        size={48}
        color={colors.error}
        accessibilityElementsHidden
      />
      <Text
        variant="bodyLarge"
        style={[styles.message, { color: colors.onBackground }]}
      >
        {message}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    gap: 14,
  },
  message: {
    textAlign: "center",
    lineHeight: 22,
  },
});
