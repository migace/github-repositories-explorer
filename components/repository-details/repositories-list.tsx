import { ScrollView, StyleSheet } from "react-native";
import { RepositoryItem } from "./repository-item";
import { List } from "react-native-paper";

interface IRepositoriesListProps {
  userRepositories: {
    id: number;
    name: string;
    description: string | null;
    stargazers_count: number;
  }[];
}

export const RepositoriesList = ({
  userRepositories,
}: IRepositoriesListProps) => (
  <ScrollView style={styles.wrapper}>
    <List.Section accessible accessibilityLabel="List of user repositories">
      {userRepositories.length > 0 ? (
        userRepositories.map((userRepository) => (
          <RepositoryItem
            key={userRepository.id}
            name={userRepository.name}
            description={userRepository.description || ""}
            stargazers_count={userRepository.stargazers_count}
          />
        ))
      ) : (
        <List.Subheader>No repositories available</List.Subheader>
      )}
    </List.Section>
  </ScrollView>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 20,
  },
});
