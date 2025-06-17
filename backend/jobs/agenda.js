const { Agenda } = require("agenda");
const dotenv = require("dotenv");
dotenv.config();

const agenda = new Agenda({
  db: { address: process.env.MONGO_URL, collection: "agendaJobs" },
});

module.exports = agenda;