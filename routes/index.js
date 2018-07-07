var express = require('express');
var mqtt=require('mqtt');
var mongo=require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/tadi');
var arr=[];
var client = mqtt.connect('mqtt://192.168.0.4');
var app= express.Router();

var Schema=mongoose.Schema;
var construct=new Schema(
	{
		lat:{
			type:String
		},
		long:{
			type:String 
		}
  },{collection:'map'}
);

var data=mongoose.model('data',construct);



client.on('connect', function () {
  client.subscribe('lat');
  client.subscribe('long');
})

app.get('/',function(req,res)
{
  res.render('index');  
});

app.post('/map',function(req,res)
{

var lat1=req.body.lat1;   
var long1=req.body.long1;   
var lat2=req.body.lat2;     
var long2=req.body.long2;
var e=(lat2-lat1);
var f=(long2-long1);   
console.log(lat1);
console.log(lat1+e/2);
res.render('layout',{title1:lat1,title2:long1,title3:lat2,title4:long2});
});

app.get('/control',function(req,res){
  var thrvalue=1150;
  var rudvalue=1900;
  client.publish('thr',thrvalue.toString());
  client.publish('rud',rudvalue.toString());
  res.render('on');

})

app.get('/control/on',function(req,res){
  var thrvalue=1150;
  var rudvalue=1150;
  client.publish('thr',thrvalue.toString());
  client.publish('rud',rudvalue.toString());
  res.render('off');
})

app.get('/location',function(req,res){
  
data.find(function(err,docs)
{
  if(err)
  console.log(err);
  else{
    var lat=docs[docs.length-1].lat;
    var long=docs[docs.length-1].long;
    console.log(lat+" "+long);
    res.render('geo',{lat:lat,long:long});
  }
})  
  
app.get('/image',function(req,res){
  res.render('image');
})

app.get('/takeimage',function(req,res){
  res.redirect('/');
})

})

module.exports = app;
