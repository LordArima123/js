import { Typography, Button, Box } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useTodoStore } from "../stores/todo-stores";

export default function Error() {
  const params = useParams();

  const navigate = useNavigate();
  let { id } = params;
  const { errorMsg } = useTodoStore();

  const goBack = () => {
    if (id === "401") {
      navigate("/");
    } else {
      navigate("/Dashboard");
    }
  };

  return (
    <Box>
      <Typography variant="h1">{id}</Typography>
      <Typography variant="h4">{errorMsg}</Typography>
      <Button variant="outlined" onClick={() => goBack()}>
        Go Back
      </Button>
    </Box>
  );
}
