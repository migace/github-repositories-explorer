import { IGithubUserDto } from "@/app/types/dto";
import { blurhash } from "@/constants/blurHash";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { List, MD3DarkTheme } from "react-native-paper";

interface IGithubUsersProps {
  users: Pick<IGithubUserDto, "id" | "login" | "avatar_url">[];
}

export const GithubUsers = ({ users }: IGithubUsersProps) => (
  <List.Section>
    {users.map((user) => (
      <Link
        href={{
          pathname: "/repository-details",
          params: {
            username: user.login,
          },
        }}
        key={user.id}
        asChild
      >
        <List.Item
          style={styles.listItem}
          title={user.login}
          left={() => (
            <Image
              source={user.avatar_url}
              contentFit="cover"
              transition={1000}
              style={styles.listItemImage}
              placeholder={{ blurhash }}
            />
          )}
          right={() => <List.Icon icon="chevron-right" />}
        />
      </Link>
    ))}
  </List.Section>
);

const styles = StyleSheet.create({
  listItem: {
    padding: 20,
    marginBottom: 10,
    backgroundColor: MD3DarkTheme.colors.background,
  },
  listItemImage: {
    height: 24,
    width: 24,
  },
});
