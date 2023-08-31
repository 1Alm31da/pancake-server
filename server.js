const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
});

var username = encodeURIComponent("1Alm31da");
var password = encodeURIComponent("LnQ2TZkaa#aDpGHs");

mongoose.set("strictQuery", false)
mongoose.connect(`mongodb+srv://${username}:${password}@brisa.pkj5sis.mongodb.net/Brisa?retryWrites=true&w=majority`);

const seatSchema = new mongoose.Schema({
    //_id: String,
    row1: Array,
    row2: Array,
    row3: Array,
    row4: Array,
    row5: Array,
    row6: Array,
    row7: Array,
    row8: Array,
    row9: Array,
    row10: Array,
});
let i = 0;
let seatTickets = mongoose.model("seatTickets", seatSchema);

io.on('connection', async socket => {
    socket.on('send-class', (stateBtn) => {
        console.log(stateBtn)
        socket.broadcast.emit('received-class', (stateBtn))
    })

    socket.on('save-seats', async data => {

        let dataToSave = await seatTickets.findById('64edf0164f4f934a03829849')
        console.log(dataToSave._id)
        dataToSave.row1 = data.row1
        dataToSave.row2 = data.row2
        dataToSave.row3 = data.row3
        dataToSave.row4 = data.row4
        dataToSave.row5 = data.row5
        dataToSave.row6 = data.row6
        dataToSave.row7 = data.row7
        dataToSave.row8 = data.row8
        dataToSave.row9 = data.row9
        dataToSave.row10 = data.row10
        await dataToSave.save();
        i++
    })

    const allRuns = await seatTickets.findById('64edf0164f4f934a03829849')
    const seatsData = {
        row1: allRuns.row1,
        row2: allRuns.row2,
        row3: allRuns.row3,
        row4: allRuns.row4,
        row5: allRuns.row5,
        row6: allRuns.row6,
        row7: allRuns.row7,
        row8: allRuns.row8,
        row9: allRuns.row9,
        row10: allRuns.row10
    }
    socket.emit('inicial-seats', seatsData)
    console.log('connected')
});

server.listen( process.env.PORT || 3001, () => {
    console.log("SERVER RUNNING");
  });