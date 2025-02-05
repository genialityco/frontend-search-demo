/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Card,
  Divider,
  Button,
  Loader,
  ScrollArea,
  List,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Activity } from "../types";

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const highlightWords = (text: string, query: string): JSX.Element[] => {
  if (!query) return [<span key={0}>{text}</span>];

  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  const regex = new RegExp(`(${words.join("|")})`, "gi");

  return text.split(regex).map((part, i) =>
    words.includes(part.toLowerCase()) ? (
      <mark key={i} style={{ backgroundColor: "yellow", fontWeight: 600 }}>
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
};

const ActivityDetailPage: React.FC = () => {
  const { timestamp } = useParams<{ timestamp?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const activity: Activity | undefined = location.state?.activity;
  const searchQuery: string = location.state?.searchQuery || "";

  const [transcript, setTranscript] = useState<string>("");
  const [matchingSegments, setMatchingSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!activity) {
      navigate("/");
      return;
    }

    const fetchTranscript = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/transcripts/${activity._id}?query=${searchQuery}`
        );
        const data = await response.json();
        setTranscript(data.text);
        setMatchingSegments(data.matching_segments || []);
      } catch (error) {
        console.error("Error fetching transcript:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTranscript();
  }, [activity, searchQuery]);

  if (!activity) return null;

  const vimeoId = activity.video ? activity.video.split("/").pop() : null;
  const videoUrl = timestamp
    ? `https://player.vimeo.com/video/${vimeoId}#t=${timestamp}s`
    : `https://player.vimeo.com/video/${vimeoId}`;

  const handleTimestampClick = (startSeconds: number) => {
    navigate(`/activity/${activity._id}/${Math.floor(startSeconds)}`, {
      state: { activity, searchQuery },
    });
  };

  return (
    <Container fluid size="md" mt="xl" style={{ paddingInline: "100px" }}>
      <Button
        leftSection={<IconArrowLeft size={18} />}
        variant="subtle"
        onClick={() => navigate(-1)}
        mb="md"
      >
        Volver
      </Button>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={2} mb="sm">
          {activity.name}
        </Title>

        {vimeoId ? (
          <div
            style={{
              position: "relative",
              paddingTop: "56.25%",
              marginTop: "20px",
            }}
          >
            <iframe
              src={videoUrl}
              title={activity.name}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <Text c="red">No hay video disponible.</Text>
        )}

        <Divider my="lg" />

        {searchQuery && (
          <>
            <Title order={3} mb="sm">
              Buscando por: "{searchQuery}"
            </Title>
            {loading ? (
              <Loader />
            ) : matchingSegments.length ? (
              <ScrollArea
                style={{
                  maxHeight: 150,
                  overflowY: "auto",
                  borderRadius: "4px",
                  marginTop: "10px",
                  padding: "8px",
                  border: "1px solid #ddd",
                }}
              >
                <List spacing="xs" size="sm">
                  {matchingSegments.map((segment, index) => (
                    <List.Item key={index} style={{ fontSize: "0.9rem" }}>
                      <span
                        style={{
                          cursor: "pointer",
                          color: "#1c7ed6",
                          textDecoration: "underline",
                          fontWeight: 500,
                          marginRight: "8px",
                        }}
                        onClick={() => handleTimestampClick(segment.start_time)}
                      >
                        {formatTime(segment.start_time)}
                      </span>{" "}
                      {highlightWords(segment.text, searchQuery)}
                    </List.Item>
                  ))}
                </List>
              </ScrollArea>
            ) : (
              <Text size="sm" c="dimmed">
                No se encontraron coincidencias.
              </Text>
            )}
          </>
        )}

        <Divider my="lg" />

        <Title order={3} mb="sm">
          Transcripción Completa
        </Title>
        <div
          style={{
            maxHeight: "300px",
            overflowY: "auto",
            border: "1px solid #ddd",
            padding: "10px",
          }}
        >
          <Text size="sm">{highlightWords(transcript, searchQuery)}</Text>
        </div>
      </Card>
    </Container>
  );
};

export default ActivityDetailPage;
