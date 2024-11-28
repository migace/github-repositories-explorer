import { StyleSheet, View } from "react-native";
import { MD3DarkTheme, Text } from "react-native-paper";
import { Image } from "expo-image";
import { LoadingState } from "@/components/loading-state";
import { RepositoriesList } from "@/components/respository-details/repositories-list";
import { useUserRepositories } from "@/components/respository-details/hooks/use-user-repositories";

export default function RepositoryDetails() {
  const { userRepositories, isUserRepositoryFetching } = useUserRepositories();

  if (isUserRepositoryFetching) {
    return <LoadingState />;
  }

  return (
    <View style={styles.wrapper}>
      {userRepositories.length > 0 && (
        <View style={styles.headerWrapper}>
          <View style={styles.headerContent}>
            <Image
              source={userRepositories[0].owner.avatar_url}
              style={styles.headerImage}
              accessibilityLabel={`Avatar of ${userRepositories[0].owner.login}`}
            />
            <Text style={styles.headerText} accessibilityRole="header">
              {userRepositories[0].owner.login}
            </Text>
          </View>

          <RepositoriesList userRepositories={userRepositories} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: MD3DarkTheme.colors.backdrop,
    alignSelf: "stretch",
    flex: 1,
  },
  headerWrapper: {
    flex: 1,
  },
  headerImage: {
    width: 100,
    height: 100,
    marginRight: 20,
  },
  headerContent: {
    display: "flex",
    alignItems: "flex-start",
    padding: 20,
    flexDirection: "row",
  },
  headerText: {
    color: MD3DarkTheme.colors.onBackground,
    fontSize: 32,
  },
});
