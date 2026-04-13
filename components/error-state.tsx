import { Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = ({
  message = "Something went wrong. Please try again.",
  onRetry,
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
      {onRetry ? (
        <Pressable
          onPress={onRetry}
          style={[styles.retryButton, { borderColor: colors.outline }]}
          accessibilityRole="button"
          accessibilityLabel="Try again"
        >
          <MaterialCommunityIcons
            name="refresh"
            size={18}
            color={colors.primary}
          />
          <Text variant="labelLarge" style={{ color: colors.primary }}>
            Try again
          </Text>
        </Pressable>
      ) : null}
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
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 8,
  },
});
