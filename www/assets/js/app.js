var avatar1 = "https://bootdey.com/img/Content/avatar/avatar1.png"
var avatar2 = "https://bootdey.com/img/Content/avatar/avatar2.png"

var App = {
  socket: null,

  user: {},

  connection_server: function (token, callback) {
    console.log("Connessione in Corso...");
    this.socket = io();
    this.socket.on("connect", function () {
      jQuery(document).ready(function ($) {
        $('#status-socket').html('ON')
        App.socket.on("disconnect", function () {
          $('#status-socket').html('OFF')
          console.log(App.socket)
        });
        App.socket.on("authenticated", callback);
        App.socket.on("unauthorized", function (msg) {
          console.error(msg);
        });
        App.socket.emit("authenticate", { token: token });
      });
    })
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
    //gestione risposta server
    App.socket.once("joinedIntoRoom", function () {
      console.log('room joinata')
      jQuery(document).ready(function ($) {
        function insertOtherMessage(name, text) {
          var element = '<div class="col-md-8">\
          <div class="other-message">\
              <div class="avatar">\
                  <img class="img-circle" style="width:100%;" src="'+ avatar1 + '" alt="">\
              </div>\
              <div class="text">\
                  '+ name + ': ' + text + '\
              </div>\
          </div>\
      </div>'

          $('.message-container').append(element);
        }

        App.socket.on("messageReceived", function (data) {
          console.log("mess arrivato", data.message);
          insertOtherMessage(data.name, data.message);
        });
      });
    });
    App.socket.emit("roomJoined", id);
  },

  socketSendMessage: function (message) {
    console.log('my nick', App.user)
    App.socket.emit("sendMessage", { name: App.user, message: message });
  }
};

jQuery(document).ready(function ($) {

  function statusSocket(val) {
    $('#status-socket').html(val)
  }

  function insertMyMessage(text) {
    var element =
      '<div class="col-md-8 offset-md-4">\
      <div class="my-message">\
          <div class="avatar">\
              <img class="img-circle" style="width:100%;" src="'+ avatar2 + '" alt="">\
          </div>\
          <div class="text">\
              '+ 'me: ' + text + '\
          </div>\
      </div>\
  </div>';

    $('.message-container').append(element);
  }

  function insertOtherMessage(name, text) {
    var element = '<div class="col-md-8">\
    <div class="other-message">\
        <div class="avatar">\
            <img class="img-circle" style="width:100%;" src="https://bootdey.com/img/Content/avatar/avatar3.png" alt="">\
        </div>\
        <div class="text">\
            '+ name + ': ' + text + '\
        </div>\
    </div>\
</div>'

    $('.message-container').append(element);
  }

  function sendMessage() {
    var text = $('#my-message-text').val();
    if (text !== "") {
      insertMyMessage(text);
      $('#my-message-text').val('');
      App.socketSendMessage(text);
    }
  }

  $('#my-message-text').on('keydown', function (e) {
    if (e.which == 13) {
      sendMessage();
    }
  })

  $('#chat-send-button').on('click', function () {
    sendMessage();
  })
})