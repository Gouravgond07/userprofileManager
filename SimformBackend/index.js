const app = require("./app");
const Config = require("./config/index");
const PORT = Config.serverPort;

app.listen(PORT, () => console.log(`SERVER IS  LISTENING On ${PORT}`));