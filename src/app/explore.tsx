
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  Course,
  useMenu,
} from "@/context/menu-context";

const COURSES: Course[] = [
  "Starter",
  "Main Course",
  "Dessert",
];

export default function StatisticsScreen() {
  const {
    totalItems,
    averagePrice,
    courseCounts,
  } = useMenu();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.icon}>📊</Text>
        <View style={styles.headerText}>
          <Text style={styles.title}>
            Menu Statistics
          </Text>
          <Text style={styles.subtitle}>
            Overview of your restaurant menu
          </Text>
        </View>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            Total Menu Items
          </Text>
          <Text style={styles.summaryValue}>
            {totalItems}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>
            Average Price
          </Text>
          <Text style={styles.summaryValue}>
            R{averagePrice.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Items by Course
        </Text>
        <Text style={styles.sectionSubtitle}>
          Number of dishes in each category
        </Text>

        {COURSES.map((course) => {
          const count = courseCounts[course];

          const percentage =
            totalItems > 0
              ? (count / totalItems) * 100
              : 0;

          return (
            <View
              key={course}
              style={styles.courseSection}
            >
              <View style={styles.courseRow}>
                <Text style={styles.courseName}>
                  {course}
                </Text>
                <Text style={styles.courseCount}>
                  {count}
                </Text>
              </View>

              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${percentage}%` },
                  ]}
                />
              </View>

              <Text style={styles.percentage}>
                {percentage.toFixed(0)}% of menu
              </Text>
            </View>
          );
        })}
      </View>

      {totalItems === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🍴</Text>
          <Text style={styles.emptyTitle}>
            No menu data yet
          </Text>
          <Text style={styles.emptyText}>
            Add dishes on the Home screen to see
            your menu statistics.
          </Text>
        </View>
      )}

      <Text style={styles.footer}>
        Statistics update automatically when menu
        items are added, edited or deleted.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F4EF",
  },
  content: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 45,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
  },
  icon: {
    fontSize: 40,
    marginRight: 14,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    color: "#2D2A26",
  },
  subtitle: {
    fontSize: 13,
    color: "#77716A",
    marginTop: 4,
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5DED4",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#817B73",
    fontWeight: "600",
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: "800",
    color: "#2D2A26",
    marginTop: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5DED4",
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#2D2A26",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#817B73",
    marginTop: 5,
    marginBottom: 22,
  },
  courseSection: {
    marginBottom: 24,
  },
  courseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  courseName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#3A3631",
  },
  courseCount: {
    fontSize: 15,
    fontWeight: "800",
    color: "#2D2A26",
  },
  progressTrack: {
    height: 9,
    backgroundColor: "#EFEAE2",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8D7861",
    borderRadius: 10,
  },
  percentage: {
    fontSize: 12,
    color: "#817B73",
    marginTop: 7,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E5DED4",
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#3A3631",
  },
  emptyText: {
    fontSize: 13,
    color: "#817B73",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  footer: {
    fontSize: 12,
    color: "#817B73",
    textAlign: "center",
    marginTop: 24,
    lineHeight: 18,
  },
});
