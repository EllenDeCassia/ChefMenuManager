import React, { useState } from "react";
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

type MenuItem = {
  id: string;
  dishName: string;
  description: string;
  course: string;
  price: string;
};

export default function HomeScreen() {
  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("");
  const [price, setPrice] = useState("");

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const [errors, setErrors] = useState({
    dishName: "",
    description: "",
    course: "",
    price: "",
  });

  const validateForm = () => {
    let valid = true;

    const newErrors = {
      dishName: "",
      description: "",
      course: "",
      price: "",
    };

    if (!dishName.trim()) {
      newErrors.dishName = "Please enter a dish name.";
      valid = false;
    }

    if (!description.trim()) {
      newErrors.description = "Please enter a description.";
      valid = false;
    }

    if (!course.trim()) {
      newErrors.course = "Please enter the course.";
      valid = false;
    }

    if (!price.trim()) {
      newErrors.price = "Please enter the price.";
      valid = false;
    } else if (isNaN(Number(price)) || Number(price) <= 0) {
      newErrors.price = "Please enter a valid price.";
      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  const addMenuItem = () => {
    if (!validateForm()) {
      return;
    }

    const newItem: MenuItem = {
      id: Date.now().toString(),
      dishName: dishName.trim(),
      description: description.trim(),
      course: course.trim(),
      price: price.trim(),
    };

    setMenuItems((currentItems) => [...currentItems, newItem]);

    setDishName("");
    setDescription("");
    setCourse("");
    setPrice("");

    setErrors({
      dishName: "",
      description: "",
      course: "",
      price: "",
    });

    Alert.alert(
      "Menu Item Added",
      `${newItem.dishName} has been successfully added to the menu.`
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>🍽️</Text>

          <View>
            <Text style={styles.title}>Chef's Menu Manager</Text>
            <Text style={styles.subtitle}>
              Create and manage your restaurant menu
            </Text>
          </View>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Add Menu Item</Text>
          <Text style={styles.sectionSubtitle}>
            Enter the details of a new dish below.
          </Text>

          {/* Dish Name */}
          <Text style={styles.label}>Dish Name</Text>

          <TextInput
            style={[
              styles.input,
              errors.dishName ? styles.inputError : null,
            ]}
            placeholder="e.g. Grilled Chicken"
            placeholderTextColor="#999"
            value={dishName}
            onChangeText={setDishName}
          />

          {errors.dishName ? (
            <Text style={styles.errorText}>{errors.dishName}</Text>
          ) : null}

          {/* Description */}
          <Text style={styles.label}>Description</Text>

          <TextInput
            style={[
              styles.input,
              styles.descriptionInput,
              errors.description ? styles.inputError : null,
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
            <Text style={styles.errorText}>{errors.description}</Text>
          ) : null}

          {/* Course */}
          <Text style={styles.label}>Course</Text>

          <TextInput
            style={[
              styles.input,
              errors.course ? styles.inputError : null,
            ]}
            placeholder="e.g. Main Course"
            placeholderTextColor="#999"
            value={course}
            onChangeText={setCourse}
          />

          {errors.course ? (
            <Text style={styles.errorText}>{errors.course}</Text>
          ) : null}

          {/* Price */}
          <Text style={styles.label}>Price</Text>

          <View
            style={[
              styles.priceContainer,
              errors.price ? styles.inputError : null,
            ]}
          >
            <Text style={styles.currency}>R</Text>

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
            <Text style={styles.errorText}>{errors.price}</Text>
          ) : null}

          {/* Add Button */}
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={addMenuItem}
          >
            <Text style={styles.addButtonText}>+ Add Menu Item</Text>
          </Pressable>
        </View>

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <View style={styles.menuHeader}>
            <View>
              <Text style={styles.sectionTitle}>Current Menu</Text>
              <Text style={styles.sectionSubtitle}>
                {menuItems.length === 0
                  ? "No dishes have been added yet."
                  : `${menuItems.length} ${
                      menuItems.length === 1 ? "item" : "items"
                    } on the menu`}
              </Text>
            </View>

            {menuItems.length > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{menuItems.length}</Text>
              </View>
            )}
          </View>

          {/* Empty State */}
          {menuItems.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>🍴</Text>

              <Text style={styles.emptyTitle}>
                Your menu is empty
              </Text>

              <Text style={styles.emptyText}>
                Add your first menu item using the form above.
              </Text>
            </View>
          ) : (
            <View>
              {menuItems.map((item, index) => (
                <View style={styles.menuItem} key={item.id}>
                  <View style={styles.itemTopRow}>
                    <View style={styles.itemNumber}>
                      <Text style={styles.itemNumberText}>
                        {index + 1}
                      </Text>
                    </View>

                    <View style={styles.itemTitleContainer}>
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
                </View>
              ))}
            </View>
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
    marginBottom: 28,
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
    height: 50,
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
    transform: [{ scale: 0.98 }],
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
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
});