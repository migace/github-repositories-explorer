import { memo, useMemo } from "react";
import { GithubUserDto } from "@/types/dto";
import { blurhash } from "@/constants/blurHash";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Text, useTheme } from "react-native-paper";

interface GithubUsersProps {
  users: Pick<GithubUserDto, "id" | "login" | "avatar_url">[];
}

type UserItem = Pick<GithubUserDto, "id" | "login" | "avatar_url">;

const UserListItem = memo(({ user }: { user: UserItem }) => {
  const { colors, dark } = useTheme();

  const dynamicStyles = useMemo(
    () => ({
      card: {
        backgroundColor: colors.elevation.level2,
        ...(Platform.OS === "ios"
          ? {
              shadowColor: dark ? "#000" : "#666",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: dark ? 0.3 : 0.08,
              shadowRadius: 4,
            }
          : { elevation: 2 }),
      },
      name: { color: colors.onSurface },
      separator: { color: colors.onSurfaceVariant },
      url: { color: colors.onSurfaceVariant },
    }),
    [colors, dark],
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
        accessibilityRole="button"
        accessibilityLabel={`${user.login}`}
        accessibilityHint="Opens user repositories"
        style={({ pressed }) => [
          styles.card,
          dynamicStyles.card,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.cardContent}>
          <Image
            source={user.avatar_url}
            contentFit="cover"
            transition={500}
            style={styles.avatar}
            placeholder={{ blurhash }}
          />
          <View style={styles.textContainer}>
            <Text
              variant="titleSmall"
              style={[styles.name, dynamicStyles.name]}
              numberOfLines={1}
            >
              {user.login}
            </Text>
            <Text
              variant="bodySmall"
              style={[styles.url, dynamicStyles.url]}
              numberOfLines={1}
            >
              github.com/{user.login}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
});

UserListItem.displayName = "UserListItem";

const Separator = () => <View style={styles.separator} />;

export const GithubUsers = memo(({ users }: GithubUsersProps) => (
  <FlashList
    data={users}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => <UserListItem user={item} />}
    contentContainerStyle={styles.list}
    showsVerticalScrollIndicator={false}
    ItemSeparatorComponent={Separator}
  />
));

GithubUsers.displayName = "GithubUsers";

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  separator: {
    height: 24,
  },
  card: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 32,
  },
  textContainer: {
    flex: 1,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  avatar: {
    height: 48,
    width: 48,
    borderRadius: 24,
  },
  name: {
    fontWeight: "700",
    flexShrink: 0,
  },
  url: {
    flexShrink: 1,
  },
});
