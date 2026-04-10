import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, Divider, Text, useTheme } from "react-native-paper";
import { Image } from "expo-image";
import { useLocalSearchParams, Stack } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { githubService } from "@/app/services/GithubService";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { Linking } from "react-native";

interface IRouteParams {
  username: string;
  repo: string;
}

const StatItem = ({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string | number;
  label: string;
}) => {
  const { colors } = useTheme();
  return (
    <View style={styles.statItem}>
      <Text style={[styles.statValue, { color: colors.primary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.onSurfaceVariant }]}>
        {icon} {label}
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
      >
        <View style={styles.header}>
          <Image
            source={repository.owner.avatar_url}
            style={styles.avatar}
            accessibilityLabel={`Avatar of ${repository.owner.login}`}
          />
          <View style={styles.headerText}>
            <Text variant="titleLarge" style={{ color: colors.onBackground }}>
              {repository.name}
            </Text>
            <Text
              variant="bodyMedium"
              style={{ color: colors.onSurfaceVariant }}
            >
              {repository.owner.login}
            </Text>
          </View>
        </View>

        {repository.description && (
          <Text
            variant="bodyLarge"
            style={[styles.description, { color: colors.onBackground }]}
          >
            {repository.description}
          </Text>
        )}

        <Divider style={styles.divider} />

        <View style={styles.statsRow}>
          <StatItem icon="⭐" value={repository.stargazers_count} label="Stars" />
          <StatItem icon="🍴" value={repository.forks_count} label="Forks" />
          <StatItem
            icon="🐛"
            value={repository.open_issues_count}
            label="Issues"
          />
          {repository.language && (
            <StatItem icon="💻" value={repository.language} label="Language" />
          )}
        </View>

        {repository.topics.length > 0 && (
          <>
            <Divider style={styles.divider} />
            <Text
              variant="labelLarge"
              style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}
            >
              Topics
            </Text>
            <View style={styles.topics}>
              {repository.topics.map((topic) => (
                <Chip key={topic} style={styles.chip} compact>
                  {topic}
                </Chip>
              ))}
            </View>
          </>
        )}

        <Divider style={styles.divider} />

        <Text
          variant="labelLarge"
          style={[styles.sectionLabel, { color: colors.onSurfaceVariant }]}
        >
          Dates
        </Text>
        <Text style={{ color: colors.onBackground }}>
          Created: {new Date(repository.created_at).toLocaleDateString()}
        </Text>
        <Text style={{ color: colors.onBackground }}>
          Updated: {new Date(repository.updated_at).toLocaleDateString()}
        </Text>

        <Divider style={styles.divider} />

        <Chip
          icon="github"
          onPress={() => Linking.openURL(repository.html_url)}
          style={styles.githubChip}
        >
          View on GitHub
        </Chip>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, gap: 12 },
  header: { flexDirection: "row", alignItems: "center", gap: 16 },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  headerText: { flex: 1 },
  description: { lineHeight: 22 },
  divider: { marginVertical: 8 },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-around",
  },
  statItem: { alignItems: "center", minWidth: 64 },
  statValue: { fontSize: 20, fontWeight: "bold" },
  statLabel: { fontSize: 12, marginTop: 2 },
  sectionLabel: { marginBottom: 8 },
  topics: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: { alignSelf: "flex-start" },
  githubChip: { alignSelf: "center", marginTop: 8 },
});
