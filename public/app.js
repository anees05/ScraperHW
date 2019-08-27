$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").prepend(
            "<img src=" +
            data[i].image +
            ">" +
            "<br />" +
            "<a href=" +
            "https://www.nytimes.com" +
            data[i].link +
            ">" +
            "<h2>" +
            data[i].title +
            "<br />" +
            "</h2>" +
            "</a>" +
            "<p data-id=" +
            data[i]._id +
            ">" +
            data[i].summary +
            "<br />" +
            "<br />" +
            "<button class='btn btn-success'>" +
            "Add/Update Note" +
            "</button>" +
            "<br />" +
            "<br />" +
            "<br />" +
            "</p>"
        );
    }
});

$(document).on("click", "p", function () {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        .then(function (data) {
            console.log(data);
            $("#notes").append("<h2>" + data.title + "</h2>");
            $("#notes").append(
                "<input id='titleinput' name='title' placeholder='Note Title'>"
            );
            $("#notes").append(
                "<textarea id='bodyinput' name='body' placeholder='Description'></textarea>"
            );
            $("#notes").append(
                "<br>" +
                "<button data-id='" +
                data._id +
                "' id='savenote' class='btn btn-primary'>Save Note</button>" +
                " " +
                " "
            );
            $("#notes").append(
                "<button data-id='" +
                data._id +
                "' id='deletenote' class='btn btn-danger'>Delete Note</button>"
            );

            if (data.note) {
                $("#titleinput").val(data.note.title);
                $("#bodyinput").val(data.note.body);
            }
        });
});

$(document).on("click", "#savenote", function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
        .then(function (data) {
            console.log(data);
            $("#notes").empty();
        });

    $("#titleinput").val("");
    $("#bodyinput").val("");
});

$("#scrape").on("click", function () {
    window.location.replace("/scrape");
});

$(document).on("click", "#deletenote", function () {
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: "",
            body: ""
        }
    })
        .then(function (data) {
            console.log(data);
            $("#notes").empty();
        });
});
