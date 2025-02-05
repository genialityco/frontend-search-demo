/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Image,
  Text,
  Button,
  List,
  Title,
  Grid,
  Flex,
  ScrollArea,
  Group,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Activity } from "../types";

// 1) Formatear segundos a mm:ss
function formatTime(timeInSeconds: number | string): string {
  const totalSeconds = parseFloat(timeInSeconds as string) || 0;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// 2) Resaltar palabras buscadas en un texto
function highlightWords(text: string, queryWords: string[]): JSX.Element[] {
  const escapedWords = queryWords.map((w) =>
    w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );
  const pattern = escapedWords.join("|");
  const regex = new RegExp(`(${pattern})`, "gi");

  return text.split(regex).map((part, i) => {
    return queryWords.some((w) => w.toLowerCase() === part.toLowerCase()) ? (
      <mark key={i} style={{ backgroundColor: "yellow", fontWeight: 600 }}>
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    );
  });
}

interface ActivityCardProps {
  activity: Activity;
  searchQuery?: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  searchQuery = "",
}) => {
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const navigate = useNavigate();

  const queryWords = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);

  const vimeoId = activity.video ? activity.video.split("/").pop() : null;

  const generateTranscript = async () => {
    setLoadingTranscript(true);
    try {
      const response = await fetch(
        `http://localhost:3000/activities/${activity._id}/generate-transcription`,
        { method: "POST" }
      );
      if (!response.ok) throw new Error("Error al generar la transcripción");
      notifications.show({
        title: "Éxito",
        message: "Transcripción generada correctamente",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "No se pudo generar la transcripción",
        color: "red",
      });
    } finally {
      setLoadingTranscript(false);
    }
  };

  const handleCardClick = (event: React.MouseEvent) => {
    const isButtonClick = event.target instanceof HTMLButtonElement;
    const isLinkClick = event.target instanceof HTMLAnchorElement;
    const isTimestampClick = (event.target as HTMLElement).closest(
      ".timestamp-link"
    );

    if (!isButtonClick && !isLinkClick && !isTimestampClick) {
      navigate(`/activity/${activity._id}`, {
        state: {
          activity,
          searchQuery,
        },
      });
    }
  };

  const handleTimestampClick = (e: React.MouseEvent, startSeconds: number) => {
    e.stopPropagation();
    navigate(`/activity/${activity._id}/${Math.floor(startSeconds)}`, {
      state: {
        activity,
        searchQuery,
      },
    });
  };

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      style={{ position: "relative", cursor: "pointer" }}
    >
      <Grid gutter="md" align="center">
        <Grid.Col span={3}>
          <Image
            src={
              vimeoId
                ? `https://vumbnail.com/${vimeoId}.jpg`
                : "https://via.placeholder.com/160x160?text=No+Video"
            }
            alt={activity.name}
            radius="md"
            height={150}
            width="100%"
            fit="cover"
          />
        </Grid.Col>

        <Grid.Col span={9}>
          <Flex direction="column" justify="space-between">
            <Title order={4} mb="xs">
              {activity.name}
            </Title>
            <Text size="sm" c="dimmed">
              408k vistas • hace 1 año
            </Text>

            <Group mt="sm">
              <Button
                variant="light"
                component="a"
                onClick={handleCardClick}
                disabled={!activity.video}
              >
                {activity.video ? "Ver video completo" : "No disponible"}
              </Button>

              <Button
                variant="outline"
                onClick={generateTranscript}
                loading={loadingTranscript}
              >
                Generar Transcripción
              </Button>
            </Group>

            {activity.matching_segments?.length ? (
              <List spacing="xs" size="sm">
                {activity.matching_segments?.length ? (
                  <ScrollArea
                    style={{
                      maxHeight: 100,
                      overflowY: "auto",
                      borderRadius: "4px",
                      marginTop: "10px",
                      padding: "8px",
                      border: "1px solid #ddd",
                    }}
                  >
                    <List spacing="xs" size="sm">
                      {activity.matching_segments.map(
                        (segment: any, index: number) => (
                          <List.Item key={index} style={{ fontSize: "0.9rem" }}>
                            <span
                              className="timestamp-link"
                              style={{
                                cursor: "pointer",
                                color: "#1c7ed6",
                                textDecoration: "underline",
                                fontWeight: 500,
                                marginRight: "8px",
                              }}
                              onClick={(e) =>
                                handleTimestampClick(e, segment.start_time)
                              }
                            >
                              {formatTime(segment.start_time)}
                            </span>
                            {highlightWords(segment.text, queryWords)}
                          </List.Item>
                        )
                      )}
                    </List>
                  </ScrollArea>
                ) : null}
              </List>
            ) : null}
          </Flex>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export default ActivityCard;
