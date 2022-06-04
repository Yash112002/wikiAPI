//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const req = require("express/lib/request");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
    useNewUrlParser: true
})
const articleSchema = {
    title: String,
    content: String
}
const Article = mongoose.model("Article", articleSchema);

//TODO

app.route("/articles")
    .get(
        (req, res) => {
            Article.find({}, (err, found) => {
                if (err) console.log(err);
                else
                    res.send(found);
            })
        }
    )
    .post(
        (req, res) => {
            // console.log(req.body.title);
            // console.log(req.body.content);
            const newArticle = new Article({
                title: req.body.title,
                content: req.body.content
            });
            newArticle.save((err) => {
                if (err) console.log(err);
                else res.send("Successfully added an element!");
            });
        }
    )
    .delete(
        (req, res) => {
            Article.deleteMany({}, (err) => {
                if (err) console.log(err);
                else {
                    res.send("successfully deleted all articles.");
                }
            });
        }
    );

//////////////////////////////////////////////////Request Targeting A Specific Articles///////////////////////////////////////////////////

app.route("/articles/:articleTitle")
    // req.param.articleTitle = 
    .get((req, res) => {
        Article.findOne({
            title: req.params.articleTitle
        }, (err, found) => {
            if (err) console.log(err);
            else {
                if (found) res.send(found);
                else res.send("No Article found!!");
            }
        });
    })
    .put((req, res) => { //put replace the complete object
        Article.updateOne({
            title: req.params.articleTitle
        }, {
            $set: {
                title: req.body.title,
                content: req.body.content
            }
        }, {
            upsert: true
        }, (err) => {
            if (err) console.log(err);
            else res.send("successfully updated article!!");
        });
    })
    .patch((req, res) => {
        Article.updateOne({
                title: req.params.articleTitle
            }, {
                $set: req.body
            }, {
                upsert: true
            },
            (err) => {
                if (err) console.log(err);
                else res.send("Succesfully updated Article");
            }
        )
    })
    .delete((req, res) => {
        Article.deleteOne({
            title: req.body.title
        }, (err) => {
            if (err) console.log(log);
            else res.send("Successfully deleted the item!!");
        })
    });

app.listen(3000, function () {
    console.log("Server started on port 3000");
});