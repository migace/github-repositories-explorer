import { memo, useMemo } from "react";
import { GithubUserDto } from "@/types/dto";
import { blurhash } from "@/constants/blurHash";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface GithubUsersProps {
  users: Pick<GithubUserDto, "id" | "login" | "avatar_url">[];
}

type UserItem = Pick<GithubUserDto, "id" | "login" | "avatar_url">;

const UserListItem = memo(({ user }: { user: UserItem }) => {
  const { colors } = useTheme();

  const dynamicStyles = useMemo(
    () => ({
      card: {
        backgroundColor: colors.surface,
        borderColor: colors.outline,
      },
      name: { color: colors.onSurface, fontWeight: "600" } as const,
      url: { color: colors.onSurfaceVariant },
    }),
    [colors],
  );

  return (
    <Link
      href={{
        pathname: "/repository-details",
        params: { username: user.login },
      }}
      asChild
    >
      <Pressable
        style={({ pressed }) => [
          styles.card,
          dynamicStyles.card,
          pressed && styles.pressed,
        ]}
      >
        <Image
          source={user.avatar_url}
          contentFit="cover"
          transition={500}
          style={styles.avatar}
          placeholder={{ blurhash }}
        />
        <View style={styles.info}>
          <Text variant="titleMedium" style={dynamicStyles.name}>
            {user.login}
          </Text>
          <Text variant="bodySmall" style={dynamicStyles.url}>
            github.com/{user.login}
          </Text>
        </View>
        <MaterialCommunityIcons
          name="chevron-right"
          size={22}
          color={colors.onSurfaceVariant}
        />
      </Pressable>
    </Link>
  );
});

UserListItem.displayName = "UserListItem";

export const GithubUsers = memo(({ users }: GithubUsersProps) => (
  <FlashList
    data={users}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => <UserListItem user={item} />}
    contentContainerStyle={styles.list}
    showsVerticalScrollIndicator={false}
    estimatedItemSize={72}
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
  pressed: {
    opacity: 0.7,
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
