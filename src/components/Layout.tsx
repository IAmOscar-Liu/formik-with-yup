import {
  AppBar,
  Container,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
  Box
} from "@material-ui/core";
import { theme } from "../theme";

interface LayoutProps {
  children: JSX.Element;
}

export const Layout = ({ children }: LayoutProps) => (
  <ThemeProvider theme={theme}>
    <AppBar position="fixed">
      <Toolbar variant="dense">
        <Typography variant="h6">Field Array Formik</Typography>
      </Toolbar>
    </AppBar>

    <CssBaseline />
    <Container>
      <Box marginTop={10}>{children}</Box>
    </Container>
  </ThemeProvider>
);
