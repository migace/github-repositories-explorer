jest.mock("react-native-paper", () => {
  const realModule = jest.requireActual("react-native-paper");
  return {
    ...realModule,
    MD3DarkTheme: {
      ...realModule.MD3DarkTheme,
      colors: {
        ...realModule.MD3DarkTheme.colors,
        background: "#121212",
      },
    },
    configureFonts: jest.fn(),
  };
});

jest.mock("expo-font", () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
}));

jest.mock("@shopify/flash-list", () => {
  const { FlatList } = require("react-native");
  return { FlashList: FlatList };
});

jest.mock("expo-router", () => ({
  Link: ({ children }) => children,
  useLocalSearchParams: jest.fn(() => ({})),
  useRouter: jest.fn(() => ({ push: jest.fn(), back: jest.fn() })),
  Stack: {
    Screen: jest.fn(() => null),
  },
}));
