//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// MongoDB Setup
// connect to db
mongoose.connect("mongodb://localhost:27017/wikiDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

//create a schema
const articleSchema = new mongoose.Schema({
	title: String,
	content: String,
});

// use the schema to create a mongoose model
const Article = mongoose.model("Article", articleSchema);

// Requests targeting all articles

app.route("/articles")
	.get(function (req, res) {
		Article.find(function (err, foundArticles) {
			if (!err) {
				res.send(foundArticles);
			} else {
				res.send(err);
			}
		});
	})
	.post(function (req, res) {
		const newArticle = new Article({
			title: req.body.title,
			content: req.body.content,
		});

		newArticle.save(function (err) {
			if (!err) {
				res.send("added");
			} else {
				res.send(err);
			}
		});
	})
	.delete(function (req, res) {
		Article.deleteMany({}, function (err) {
			if (!err) {
				res.send("All deleted");
			} else {
				res.send(err);
			}
		});
	});

// Requests targeting a specific article

app.route("/articles/:articleTitle")
	.get(function (req, res) {
		Article.findOne(
			{ title: req.params.articleTitle },
			function (err, foundArticle) {
				if (foundArticle) {
					res.send(foundArticle);
				} else {
					res.send("Not found");
				}
			}
		);
	})
	.put(function (req, res) {
		Article.update(
			{ title: req.params.articleTitle },
			{ title: req.body.title, content: req.body.content },
			{ overwrite: true },
			function (err) {
				if (!err) {
					res.send("Successfully updated article");
				}
			}
		);
	})
	.patch(function (req, res) {
		Article.update(
			{ title: req.params.articleTitle },
			{ $set: req.body },

			function (err) {
				if (!err) {
					res.send("Successfully updated article");
				} else {
					res.send(err);
				}
			}
		);
	})
	.delete(function (req, res) {
		Article.deleteOne({ title: req.params.articleTitle }, function (err) {
			if (!err) {
				res.send("Successfully deleted article");
			} else {
				res.send(err);
			}
		});
	});

app.listen(3000, function () {
	console.log("Server started on port 3000");
});
