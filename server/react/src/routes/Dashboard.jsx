import { Container } from "@mui/material";

function Dashboard() {
  const sessionId = localStorage.getItem("sessionId");
  return (
    <Container>
      <div>{sessionId}</div>
    </Container>
  );
}
export default Dashboard;
