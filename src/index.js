const { JSDOM } = require('jsdom');
const {window} = new JSDOM( "" );
const express = require('express');
const $ = require('jquery')( window );

const app = express();
const port = 5000;

let standings = ["empty"];
let lastUpdate = new Date(2023,1,1)

app.get('/standings', (req, res)=>{
    let now = new Date();
    let limitTime = new Date(lastUpdate.getTime() + 60*60*1000)
    res.type("application/json")
    if(now > limitTime) {
        console.log("Info is more than one hour old, getting updated standings")
        lastUpdate = new Date();
        var settings = {
            "url": "https://www.foxsports.com/soccer/2023-fifa-womens-world-cup/standings",
            "method": "GET",
            "timeout": 0,
          };
          
          $.ajax(settings).done(function (response) {
            const website = $("<html></html>")
            website.html(response);
            const groups = website.find(".table-standings")
            let info = []
            let groupsLetters = "ABCDEFGH"
            let i = 0
            
            groups.each(function () {
              let groupTable = $(this).find("tbody tr")
          
              groupTable.each(function () {
                let cells = $(this).find("td");
                let wdl = cells.eq(3).text().trim().split("-");
                let teamInfo = { 
                  name: cells.eq(1).text().trim(),
                  played: cells.eq(2).text().trim(), 
                  won: wdl[0], 
                  draw: wdl[1], 
                  lost: wdl[2], 
                  goalsFor: cells.eq(5).text().trim(),
                  goalsAgainst: cells.eq(5).text().trim(),
                  goalDiff: cells.eq(6).text().trim(),
                  points: cells.eq(7).text().trim(),
                  group: groupsLetters[i]
                };
                info.push(teamInfo);
              })
              i++
            })
            standings = info;
            res.send(JSON.stringify(standings))
          });
    } else {
        console.log("Info up to date")
        res.send(JSON.stringify(standings))
    }
})

app.listen(port, ()=> {
    console.log(`API listening on port ${port}`)
})