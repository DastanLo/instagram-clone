const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const cors = require('cors');
const config = require('config');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json({extended: true}));

app.use('/user', require('./routes/auth'));
app.use('/posts', require('./routes/posts'));

const server = http.createServer(app);
const io = module.exports.io = socketIo(server);
const SocketManager = require('./routes/messages');

io.on("connection", SocketManager);

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const PORT = config.get('port') || 5000

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    server.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
  } catch (e) {
    console.log('Server Error', e.message);
    process.exit(1);
  }
}

start();
