var App = {
  socket: null,

  connection_server: function (token, callback) {
    console.log("Connessione in Corso...");
    this.socket = io("192.168.178.9");
    this.socket.on("connect", function () {
      App.socket.emit("authenticate", { token: token })
      App.socket.on("authenticated", callback)
      App.socket.on("unauthorized", function (msg) {
        console.error(msg);
      });
    });
  },

  logout_function: function () {
    this.socket.emit("logout_event", this.socket.id);
    console.log("Client -> socket:", this.socket.id);
    $.post("/logout", function (data) {
      console.log("Client -> Risposta", data);
      console.log("Client -> Sessione distrutta(?)");
    });
  },

  socketJoin: function (id) {
    App.socket.emit('room-joined', id);
  },

  socketSendMessage: function (message) {
    console.log(App.socket)
    App.socket.emit("message-send", message);
  },

  socketGetMessage: function (callback) {
    console.log(this.socket)
    App.socket.on("message-rec", callback)
  }
}