import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
          main: '#381F75',
        },
        secondary: {
          main: '#7D5FB2',
        },
      },
    typography: {
        fontFamily: 'Open Sans',
    },
});

const joyTheme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
        },
      },
    },
  },
});

export { theme, joyTheme };
