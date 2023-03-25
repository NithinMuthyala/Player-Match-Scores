const express = require("express");

const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const path = require("path");

const app = express();
app.use(express.json());
const dbpath = path.join(__dirname, "cricketMatchDetails.db");

let db;
const initialize = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is Running at ......");
    });
  } catch (e) {
    console.log("DB:Error");
  }
};
initialize();

//api 1

app.get("/players/", async (request, response) => {
  const dbquery = `SELECT
                        player_id as playerId,
                        player_name as playerName
                        FROM 
                        player_details`;
  const dbresponse = await db.all(dbquery);
  response.send(dbresponse);
});

//api2

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const dbquery = `SELECT 
                            player_id as playerId,
                            player_name as playerName
                            FROM
                            player_details
                            WHERE player_id = ${playerId}`;
  const dbresponse = await db.get(dbquery);
  response.send(dbresponse);
});

// api3

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerdetails = request.body;
  const { playerName } = playerdetails;
  const dbquery = `UPDATE
                        player_details 
                        SET 
                        player_name = "${playerName}"
                        WHERE 
                        player_id = ${playerId};`;
  const dbresponse = await db.run(dbquery);
  response.send("Player Details Updated");
});

//api4

app.get("/matches/:matchId/", async (request, response) => {
  const { matchId } = request.params;
  const dbquery = `SELECT match_id as matchId ,
                        match,year
                        FROM
                        match_details
                        WHERE match_id = ${matchId}; `;
  const dbresponse = await db.get(dbquery);
  response.send(dbresponse);
});

//api5

app.get("/players/:playerId/matches", async (request, response) => {
  const { playerId } = request.params;
  const dbquery = `SELECT match_id as matchId,match,year
                        FROM 
                        match_details NATURAL JOIN player_match_score
                        WHERE player_id = ${playerId};`;
  const dbresponse = await db.all(dbquery);
  response.send(dbresponse);
});

// api 6

app.get("/matches/:matchId/players", async (request, response) => {
  const { matchId } = request.params;
  const dbquery = `SELECT 
                        player_id as playerId,
                        player_name as playerName
                        FROM
                        player_match_score NATURAL JOIN player_details
                        WHERE match_id = ${matchId};`;
  const dbresponse = await db.all(dbquery);
  response.send(dbresponse);
});
//api7

app.get("/players/:playerId/playerScores", async (request, response) => {
  const { playerId } = request.params;
  const dbquery = `SELECT 
                       player_id as playerId,
                       player_name as playerName,
                       sum(score) as totalScore,
                       sum(fours)  as totalFours,
                       sum(sixes) as totalSixes
                       FROM
                       player_details NATURAL JOIN player_match_score
                       GROUP BY player_id
                       HAVING player_id = ${playerId}`;
  const dbresponse = await db.get(dbquery);
  response.send(dbresponse);
});

module.exports = app;
