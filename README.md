# Chef's Menu Manager

**MAST5112 — Final Portfolio of Evidence (POE Part 3)**

**Student:** Ellen Calima  
**Student Number:** ST10537385

## 1. Project Overview

Chef's Menu Manager is a mobile application developed using React Native, Expo and TypeScript.

The application allows a chef to manage restaurant menu items, including adding, editing, deleting, searching and filtering dishes. It also provides a statistics dashboard and local data persistence.

The application was developed progressively through the POE, with Part 3 extending and improving the functionality introduced in Part 2.

## 2. Features

### Menu Management

- Add new dishes with a name, description, course and price.
- Edit existing menu items.
- Delete menu items with a confirmation prompt.
- Display menu items with their details.
- Automatically update the menu when changes are made.

### Search and Filtering

- Search for dishes by name.
- Filter dishes by Starter, Main Course or Dessert.
- Combine search and course filtering.
- Clear search and filter selections.
- Display an appropriate message when no dishes match.

### Menu Statistics

- Display the total number of menu items.
- Calculate the average price of all menu items.
- Display the number of dishes in each course.
- Visualise the percentage of dishes belonging to each course.
- Automatically update statistics when menu items change.

### Data Persistence

AsyncStorage is used to save menu items locally on the device.

Saved dishes remain available when the application is closed and reopened on the same device, provided its application data is retained.

### Validation and User Feedback

- Required-field validation.
- Positive-price validation.
- Success messages for menu operations.
- Confirmation before deleting a dish.
- Empty-state messages for menu and statistics screens.

## 3. Technologies Used

| Technology | Purpose |
|---|---|
| React Native | Mobile application development |
| Expo SDK 57 | Development environment |
| TypeScript | Type-safe application code |
| Expo Router | Application navigation |
| React Context API | Shared menu state management |
| React Hooks | State management and derived calculations |
| AsyncStorage | Persistent local storage |
| StyleSheet | Application styling |

## 4. Installation and Setup

### Prerequisites

- Node.js and npm
- Visual Studio Code or another code editor
- Expo Go on a compatible mobile device

### Installation

1. Clone or download the GitHub repository.
2. Open the `ChefMenuManager` project folder.
3. Install the dependencies:

```bash
npm install
```

4. Start the Expo development server:

```bash
npx expo start
```

5. Scan the displayed QR code using Expo Go on a compatible device.

On Windows PowerShell, `npx.cmd expo start` may be used if script execution restrictions prevent `npx` from running.

## 5. Project Structure

```text
ChefMenuManager/
├── src/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   └── explore.tsx
│   ├── components/
│   │   └── app-tabs.tsx
│   └── context/
│       └── menu-context.tsx
├── assets/
├── package.json
├── tsconfig.json
├── README.md
└── CHANGELOG.md
```

**Key files:**

- `index.tsx`: Menu management, editing, deletion, search and filtering.
- `explore.tsx`: Statistics dashboard.
- `menu-context.tsx`: Shared menu data, management functions, calculations and AsyncStorage integration.
- `app-tabs.tsx`: Navigation between Menu and Statistics.
- `_layout.tsx`: Application layout and context provider.

The structure above highlights the main files; the project may contain additional components, assets and configuration files.

## 6. Improvements from Part 2 to Part 3

| Part 2 | Part 3 |
|---|---|
| Add menu items | Add, edit and delete menu items |
| Display menu items | Display and manage menu items |
| No search functionality | Search dishes by name |
| No course filtering | Filter dishes by course |
| No statistics dashboard | Live menu statistics |
| Menu data held in component state | Shared state using React Context |
| No persistent menu storage | Local storage using AsyncStorage |
| Basic menu interface | Expanded interface with two navigation tabs |

These improvements enhance the application's usability, functionality and maintainability.

## 7. Refactoring

The application was refactored to improve the organisation of its code.

Menu data and management functions were moved into a dedicated React Context provider.

The `useMenu` hook allows the Menu and Statistics screens to access the same application data without duplicating state.

TypeScript types are used to define menu items and course categories.

The `useMemo` hook is used for derived statistics such as the average price and the number of dishes per course.

## 8. Testing

The following features were manually tested using Expo Go:

- Adding a menu item.
- Editing an existing item.
- Deleting an item.
- Searching by dish name.
- Filtering by course.
- Clearing filters.
- Viewing menu statistics.
- Confirming statistics update after menu changes.
- Closing and reopening the application to verify stored menu items.

TypeScript checks and Expo compatibility checks were also performed during development.

## 9. Known Limitations

- Menu data is stored locally rather than in a cloud database.
- Data is not automatically synchronised between different devices.
- Removing the application's stored data may remove saved menu items.
- Automated unit tests are not included in the documented testing process.

## 10. Changelog

See [CHANGELOG.md](CHANGELOG.md) for the changes introduced during Part 3.

## 11. Demonstration

A demonstration video will show the application's main features, including menu management, search, filtering, statistics and persistent storage.

**YouTube demonstration link:** To be added before submission.

## 12. References

- Expo Documentation: https://docs.expo.dev/
- React Native Documentation: https://reactnative.dev/
- TypeScript Documentation: https://www.typescriptlang.org/docs/
- React Documentation: https://react.dev/
- AsyncStorage Documentation: https://react-native-async-storage.github.io/async-storage/