# FIFA Women's World Cup API

A JavaScript API that returns the standings of the FIFA Women's World Cup 2023. It scrapes the info from Fox Sports website. It checks if the last scraped results are more than one hour old, and if so, it scrapes them again.

### Usage
Just enter `npm start` for it to start listening at port 5000. The endpoints are:

#### GET - /standings
Returns the standings of all the groups