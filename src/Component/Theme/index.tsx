import { useState, useEffect, createContext } from 'react';
import { ThemeMode } from '../../constants/type';
import { DocMiniApp } from '../../utils/api';

export const ThemeContext = createContext<ThemeMode>(ThemeMode.LIGHT);
ThemeContext.displayName = 'themeContext';

export function ThemeProvider(props: React.PropsWithChildren<{}>): React.ReactElement {
    const [theme, updateTheme] = useState(ThemeMode.LIGHT);

    const handleDarkModeChange = (isDarkMode: boolean) => {
        const theme = isDarkMode ? ThemeMode.DARK : ThemeMode.LIGHT;
        updateTheme(theme);
    }
  
    useEffect(() => {
        DocMiniApp.Env.DarkMode.getIsDarkMode().then((isDarkMode: boolean) => {
            const theme = isDarkMode ? ThemeMode.DARK : ThemeMode.LIGHT;
            updateTheme(theme);
        });
        DocMiniApp.Env.DarkMode.onDarkModeChange(handleDarkModeChange);
      return () => {
        DocMiniApp.Env.DarkMode.offDarkModeChange(handleDarkModeChange);
      };
    }, [updateTheme]);
  
    return (
      <ThemeContext.Provider value={theme}>
        {props.children}
      </ThemeContext.Provider>
    );
  }