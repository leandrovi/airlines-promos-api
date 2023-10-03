import { app } from "./app";

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`🛫 Airlines promos API is running on port ${port}`);
});
