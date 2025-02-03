import { MantineProvider, createTheme, ColorSchemeScript } from "@mantine/core";
import { Routes, Route } from "react-router-dom";
import ActivitiesPage from "./pages/ActivitiesPage";
import ActivityDetailPage from "./pages/ActivityDetailPage"; 
import "@mantine/core/styles.css";

const theme = createTheme({
  fontFamily: "Open Sans, sans-serif",
  primaryColor: "cyan",
});

const App: React.FC = () => {
  return (
    <>
      <ColorSchemeScript />
      <MantineProvider theme={theme} withCssVariables>
          <Routes>
            <Route path="/" element={<ActivitiesPage />} />

            <Route path="/activity/:id" element={<ActivityDetailPage />} />

            <Route path="/activity/:id/:timestamp" element={<ActivityDetailPage />} />
          </Routes>
      </MantineProvider>
    </>
  );
};

export default App;
