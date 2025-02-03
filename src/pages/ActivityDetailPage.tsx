import { useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Card,
  Divider,
  Button,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { Activity } from "../types";

const ActivityDetailPage: React.FC = () => {
  const { timestamp } = useParams<{ timestamp?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const activity: Activity | undefined = location.state;

  useEffect(() => {
    if (!activity) {
      navigate("/");
    }
  }, [activity, navigate]);

  if (!activity) return null;

  const vimeoId = activity.video ? activity.video.split("/").pop() : null;
  const videoUrl = timestamp
    ? `https://player.vimeo.com/video/${vimeoId}#t=${timestamp}s`
    : `https://player.vimeo.com/video/${vimeoId}`;

  return (
    <Container fluid size="md" mt="xl" style={{ paddingInline: "100px" }}>
      {/* Botón para volver */}
      <Button
        leftSection={<IconArrowLeft size={18} />}
        variant="subtle"
        onClick={() => navigate(-1)}
        mb="md"
      >
        Volver
      </Button>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        {/* Título */}
        <Title order={2} mb="sm">
          {activity.name}
        </Title>

        {/* Video Embed */}
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

        {/* Transcripción */}
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
          <Text size="sm">
            {activity.text || "No hay transcripción disponible."}
          </Text>
        </div>
      </Card>
    </Container>
  );
};

export default ActivityDetailPage;
