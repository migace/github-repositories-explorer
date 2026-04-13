import { Linking, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Chip, Divider, Text, useTheme } from "react-native-paper";
import { Image } from "expo-image";
import { useLocalSearchParams, Stack } from "expo-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { githubService } from "@/app/services/GithubService";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  value: string | number;
  label: string;
}) => {
  const { colors } = useTheme();
  const cardStyle = useMemo(
    () => ({
      card: [
        styles.statCard,
        { backgroundColor: colors.surfaceVariant, borderColor: colors.outline },
      ],
      value: { color: colors.onSurface, fontWeight: "700" } as const,
      label: { color: colors.onSurfaceVariant } as const,
    }),
    [colors],
  );

  return (
    <View style={cardStyle.card}>
      <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
      <Text variant="titleMedium" style={cardStyle.value}>
        {typeof value === "number" ? value.toLocaleString() : value}
      </Text>
      <Text variant="labelSmall" style={cardStyle.label}>
        {label}
      </Text>
    </View>
  );
};

export default function RepoDetails() {
  const params = useLocalSearchParams<{ username: string; repo: string }>();
  const username = Array.isArray(params.username)
    ? params.username[0]
    : (params.username ?? "");
  const repo = Array.isArray(params.repo)
    ? params.repo[0]
    : (params.repo ?? "");
  const { colors } = useTheme();

  const dynamicStyles = useMemo(
    () => ({
      container: { backgroundColor: colors.background },
      headerCard: {
        backgroundColor: colors.surface,
        borderColor: colors.outline,
      },
      titleText: { color: colors.onSurface, fontWeight: "700" } as const,
      subtitleText: { color: colors.onSurfaceVariant },
      descriptionText: { color: colors.onBackground },
      sectionLabel: { color: colors.onSurfaceVariant },
      topicChip: { backgroundColor: colors.primaryContainer },
      topicText: { color: colors.onPrimaryContainer, fontSize: 12 },
      datesCard: {
        backgroundColor: colors.surfaceVariant,
        borderColor: colors.outline,
      },
      dateText: { color: colors.onSurfaceVariant },
      dateBold: { color: colors.onSurface, fontWeight: "600" } as const,
      githubButton: { backgroundColor: colors.primary },
      githubButtonText: { color: colors.onPrimary, fontWeight: "600" } as const,
    }),
    [colors],
  );

  const {
    data: repository,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["repo", username, repo],
    queryFn: ({ signal }) =>
      githubService.getRepositoryByName(username, repo, signal),
    enabled: !!username && !!repo,
  });

  if (isLoading) return <LoadingState />;
  if (isError || !repository)
    return <ErrorState message="Failed to load repository details." />;

  return (
    <>
      <Stack.Screen options={{ title: repository.name }} />
      <ScrollView
        style={[styles.container, dynamicStyles.container]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.headerCard, dynamicStyles.headerCard]}>
          <Image
            source={repository.owner.avatar_url}
            style={styles.avatar}
            accessibilityLabel={`Avatar of ${repository.owner.login}`}
          />
          <View style={styles.headerText}>
            <Text variant="titleLarge" style={dynamicStyles.titleText}>
              {repository.name}
            </Text>
            <Text variant="bodyMedium" style={dynamicStyles.subtitleText}>
              {repository.owner.login}
            </Text>
          </View>
        </View>

        {repository.description ? (
          <Text
            variant="bodyMedium"
            style={[styles.description, dynamicStyles.descriptionText]}
          >
            {repository.description}
          </Text>
        ) : null}

        <View style={styles.statsGrid}>
          <StatCard
            icon="star-outline"
            value={repository.stargazers_count}
            label="Stars"
          />
          <StatCard
            icon="source-fork"
            value={repository.forks_count}
            label="Forks"
          />
          <StatCard
            icon="bug-outline"
            value={repository.open_issues_count}
            label="Issues"
          />
          {repository.language ? (
            <StatCard
              icon="code-tags"
              value={repository.language}
              label="Language"
            />
          ) : null}
        </View>

        {repository.topics.length > 0 ? (
          <View style={styles.section}>
            <Text
              variant="labelMedium"
              style={[styles.sectionLabel, dynamicStyles.sectionLabel]}
            >
              TOPICS
            </Text>
            <View style={styles.topics}>
              {repository.topics.map((topic) => (
                <Chip
                  key={topic}
                  compact
                  style={[styles.topicChip, dynamicStyles.topicChip]}
                  textStyle={dynamicStyles.topicText}
                >
                  {topic}
                </Chip>
              ))}
            </View>
          </View>
        ) : null}

        <View style={[styles.datesCard, dynamicStyles.datesCard]}>
          <View style={styles.dateRow}>
            <MaterialCommunityIcons
              name="calendar-plus"
              size={16}
              color={colors.onSurfaceVariant}
            />
            <Text variant="bodySmall" style={dynamicStyles.dateText}>
              Created{" "}
              <Text style={dynamicStyles.dateBold}>
                {new Date(repository.created_at).toLocaleDateString()}
              </Text>
            </Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.dateRow}>
            <MaterialCommunityIcons
              name="calendar-sync"
              size={16}
              color={colors.onSurfaceVariant}
            />
            <Text variant="bodySmall" style={dynamicStyles.dateText}>
              Updated{" "}
              <Text style={dynamicStyles.dateBold}>
                {new Date(repository.updated_at).toLocaleDateString()}
              </Text>
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.githubButton,
            dynamicStyles.githubButton,
            pressed && styles.pressed,
          ]}
          onPress={() => Linking.openURL(repository.html_url)}
        >
          <MaterialCommunityIcons
            name="github"
            size={20}
            color={colors.onPrimary}
          />
          <Text variant="labelLarge" style={dynamicStyles.githubButtonText}>
            View on GitHub
          </Text>
        </Pressable>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 14 },
  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  headerText: { flex: 1, gap: 2 },
  description: { lineHeight: 22 },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: "44%",
    alignItems: "center",
    padding: 14,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    letterSpacing: 0.8,
    fontWeight: "600",
  },
  topics: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  topicChip: { height: 28 },
  datesCard: {
    padding: 14,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  divider: {
    marginVertical: 8,
  },
  githubButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 4,
  },
  pressed: {
    opacity: 0.8,
  },
});
