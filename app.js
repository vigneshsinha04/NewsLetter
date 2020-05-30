const request = require("request");
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({extended : true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", function(req, res){
    res.redirect("/");
});

app.post("/", function(req, res){
    const fName = req.body.firstName;
    const lName = req.body.lastName;
    const userEmail = req.body.inputEmail;;

    var data = {
        members : [
            {
                email_address : userEmail,
                status : "subscribed",
                merge_fields : {
                    FNAME : fName,
                    LNAME : lName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    // Here in url, we need to specify whcih US server we have been assigned to in our api key.
    const url = "https://us18.api.mailchimp.com/3.0/lists/1bdd77a159";

    const options = {
        method : "POST",
        auth : "Vignesh:ae953cb477981811005159bfd3cf1515-us18"
    }

    const request = https.request(url, options, function(response){
        if(response.statusCode == 200){
            res.sendFile(__dirname+ "/success.html");
        }
        else{
            res.sendFile(__dirname+ "/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
    
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running in port 3000.")
})

// API Key
// ae953cb477981811005159bfd3cf1515-us18

// List ID
// 1bdd77a159