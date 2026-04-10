import { memo, useCallback } from "react";
import { IGithubUserDto } from "@/app/types/dto";
import { blurhash } from "@/constants/blurHash";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { List, useTheme } from "react-native-paper";

interface IGithubUsersProps {
  users: Pick<IGithubUserDto, "id" | "login" | "avatar_url">[];
}

type UserItem = Pick<IGithubUserDto, "id" | "login" | "avatar_url">;

const UserAvatar = ({ uri }: { uri: string }) => (
  <Image
    source={uri}
    contentFit="cover"
    transition={1000}
    style={styles.listItemImage}
    placeholder={{ blurhash }}
  />
);

const ChevronRight = () => <List.Icon icon="chevron-right" />;

const UserListItem = memo(({ user }: { user: UserItem }) => {
  const { colors } = useTheme();
  const renderLeft = useCallback(() => <UserAvatar uri={user.avatar_url} />, [user.avatar_url]);

  return (
    <Link
      href={{
        pathname: "/repository-details",
        params: { username: user.login },
      }}
      asChild
    >
      <List.Item
        style={StyleSheet.flatten([styles.listItem, { backgroundColor: colors.surface }])}
        title={user.login}
        left={renderLeft}
        right={ChevronRight}
      />
    </Link>
  );
});

UserListItem.displayName = "UserListItem";

export const GithubUsers = memo(({ users }: IGithubUsersProps) => (
  <List.Section>
    {users.map((user) => (
      <UserListItem key={user.id} user={user} />
    ))}
  </List.Section>
));

GithubUsers.displayName = "GithubUsers";

const styles = StyleSheet.create({
  listItem: {
    padding: 20,
    marginBottom: 10,
  },
  listItemImage: {
    height: 24,
    width: 24,
  },
});
