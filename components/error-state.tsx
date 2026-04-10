import { StyleSheet, View } from "react-native";
import { Text, MD3DarkTheme } from "react-native-paper";

interface IErrorStateProps {
  message?: string;
}

export const ErrorState = ({
  message = "Something went wrong. Please try again.",
}: IErrorStateProps) => (
  <View style={styles.container}>
    <Text style={styles.icon}>⚠️</Text>
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    gap: 12,
  },
  icon: {
    fontSize: 40,
  },
  message: {
    color: MD3DarkTheme.colors.error,
    textAlign: "center",
    fontSize: 16,
  },
});
