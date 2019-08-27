var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars")
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT = process.env.PORT || 3000;
var app = express();


app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/scraperdb", { useNewUrlParser: true });



app.get("/scrape", function (req, res) {
    axios.get("https://www.nytimes.com/section/world").then(function (response) {
        var $ = cheerio.load(response.data);

        $("article").each(function (i, element) {
            var result = {};

            result.title = $(this)
                .children("div")
                .children("h2")
                .children("a")
                .text();

            result.link = $(this)
                .children("div")
                .children("h2")
                .children("a")
                .attr("href");

            result.image = $(this)
                .children("figure")
                .children("a")
                .children("img")
                .attr("src");

            result.summary = $(this)
                .children("div")
                .children("p")
                .text();

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    console.log(err);
                });
        });
        res.send("Scrape complete")
    });
});

app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.post("/articles/:id", function (req, res) {
    db.Note.create(req.body)
        .then(function (dbNote) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.delete("/articles/:id", function (req, res) {
    db.Note.remove(req.body)
        .then(function (dbComment) {
            return db.Article.findOneAndRemove({ _id: req.params.id }, { comment: dbNote._id })
        })
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        })
})

app.get("/", function (req, res, next) {
    db.Article.find({})
        .then(function (data) {
            var hbsObject = {
                articles: data
            };
            res.render("index", hbsObject);
        })
        .catch(function (err) {
            res.json(err);
        });

});


app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});