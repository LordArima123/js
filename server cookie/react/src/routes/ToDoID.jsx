import { useParams } from "react-router-dom";

export default function ToDoID() {
  const params = useParams();
  console.log(params);

  let { id } = params;
  console.log(id);
  return (
    <div>
      <h1>Page with ID: {id}</h1>
      {/* Fetch data or perform actions based on the ID */}
    </div>
  );
}
