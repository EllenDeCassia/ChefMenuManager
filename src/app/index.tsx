
import { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  useMenu,
  type Course,
  type MenuItem,
} from "@/context/menu-context";

type FormErrors = {
  dishName: string;
  description: string;
  course: string;
  price: string;
};

const COURSES: Course[] = [
  "Starter",
  "Main Course",
  "Dessert",
];

const EMPTY_ERRORS: FormErrors = {
  dishName: "",
  description: "",
  course: "",
  price: "",
};

export default function HomeScreen() {
  const scrollRef = useRef<ScrollView>(null);

  const {
    menuItems,
    addItem,
    updateItem,
    deleteItem,
  } = useMenu();

  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState<Course | "">("");
  const [price, setPrice] = useState("");

  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [errors, setErrors] = useState<FormErrors>({
    ...EMPTY_ERRORS,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] =
    useState<Course | "All">("All");

  // Reset the form after saving or cancelling.
  const resetForm = () => {
    setDishName("");
    setDescription("");
    setCourse("");
    setPrice("");
    setEditingId(null);
    setErrors({ ...EMPTY_ERRORS });
  };

  // Display feedback on mobile and web.
  const showMessage = (title: string, message: string) => {
    if (Platform.OS === "web") {
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  // Validate all form fields.
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      ...EMPTY_ERRORS,
    };

    if (!dishName.trim()) {
      newErrors.dishName = "Please enter a dish name.";
    }

    if (!description.trim()) {
      newErrors.description =
        "Please enter a description.";
    }

    if (!course) {
      newErrors.course = "Please select a course.";
    }

    const numericPrice = Number(price.trim());

    if (!price.trim()) {
      newErrors.price = "Please enter the price.";
    } else if (
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      newErrors.price =
        "Please enter a valid positive price.";
    }

    setErrors(newErrors);

    return Object.values(newErrors).every(
      (error) => error === ""
    );
  };

  // Add a new item or update an existing item.
  const saveMenuItem = () => {
    if (!validateForm() || !course) {
      return;
    }

    const itemData = {
      dishName: dishName.trim(),
      description: description.trim(),
      course: course as Course,
      price: Number(price.trim()).toFixed(2),
    };

    if (editingId !== null) {
      const updatedItem: MenuItem = {
        id: editingId,
        ...itemData,
      };

      updateItem(updatedItem);
      resetForm();

      showMessage(
        "Menu Item Updated",
        `${updatedItem.dishName} has been successfully updated.`
      );
    } else {
      const newItem: MenuItem = {
        id: `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 9)}`,
        ...itemData,
      };

      addItem(newItem);
      resetForm();

      showMessage(
        "Menu Item Added",
        `${newItem.dishName} has been successfully added to the menu.`
      );
    }
  };

  // Populate the form with an existing item.
  const editMenuItem = (item: MenuItem) => {
    setDishName(item.dishName);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(item.price);
    setEditingId(item.id);
    setErrors({ ...EMPTY_ERRORS });

    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  // Remove an item from shared menu state.
  const performDelete = (item: MenuItem) => {
    deleteItem(item.id);

    if (editingId === item.id) {
      resetForm();
    }

    showMessage(
      "Menu Item Deleted",
      `${item.dishName} has been removed from the menu.`
    );
  };

  // Ask for confirmation before deleting.
  const deleteMenuItem = (item: MenuItem) => {
    const message =
      `Are you sure you want to delete "${item.dishName}"?`;

    if (Platform.OS === "web") {
      if (window.confirm(message)) {
        performDelete(item);
      }
      return;
    }

    Alert.alert("Delete Menu Item", message, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => performDelete(item),
      },
    ]);
  };

  // Search by dish name and filter by course.
  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.dishName
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());

    const matchesCourse =
      selectedFilter === "All" ||
      item.course === selectedFilter;

    return matchesSearch && matchesCourse;
  });

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedFilter("All");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios" ? "padding" : undefined
      }
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🍽️</Text>

          <View style={styles.headerText}>
            <Text style={styles.title}>
              Chef's Menu Manager
            </Text>

            <Text style={styles.subtitle}>
              Create and manage your restaurant menu
            </Text>
          </View>
        </View>

        {/* Add and Edit Form */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {editingId !== null
              ? "Edit Menu Item"
              : "Add Menu Item"}
          </Text>

          <Text style={styles.sectionSubtitle}>
            {editingId !== null
              ? "Update the dish details and save your changes."
              : "Enter the details of a new dish below."}
          </Text>

          <Text style={styles.label}>
            Dish Name
          </Text>

          <TextInput
            style={[
              styles.input,
              errors.dishName
                ? styles.inputError
                : null,
            ]}
            placeholder="e.g. Grilled Chicken"
            placeholderTextColor="#999"
            value={dishName}
            onChangeText={setDishName}
          />

          {errors.dishName ? (
            <Text style={styles.errorText}>
              {errors.dishName}
            </Text>
          ) : null}

          <Text style={styles.label}>
            Description
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.descriptionInput,
              errors.description
                ? styles.inputError
                : null,
            ]}
            placeholder="Describe the dish..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          {errors.description ? (
            <Text style={styles.errorText}>
              {errors.description}
            </Text>
          ) : null}

          {/* Course Selection */}
          <Text style={styles.label}>
            Course
          </Text>

          <View style={styles.courseOptions}>
            {COURSES.map((option) => (
              <Pressable
                key={option}
                style={[
                  styles.courseOption,
                  course === option &&
                    styles.courseOptionSelected,
                ]}
                onPress={() => setCourse(option)}
              >
                <Text
                  style={[
                    styles.courseOptionText,
                    course === option &&
                      styles.courseOptionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>

          {errors.course ? (
            <Text style={styles.errorText}>
              {errors.course}
            </Text>
          ) : null}

          {/* Price */}
          <Text style={styles.label}>
            Price
          </Text>

          <View
            style={[
              styles.priceContainer,
              errors.price
                ? styles.inputError
                : null,
            ]}
          >
            <Text style={styles.currency}>
              R
            </Text>

            <TextInput
              style={styles.priceInput}
              placeholder="0.00"
              placeholderTextColor="#999"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
          </View>

          {errors.price ? (
            <Text style={styles.errorText}>
              {errors.price}
            </Text>
          ) : null}

          {/* Save Button */}
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={saveMenuItem}
          >
            <Text style={styles.addButtonText}>
              {editingId !== null
                ? "Save Changes"
                : "+ Add Menu Item"}
            </Text>
          </Pressable>

          {editingId !== null && (
            <Pressable
              style={styles.cancelButton}
              onPress={resetForm}
            >
              <Text style={styles.cancelButtonText}>
                Cancel Editing
              </Text>
            </Pressable>
          )}
        </View>

        {/* Search and Filter */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Search & Filter
          </Text>

          <Text style={styles.sectionSubtitle}>
            Find dishes by name or course.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Search dishes by name..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            accessibilityLabel="Search dishes by name"
          />

          <Text style={styles.label}>
            Filter by Course
          </Text>

          <View style={styles.courseOptions}>
            {(["All", ...COURSES] as const).map(
              (option) => (
                <Pressable
                  key={option}
                  style={[
                    styles.courseOption,
                    selectedFilter === option &&
                      styles.courseOptionSelected,
                  ]}
                  onPress={() =>
                    setSelectedFilter(option)
                  }
                >
                  <Text
                    style={[
                      styles.courseOptionText,
                      selectedFilter === option &&
                        styles.courseOptionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              )
            )}
          </View>

          <Pressable
            style={styles.clearButton}
            onPress={clearFilters}
          >
            <Text style={styles.clearButtonText}>
              Clear Search & Filters
            </Text>
          </Pressable>
        </View>

        {/* Current Menu */}
        <View style={styles.menuSection}>
          <View style={styles.menuHeader}>
            <View style={styles.headerText}>
              <Text style={styles.sectionTitle}>
                Current Menu
              </Text>

              <Text style={styles.sectionSubtitle}>
                {filteredMenuItems.length} of{" "}
                {menuItems.length} menu items shown
              </Text>
            </View>

            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {filteredMenuItems.length}
              </Text>
            </View>
          </View>

          {menuItems.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>
                🍴
              </Text>

              <Text style={styles.emptyTitle}>
                Your menu is empty
              </Text>

              <Text style={styles.emptyText}>
                Add your first menu item using
                the form above.
              </Text>
            </View>
          ) : filteredMenuItems.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>
                🔎
              </Text>

              <Text style={styles.emptyTitle}>
                No matching dishes
              </Text>

              <Text style={styles.emptyText}>
                Try a different search or
                clear the filters.
              </Text>

              <Pressable
                style={styles.clearButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearButtonText}>
                  Show All Dishes
                </Text>
              </Pressable>
            </View>
          ) : (
            filteredMenuItems.map((item, index) => (
              <View
                style={styles.menuItem}
                key={item.id}
              >
                <View style={styles.itemTopRow}>
                  <View style={styles.itemNumber}>
                    <Text
                      style={styles.itemNumberText}
                    >
                      {index + 1}
                    </Text>
                  </View>

                  <View
                    style={styles.itemTitleContainer}
                  >
                    <Text style={styles.dishName}>
                      {item.dishName}
                    </Text>

                    <Text style={styles.courseText}>
                      {item.course}
                    </Text>
                  </View>

                  <Text style={styles.price}>
                    R{Number(item.price).toFixed(2)}
                  </Text>
                </View>

                <Text style={styles.description}>
                  {item.description}
                </Text>

                <View style={styles.actionRow}>
                  <Pressable
                    style={styles.editButton}
                    onPress={() =>
                      editMenuItem(item)
                    }
                  >
                    <Text
                      style={styles.editButtonText}
                    >
                      ✎ Edit
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.deleteButton}
                    onPress={() =>
                      deleteMenuItem(item)
                    }
                  >
                    <Text
                      style={styles.deleteButtonText}
                    >
                      Delete
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F4EF",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  headerText: {
    flex: 1,
  },
  logo: {
    fontSize: 42,
    marginRight: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2D2A26",
  },
  subtitle: {
    fontSize: 13,
    color: "#77716A",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3A3631",
    marginBottom: 7,
    marginTop: 12,
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#D9D3CA",
    borderRadius: 11,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#2D2A26",
    backgroundColor: "#FCFBF9",
  },
  descriptionInput: {
    height: 100,
    paddingTop: 14,
  },
  inputError: {
    borderColor: "#C94C4C",
  },
  errorText: {
    color: "#C94C4C",
    fontSize: 12,
    marginTop: 5,
  },
  courseOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  courseOption: {
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D9D3CA",
    backgroundColor: "#FCFBF9",
  },
  courseOptionSelected: {
    backgroundColor: "#2D2A26",
    borderColor: "#2D2A26",
  },
  courseOptionText: {
    color: "#5B554D",
    fontWeight: "600",
    fontSize: 13,
  },
  courseOptionTextSelected: {
    color: "#FFFFFF",
  },
  priceContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D9D3CA",
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FCFBF9",
  },
  currency: {
    fontSize: 16,
    fontWeight: "700",
    color: "#5B554D",
    marginLeft: 14,
  },
  priceInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    fontSize: 15,
    color: "#2D2A26",
  },
  addButton: {
    backgroundColor: "#2D2A26",
    height: 54,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  buttonPressed: {
    opacity: 0.75,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#817B73",
    fontWeight: "700",
  },
  clearButton: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    marginTop: 12,
  },
  clearButtonText: {
    color: "#65574A",
    fontWeight: "800",
    textDecorationLine: "underline",
  },
  menuSection: {
    marginBottom: 20,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  countBadge: {
    minWidth: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2D2A26",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  countText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 30,
    alignItems: "center",
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#E5DED4",
  },
  emptyIcon: {
    fontSize: 45,
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
    marginTop: 7,
    lineHeight: 20,
  },
  menuItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5DED4",
  },
  itemTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EFEAE2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  itemNumberText: {
    fontWeight: "800",
    color: "#4B453D",
  },
  itemTitleContainer: {
    flex: 1,
  },
  dishName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2D2A26",
  },
  courseText: {
    fontSize: 12,
    color: "#817B73",
    marginTop: 3,
  },
  price: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2D2A26",
    marginLeft: 8,
  },
  description: {
    fontSize: 13,
    color: "#69635B",
    lineHeight: 20,
    marginTop: 14,
    marginLeft: 47,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    marginLeft: 47,
  },
  editButton: {
    flex: 1,
    backgroundColor: "#EFEAE2",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  editButtonText: {
    color: "#2D2A26",
    fontWeight: "700",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#FCE8E8",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#B42323",
    fontWeight: "700",
  },
});
