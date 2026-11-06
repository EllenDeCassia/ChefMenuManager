
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

export type Course = "Starter" | "Main Course" | "Dessert";

export type MenuItem = {
  id: string;
  dishName: string;
  description: string;
  course: Course;
  price: string;
};

type MenuContextType = {
  menuItems: MenuItem[];
  addItem: (item: MenuItem) => void;
  updateItem: (item: MenuItem) => void;
  deleteItem: (id: string) => void;
  totalItems: number;
  averagePrice: number;
  courseCounts: Record<Course, number>;
  isLoading: boolean;
};

const STORAGE_KEY = "@chef_menu_manager_items";

const MenuContext = createContext<MenuContextType | undefined>(
  undefined
);

export function MenuProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load saved menu items when the app starts.
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const storedData = await AsyncStorage.getItem(
          STORAGE_KEY
        );

        if (storedData !== null) {
          const parsedData: unknown = JSON.parse(storedData);

          if (Array.isArray(parsedData)) {
            setMenuItems(parsedData as MenuItem[]);
          }
        }
      } catch (error) {
        console.error("Failed to load menu items:", error);
      } finally {
        setHasLoaded(true);
        setIsLoading(false);
      }
    };

    loadMenu();
  }, []);

  // Save changes after the initial data has loaded.
  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    const saveMenu = async () => {
      try {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(menuItems)
        );
      } catch (error) {
        console.error("Failed to save menu items:", error);
      }
    };

    saveMenu();
  }, [menuItems, hasLoaded]);

  const addItem = (item: MenuItem) => {
    setMenuItems((current) => [...current, item]);
  };

  const updateItem = (updatedItem: MenuItem) => {
    setMenuItems((current) =>
      current.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setMenuItems((current) =>
      current.filter((item) => item.id !== id)
    );
  };

  const totalItems = menuItems.length;

  const averagePrice = useMemo(() => {
    if (menuItems.length === 0) {
      return 0;
    }

    const totalPrice = menuItems.reduce(
      (sum, item) => sum + Number(item.price),
      0
    );

    return totalPrice / menuItems.length;
  }, [menuItems]);

  const courseCounts = useMemo(() => {
    const counts: Record<Course, number> = {
      Starter: 0,
      "Main Course": 0,
      Dessert: 0,
    };

    menuItems.forEach((item) => {
      counts[item.course] += 1;
    });

    return counts;
  }, [menuItems]);

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        addItem,
        updateItem,
        deleteItem,
        totalItems,
        averagePrice,
        courseCounts,
        isLoading,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error(
      "useMenu must be used inside a MenuProvider."
    );
  }

  return context;
}
