//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");
const articleSchema={
  title:String,
  content:String
}
const Article = mongoose.model("Article",articleSchema);

app.route("/articles")
.get(function(req,res){
  async function getData(){
    const response = await Article.find();
    res.send(response);
  }
  getData();
})
.post(function(req,res){
  const newArticle=new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save();
})
/*.delete(function(req,res){
  Article.deleteMany().then(function(){
   res.send("Data deleted");
  }).catch(function(error){
   res.send(error);
  });
 });*/

//app.get("/articles",);app.post("/articles",);app.delete("/articles",);

app.route("/articles/:articleTitle")

.get(function(req,res){
  async function getData(){
    const response = await Article.findOne({title:req.params.articleTitle});
    res.send(response);
  }
  getData();
})

.put(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content}
  ).then(function(){
    res.send("Data is updated ...");
  }).catch(function(error){
    res.send(error);
  });
})

.patch(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {$set:req.body}
  ).then(function(){
    res.send("Data is updated");
  }).catch(function(error){
    res.send(error);
  })
})

.delete(function(req,res){
  Article.deleteOne(
    {title:req.params.articleTitle}
  ).then(function(){
    res.send("Data is deleted ... ");
  }).catch(function(error){
    res.send(error);
  })
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});