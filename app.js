// app.js

const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const DbConfig = require('./getdbConfig');

const app = express();
const PORT = process.env.PORT || 3000;


const dbConfigPath = '/etc/secrets/ddb_connection.json';
const dbConfigService = new DbConfig(dbConfigPath);

const dbConfig = dbConfigService.getDbConfig();

if (!dbConfig) {
    console.error('Failed to retrieve database configuration. Exiting.');
    process.exit(1);
  }

const pool = new Pool(dbConfig);

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));

app.get('/api/main', (req, res) => {
  //get the ddb datas
  const sqlQuery = `
  SELECT
      p.player_nickname,
      SUM(r.players_points_won) + COALESCE(b.bonus, 0) AS playertotalscoreofseason,
      s.season_id
  FROM
      sddb.players p
  JOIN
      sddb.registrations r ON p.player_id = r.player_id
  JOIN
      sddb.tournaments t ON r.tournament_id = t.tournament_id
  JOIN
      sddb.seasons s ON t.season_id = s.season_id
      LEFT JOIN
      (
          SELECT
              player_id,
              MAX(bonus) AS bonus
          FROM
              sddb.players
          GROUP BY
              player_id
      ) b ON p.player_id = b.player_id
  GROUP BY
      p.player_nickname, s.season_id, b.bonus;
`;
  pool.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results.rows);
  });
});

app.get('/api/participants', (req, res) => {
  //get the ddb datas
  const sqlQuery = `
  WITH RankedResults AS (
    SELECT
        p.player_nickname,
        t.tournament_id,
        r.players_points_won,
        ROW_NUMBER() OVER (PARTITION BY t.tournament_id ORDER BY r.players_points_won DESC) AS rank
    FROM
        sddb.registrations r
    JOIN
        sddb.players p ON p.player_id = r.player_id
    JOIN
        sddb.tournaments t ON r.tournament_id = t.tournament_id
)
SELECT
    player_nickname,
    COUNT(tournament_id) AS participation,
    SUM(CASE WHEN rank = 1 THEN 1 ELSE 0 END) AS first_place,
    SUM(CASE WHEN rank = 2 THEN 1 ELSE 0 END) AS second_place,
    SUM(CASE WHEN rank = 3 THEN 1 ELSE 0 END) AS third_place,
    SUM(players_points_won) AS playertotalscore
FROM
    RankedResults
GROUP BY
    player_nickname
order by
    first_place desc;
`;
  pool.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results.rows);
  });
});

app.get('/api/participants', (req, res) => {
  //get the ddb datas
  const sqlQuery = `
  WITH RankedResults AS (
    SELECT
        p.player_nickname,
        t.tournament_id,
        r.players_points_won,
        ROW_NUMBER() OVER (PARTITION BY t.tournament_id ORDER BY r.players_points_won DESC) AS rank
    FROM
        sddb.registrations r
    JOIN
        sddb.players p ON p.player_id = r.player_id
    JOIN
        sddb.tournaments t ON r.tournament_id = t.tournament_id
)
SELECT
    player_nickname,
    COUNT(tournament_id) AS participation,
    SUM(CASE WHEN rank = 1 THEN 1 ELSE 0 END) AS first_place,
    SUM(CASE WHEN rank = 2 THEN 1 ELSE 0 END) AS second_place,
    SUM(CASE WHEN rank = 3 THEN 1 ELSE 0 END) AS third_place,
    SUM(players_points_won) AS playertotalscore
FROM
    RankedResults
GROUP BY
    player_nickname
order by
    first_place desc;
`;
  pool.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results.rows);
  });
});

app.get('/api/seasons', (req, res) => {
  //get the ddb datas
  const sqlQuery = `
SELECT * FROM sddb.seasons
`;
  pool.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results.rows);
  });
});

app.get('/api/season', (req, res) => {
  //get the ddb datas
  var starting_date = req.query.starting_date;

  var inputDate = new Date(starting_date);

  inputDate.setDate(inputDate.getDate() + 1);

  var outputDateString = inputDate.toISOString().split('T')[0];

  const sqlQuery = `
  SELECT
  t.tournament_name,
  COUNT(r.tournament_id) AS nombre_de_participant,
  p.player_nickname AS winner_name
FROM
  sddb.tournaments t
JOIN
  sddb.seasons s ON s.season_id = t.season_id
JOIN
  sddb.registrations r ON r.tournament_id = t.tournament_id
LEFT JOIN (
  SELECT
      tournament_id,
      MAX(players_points_won) AS max_points
  FROM
      sddb.registrations
  GROUP BY
      tournament_id
) AS max_points_subquery ON r.tournament_id = max_points_subquery.tournament_id AND r.players_points_won = max_points_subquery.max_points
LEFT JOIN
  sddb.players p ON r.player_id = p.player_id
WHERE
  s.starting_date = '${outputDateString}'
GROUP BY
  s.season_id,
  t.tournament_id,
  p.player_nickname;
`;
  pool.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results.rows);
  });
});

app.get('/api/tournaments', (req, res) => {
  //get the ddb datas
  const sqlQuery = `
  SELECT t.season_id, t.tournament_name, tt.name, count(r.player_id) as totalplayer
  FROM sddb.tournaments t
  join
  sddb.tournaments_types tt on t.type_id = tt.type_id 
  join 
  sddb.registrations r on t.tournament_id = r.tournament_id 
  group by
  t.season_id, t.tournament_id , tt.name
`;
  pool.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results.rows);
  });
});

app.get('/api/tournament', (req, res) => {
  //get the ddb datas
  var tournamentName = req.query.tournamentName;

  const sqlQuery = `
  SELECT m.match_id, CONCAT(p1.player_nickname, ' vs ', p2.player_nickname) as Players, m.winner_id as Gagnant, m.damages_player1 , m.damages_player2 
  FROM sddb.matches m
  JOIN sddb.players p1 ON player1_id = p1.player_id
  JOIN sddb.players p2 ON player2_id = p2.player_id
  JOIN sddb.tournaments t ON t.tournament_id = m.tournament_id 
  WHERE t.tournament_name = '${tournamentName}'
  GROUP BY m.match_id, p1.player_nickname, p2.player_nickname
`;
  pool.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results.rows);
  });
});

app.get('/api/participantpalmares', (req, res) => {
  //get the ddb datas

  var participantName = req.query.participantName;

  const sqlQuery = `
  WITH RankedResults AS (
    SELECT
        p.player_nickname,
        t.tournament_id,
        t.tournament_name,
        r.players_points_won,
        ROW_NUMBER() OVER (PARTITION BY t.tournament_id ORDER BY r.players_points_won DESC) AS rank
    FROM
        sddb.registrations r
    JOIN
        sddb.players p ON p.player_id = r.player_id
    JOIN
        sddb.tournaments t ON r.tournament_id = t.tournament_id
)
SELECT
    tournament_name,
    rank,
    players_points_won
FROM
    RankedResults
WHERE
    player_nickname = '${participantName}'
ORDER BY
tournament_id, rank;
`;
  pool.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results.rows);
  });
});

app.get('/api/participantsaison', (req, res) => {
  //get the ddb datas

  var participantName = req.query.participantName;

  const sqlQuery = `
  select 
  s.starting_date,
  s.ending_date,
  sum(players_points_won) as total_score_of_season
  from
  sddb.registrations r 
  join
  sddb.players p on r.player_id = p.player_id 
  join
  sddb.tournaments t on r.tournament_id = t.tournament_id 
  join
  sddb.seasons s on t.season_id = s.season_id 
  where 
  p.player_nickname = '${participantName}'
  group by 
  p.player_id, t.season_id, s.starting_date , s.ending_date 
`;
  pool.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results.rows);
  });
});

app.get('/api/participantmatches', (req, res) => {
  //get the ddb datas

  var participantName = req.query.participantName;

  const sqlQuery = `
  select 
  CONCAT(p1.player_nickname, ' vs ', p2.player_nickname) as Players, m.winner_id as Gagnant, m.damages_player1 , m.damages_player2,
  t.tournament_name
  from
  sddb.matches m 
  join
  sddb.tournaments t on m.tournament_id = t.tournament_id 
  join 
  sddb.registrations r on r.tournament_id = t.tournament_id 
  join 
  sddb.players p on p.player_id = r.player_id 
  join
  sddb.players p1 ON player1_id = p1.player_id
  join
  sddb.players p2 ON player2_id = p2.player_id
  where 
  p.player_nickname = '${participantName}'
  group by
  p.player_nickname, match_id, t.tournament_name, p1.player_nickname, p2.player_nickname
  order by match_id  desc
`;
  pool.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results.rows);
  });
});


app.get('/api/participantinfos', (req, res) => {
  //get the ddb datas

  var participantName = req.query.participantName;

  const sqlQuery = `
  WITH RankedResults AS (
    SELECT
        p.player_nickname,
        p.player_name,
        p.player_surname,
        t.tournament_id,
        r.players_points_won,
        RANK() OVER (PARTITION BY t.tournament_id ORDER BY r.players_points_won DESC) AS rank
    FROM
        sddb.registrations r
    JOIN
        sddb.players p ON p.player_id = r.player_id
    JOIN
        sddb.tournaments t ON r.tournament_id = t.tournament_id
)
SELECT
    player_nickname,
    player_name,
    player_surname,
    COUNT(DISTINCT tournament_id) AS participation,
    AVG(rank) AS average_rank,
    SUM(players_points_won) AS playertotalscore
FROM
    RankedResults
    where 
    player_nickname = '${participantName}'
GROUP BY
    player_nickname, player_name, player_surname
ORDER BY
    average_rank;
`;
  pool.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.json(results.rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});