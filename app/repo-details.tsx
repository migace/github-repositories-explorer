import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Chip, Divider, Text, useTheme } from "react-native-paper";
import { Image } from "expo-image";
import { useLocalSearchParams, Stack } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { githubService } from "@/app/services/GithubService";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface IRouteParams {
  username: string;
  repo: string;
}

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
  return (
    <View
      style={[
        styles.statCard,
        { backgroundColor: colors.surfaceVariant, borderColor: colors.outline },
      ]}
    >
      <MaterialCommunityIcons name={icon} size={20} color={colors.primary} />
      <Text
        variant="titleMedium"
        style={{ color: colors.onSurface, fontWeight: "700" }}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </Text>
      <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
        {label}
      </Text>
    </View>
  );
};

export default function RepoDetails() {
  const { username, repo } = useLocalSearchParams() as unknown as IRouteParams;
  const { colors } = useTheme();

  const {
    data: repository,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["repo", username, repo],
    queryFn: () => githubService.getRepositoryByName(username, repo),
    enabled: !!username && !!repo,
  });

  if (isLoading) return <LoadingState />;
  if (isError || !repository)
    return <ErrorState message="Failed to load repository details." />;

  return (
    <>
      <Stack.Screen options={{ title: repository.name }} />
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.headerCard,
            { backgroundColor: colors.surface, borderColor: colors.outline },
          ]}
        >
          <Image
            source={repository.owner.avatar_url}
            style={styles.avatar}
            accessibilityLabel={`Avatar of ${repository.owner.login}`}
          />
          <View style={styles.headerText}>
            <Text
              variant="titleLarge"
              style={{ color: colors.onSurface, fontWeight: "700" }}
            >
              {repository.name}
            </Text>
            <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
              {repository.owner.login}
            </Text>
          </View>
        </View>

        {repository.description ? (
          <Text
            variant="bodyMedium"
            style={[styles.description, { color: colors.onBackground }]}
          >
            {repository.description}
          </Text>
        ) : null}

        <View style={styles.statsGrid}>
          <StatCard icon="star-outline" value={repository.stargazers_count} label="Stars" />
          <StatCard icon="source-fork" value={repository.forks_count} label="Forks" />
          <StatCard icon="bug-outline" value={repository.open_issues_count} label="Issues" />
          {repository.language ? (
            <StatCard icon="code-tags" value={repository.language} label="Language" />
          ) : null}
        </View>

        {repository.topics.length > 0 ? (
          <View style={styles.section}>
            <Text
              variant="labelMedium"
              style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}
            >
              TOPICS
            </Text>
            <View style={styles.topics}>
              {repository.topics.map((topic) => (
                <Chip
                  key={topic}
                  compact
                  style={[
                    styles.topicChip,
                    { backgroundColor: colors.primaryContainer },
                  ]}
                  textStyle={{ color: colors.onPrimaryContainer, fontSize: 12 }}
                >
                  {topic}
                </Chip>
              ))}
            </View>
          </View>
        ) : null}

        <View
          style={[
            styles.datesCard,
            { backgroundColor: colors.surfaceVariant, borderColor: colors.outline },
          ]}
        >
          <View style={styles.dateRow}>
            <MaterialCommunityIcons name="calendar-plus" size={16} color={colors.onSurfaceVariant} />
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
              Created{" "}
              <Text style={{ color: colors.onSurface, fontWeight: "600" }}>
                {new Date(repository.created_at).toLocaleDateString()}
              </Text>
            </Text>
          </View>
          <Divider style={{ marginVertical: 8 }} />
          <View style={styles.dateRow}>
            <MaterialCommunityIcons name="calendar-sync" size={16} color={colors.onSurfaceVariant} />
            <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
              Updated{" "}
              <Text style={{ color: colors.onSurface, fontWeight: "600" }}>
                {new Date(repository.updated_at).toLocaleDateString()}
              </Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.githubButton, { backgroundColor: colors.primary }]}
          onPress={() => Linking.openURL(repository.html_url)}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="github" size={20} color={colors.onPrimary} />
          <Text
            variant="labelLarge"
            style={{ color: colors.onPrimary, fontWeight: "600" }}
          >
            View on GitHub
          </Text>
        </TouchableOpacity>
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
  githubButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 4,
  },
});
