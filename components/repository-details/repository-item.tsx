import { memo, useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface RepositoryItemProps {
  name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  username: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Dart: "#00B4AB",
  Shell: "#89e051",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Vue: "#41b883",
};

const LanguageDot = ({ language }: { language: string }) => {
  const color = LANGUAGE_COLORS[language] ?? "#8b949e";
  return (
    <View style={[styles.langDot, { backgroundColor: color }]} />
  );
};

export const RepositoryItem = memo(
  ({ name, description, stargazers_count, language, username }: RepositoryItemProps) => {
    const { colors } = useTheme();

    const dynamicStyles = useMemo(
      () => ({
        card: { backgroundColor: colors.surface, borderColor: colors.outline },
        name: { color: colors.primary },
        description: { color: colors.onSurfaceVariant },
        meta: { color: colors.onSurfaceVariant },
      }),
      [colors],
    );

    return (
      <Link
        href={{
          pathname: "/repository-detail",
          params: { username, repo: name },
        }}
        asChild
      >
        <Pressable
          testID="repository-item"
          style={({ pressed }) => [
            styles.card,
            dynamicStyles.card,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.top}>
            <MaterialCommunityIcons
              name="book-outline"
              size={16}
              color={colors.primary}
              style={styles.bookIcon}
            />
            <Text
              variant="titleSmall"
              style={[styles.name, dynamicStyles.name]}
              numberOfLines={1}
            >
              {name}
            </Text>
          </View>

          {description ? (
            <Text
              variant="bodySmall"
              style={[styles.description, dynamicStyles.description]}
              numberOfLines={2}
            >
              {description}
            </Text>
          ) : null}

          <View style={styles.meta}>
            {language ? (
              <View style={styles.metaItem}>
                <LanguageDot language={language} />
                <Text variant="labelSmall" style={dynamicStyles.meta}>
                  {language}
                </Text>
              </View>
            ) : null}
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="star-outline" size={14} color={colors.onSurfaceVariant} />
              <Text variant="labelSmall" style={dynamicStyles.meta}>
                {stargazers_count.toLocaleString()}
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>
    );
  },
);

RepositoryItem.displayName = "RepositoryItem";

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  pressed: {
    opacity: 0.7,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bookIcon: {
    marginTop: 1,
  },
  name: {
    fontWeight: "600",
    flex: 1,
  },
  description: {
    lineHeight: 18,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  langDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
