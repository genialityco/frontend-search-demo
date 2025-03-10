import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Container,
  Grid,
  TextInput,
  Loader,
  Pagination,
  Paper,
  Center,
  Image,
  Text,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import ActivityCard from "../components/ActivityCard";
import { fetchActivities, fetchSearchActivities } from "../services/api";
import { Activity } from "../types";

const ActivitiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearchQuery = searchParams.get("query") || "";

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const limit = 8;

  // ✅ Mantener la búsqueda en la URL cuando cambia el usuario escribe o cambia de página
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (currentPage !== 1) params.set("page", String(currentPage));

    setSearchParams(params);
  }, [searchQuery, currentPage]);

  // ✅ Buscar actividades con debounce
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response =
          searchQuery.length >= 3
            ? await fetchSearchActivities(currentPage, limit, searchQuery)
            : await fetchActivities(currentPage, limit);

        setActivities(response.data);
        setTotalPages(Math.ceil(response.total / limit));
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
      setLoading(false);
    };

    const debounce = setTimeout(fetchData, 500);
    return () => clearTimeout(debounce);
  }, [searchQuery, currentPage]);

  return (
    <Container size="xl" fluid style={{ paddingBottom: 40 }}>
      <Paper
        shadow="xs"
        p="md"
        radius="md"
        mb="xl"
        style={{
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        <Image src="/images/LOGOS_GEN.iality_web-02.svg" />
        <TextInput
          placeholder="Buscar actividades..."
          leftSection={<IconSearch size={18} />}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reiniciar a la página 1 en una nueva búsqueda
          }}
          size="md"
          radius="md"
          styles={{
            input: {
              border: "1px solid #ced4da",
            },
          }}
        />
        <Text size="xs">Videos en el demo con transcript: </Text>
        <Text size="xs">Protagonismo de Lp(a) e Hipertrigliceridemia en el riesgo cardiovascular.</Text>
        <Text size="xs">Hipertiroidismo en embarazo: antitiroideo vs Cirugía</Text>
      </Paper>

      {loading ? (
        <Center mt="xl">
          <Loader size="xl" />
        </Center>
      ) : (
        <>
          <Grid gutter="md">
            {activities.map((activity) => (
              <Grid.Col key={activity._id} span={12}>
                <ActivityCard activity={activity} searchQuery={searchQuery} />
              </Grid.Col>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Center mt="xl">
              <Pagination
                total={totalPages}
                value={currentPage}
                onChange={setCurrentPage}
              />
            </Center>
          )}
        </>
      )}
    </Container>
  );
};

export default ActivitiesPage;
