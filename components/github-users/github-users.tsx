import { memo } from "react";
import { IGithubUserDto } from "@/app/types/dto";
import { blurhash } from "@/constants/blurHash";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface IGithubUsersProps {
  users: Pick<IGithubUserDto, "id" | "login" | "avatar_url">[];
}

type UserItem = Pick<IGithubUserDto, "id" | "login" | "avatar_url">;

const UserListItem = memo(({ user }: { user: UserItem }) => {
  const { colors } = useTheme();

  return (
    <Link
      href={{
        pathname: "/repository-details",
        params: { username: user.login },
      }}
      asChild
    >
      <TouchableOpacity
        style={StyleSheet.flatten([
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.outline,
          },
        ])}
        activeOpacity={0.7}
      >
        <Image
          source={user.avatar_url}
          contentFit="cover"
          transition={500}
          style={styles.avatar}
          placeholder={{ blurhash }}
        />
        <View style={styles.info}>
          <Text
            variant="titleMedium"
            style={{ color: colors.onSurface, fontWeight: "600" }}
          >
            {user.login}
          </Text>
          <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
            github.com/{user.login}
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color={colors.onSurfaceVariant}
        />
      </TouchableOpacity>
    </Link>
  );
});

UserListItem.displayName = "UserListItem";

export const GithubUsers = memo(({ users }: IGithubUsersProps) => (
  <FlatList
    data={users}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => <UserListItem user={item} />}
    contentContainerStyle={styles.list}
    showsVerticalScrollIndicator={false}
  />
));

GithubUsers.displayName = "GithubUsers";

const styles = StyleSheet.create({
  list: {
    padding: 16,
    gap: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  info: {
    flex: 1,
    gap: 2,
  },
});
