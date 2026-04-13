import { StyleSheet, View } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";

export const LoadingState = () => {
  const { colors } = useTheme();
  return (
    <View
      style={styles.container}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading content"
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
});
