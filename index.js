require("dotenv").config();
const { express, mongoose } = require("./config");
const app = express();
const PORT = process.env.PORT || 6969;

app.use(express.json());

app.get(
  "/",
  app.use("/join", require("./routes/join.js")),
  app.use("/profile", require("./routes/profile")),
  app.use("/feed", require("./routes/feed")),
  app.use("/feed", require("./routes/bidding"))
);

mongoose
  .connect(process.env.CONNECTION_URL, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then((result) =>
    app.listen(PORT, () => {
      console.log(`Listening to port ${PORT}...`);
    })
  );
