# Changelog — Chef's Menu Manager

## Part 3 — Final POE

### Added
- Edit functionality for existing menu items.
- Delete functionality with confirmation before removal.
- Search functionality to find dishes by name.
- Course filtering for Starter, Main Course and Dessert.
- Clear filters functionality to reset the search and course selection.
- Statistics screen displaying the total number of menu items.
- Automatic calculation of the average menu item price.
- Statistics showing the number and percentage of dishes in each course.
- Persistent local storage using AsyncStorage.

### Improved
- Centralised menu management using React Context.
- Automatic updates to the menu and statistics when dishes are added, edited or deleted.
- Form validation for required fields and positive prices.
- Success messages and deletion confirmation.
- Navigation between Menu and Statistics screens.
- Empty-state messages when no dishes or search results are available.
- TypeScript configuration and Expo dependency compatibility.

### Refactoring
- Moved shared menu state and management functions into `src/context/menu-context.tsx`.
- Reused menu data across multiple screens through the `useMenu` hook.
- Used TypeScript types for menu items and course categories.
- Used React `useMemo` for derived menu statistics.

## Part 2 — Previous Implementation

- Developed the initial menu management interface.
- Implemented the form for adding menu items.
- Added required-field and price validation.
- Displayed added dishes in the menu list.
- Established the initial application layout and styling.

## Testing

The following functionality was manually tested using Expo Go:

- Adding, editing and deleting menu items.
- Searching and filtering menu items.
- Displaying menu statistics.
- Saving and retrieving menu items after restarting the application.
- Navigating between application screens.

The project was also checked using TypeScript and Expo development tools.