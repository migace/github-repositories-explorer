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
