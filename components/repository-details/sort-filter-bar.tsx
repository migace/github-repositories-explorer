import { memo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, Menu, Text, useTheme } from "react-native-paper";
import { type SortOption, SORT_LABELS } from "./hooks/use-sort-filter";

interface ISortFilterBarProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  languageFilter: string | null;
  onLanguageChange: (lang: string | null) => void;
  availableLanguages: string[];
  totalCount: number;
  filteredCount: number;
}

export const SortFilterBar = memo(
  ({
    sort,
    onSortChange,
    languageFilter,
    onLanguageChange,
    availableLanguages,
    totalCount,
    filteredCount,
  }: ISortFilterBarProps) => {
    const { colors } = useTheme();
    const [sortMenuVisible, setSortMenuVisible] = useState(false);

    return (
      <View
        style={[styles.container, { borderBottomColor: colors.outlineVariant }]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          <Menu
            visible={sortMenuVisible}
            onDismiss={() => setSortMenuVisible(false)}
            anchor={
              <Chip
                icon="sort"
                onPress={() => setSortMenuVisible(true)}
                selected
                style={styles.chip}
                compact
              >
                {SORT_LABELS[sort]}
              </Chip>
            }
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((option) => (
              <Menu.Item
                key={option}
                title={SORT_LABELS[option]}
                leadingIcon={sort === option ? "check" : undefined}
                onPress={() => {
                  onSortChange(option);
                  setSortMenuVisible(false);
                }}
              />
            ))}
          </Menu>

          <Chip
            icon="filter-off"
            onPress={() => onLanguageChange(null)}
            selected={languageFilter === null}
            style={styles.chip}
            compact
          >
            All
          </Chip>

          {availableLanguages.map((lang) => (
            <Chip
              key={lang}
              onPress={() =>
                onLanguageChange(languageFilter === lang ? null : lang)
              }
              selected={languageFilter === lang}
              style={styles.chip}
              compact
            >
              {lang}
            </Chip>
          ))}
        </ScrollView>

        {languageFilter && (
          <Text
            variant="labelSmall"
            style={[styles.count, { color: colors.onSurfaceVariant }]}
          >
            {filteredCount} / {totalCount} repos
          </Text>
        )}
      </View>
    );
  },
);

SortFilterBar.displayName = "SortFilterBar";

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  chip: { height: 32 },
  count: {
    textAlign: "right",
    paddingHorizontal: 12,
    paddingBottom: 4,
  },
});
