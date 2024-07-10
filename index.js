import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

let postArray = [];
app.post("/post-index", (req, res) => {
  postArray.push({ userPost: req.body });
  res.render("./index.ejs", { list: postArray });
});

app.get("/post-index", (req, res) => {
  res.render("./index.ejs", { list: postArray });
});

app.get("/:title", (req, res) => {
  const postTitle = req.params.title;
  const post = postArray.find((p) => p.userPost.title === postTitle);
  if (post) {
    res.render("entry.ejs", { post: post.userPost });
  } else {
    res.status(404).send("Post not found");
  }
});

app.delete("/delete/:title", (req, res) => {
  const postTitle = req.params.title;
  postArray = postArray.filter((p) => p.userPost.title !== postTitle);
  res.redirect("/post-index");
});

app.get("/edit/:title", (req, res) => {
  const postTitle = req.params.title;
  const post = postArray.find((p) => p.userPost.title === postTitle);
  if (post) {
    res.render("edit.ejs", { post: post.userPost });
  } else {
    res.status(404).send("Post not found");
  }
});

app.post("/edit/:title", (req, res) => {
  const postTitle = req.params.title;
  const updatedPost = {
    title: req.body.title,
    entry: req.body.entry,
  };
  postArray = postArray.map((p) => {
    if (p.userPost.title === postTitle) {
      return { userPost: updatedPost };
    }
    return p;
  });
  res.redirect("/post-index");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//CRUD --> here 1 array is used for: .push() TO CREATE, .find() TO READ, .map() TO UPDATE, .filter() TO READ
