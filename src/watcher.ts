import * as signalR from "@microsoft/signalr";

let connection = new signalR.HubConnectionBuilder().withUrl("/watch").build();
connection.on("refresh", (data) => {
    location.reload();
});
connection
    .start()
    .then(function () {
        console.log("connection started");
    })
    .catch(function (err) {
        return console.error(err.toString());
    });
