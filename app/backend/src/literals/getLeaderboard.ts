const getLeaderboard = `
SELECT name,
SUM(totalPoints) AS totalPoints,
SUM(totalGames) AS totalGames,
SUM(totalVictories) AS totalVictories,
SUM(totalDraws) AS totalDraws,
SUM(totalLosses) AS totalLosses,
SUM(goalsFavor) AS goalsFavor,
SUM(goalsOwn) AS goalsOwn,
SUM(goalsBalance) AS goalsBalance,
CAST(SUM(totalPoints) * 100 / (SUM(totalGames) * 3) AS DECIMAL(10,2)) AS efficiency FROM (
  SELECT t.team_name AS name,
  SUM(CASE 
    WHEN m.home_team_goals > m.away_team_goals THEN 3
    WHEN m.home_team_goals = m.away_team_goals THEN 1
    ELSE 0 END) AS totalPoints,
  COUNT(*) as totalGames,
  COUNT(CASE
    WHEN m.home_team_goals > m.away_team_goals THEN 1
    ELSE null END) AS totalVictories,
  COUNT(CASE
    WHEN m.home_team_goals = m.away_team_goals THEN 1
    ELSE null END) AS totalDraws,
  COUNT(CASE
    WHEN m.home_team_goals < m.away_team_goals THEN 1
    ELSE null END) as totalLosses,
  SUM(m.home_team_goals) AS goalsFavor,
  SUM(m.away_team_goals) AS goalsOwn,
  SUM(m.home_team_goals) - SUM(m.away_team_goals) as goalsBalance,
  CAST(SUM(CASE 
    WHEN m.home_team_goals > m.away_team_goals THEN 3
    WHEN m.home_team_goals = m.away_team_goals THEN 1
    ELSE 0 END) / (COUNT(*) * 3) * 100 AS DECIMAL(10,2)) as efficiency
  FROM matches AS m
  JOIN teams AS t
  ON t.id = m.home_team_id
  WHERE m.in_progress = false
  GROUP BY t.team_name
  UNION
  SELECT t.team_name AS name,
  SUM(CASE 
    WHEN m.home_team_goals < m.away_team_goals THEN 3
    WHEN m.home_team_goals = m.away_team_goals THEN 1
    ELSE 0 END) as totalPoints,
  COUNT(*) as totalGames,
  COUNT(CASE
    WHEN m.home_team_goals < m.away_team_goals THEN 1
    ELSE null END) AS totalVictories,
  COUNT(CASE
    WHEN m.home_team_goals = m.away_team_goals THEN 1
    ELSE null END) AS totalDraws,
  COUNT(CASE
    WHEN m.home_team_goals > m.away_team_goals THEN 1
    ELSE null END) AS totalLosses,
  SUM(m.away_team_goals) AS goalsFavor,
  SUM(m.home_team_goals) AS goalsOwn,
  SUM(m.away_team_goals) - SUM(m.home_team_goals) as goalsBalance,
  (SUM(CASE 
    WHEN m.home_team_goals < m.away_team_goals THEN 3
    WHEN m.home_team_goals = m.away_team_goals THEN 1
    ELSE 0 END) / (COUNT(*) * 3) * 100) as efficiency
  FROM matches AS m
  JOIN teams AS t
  ON t.id = m.away_team_id
  WHERE m.in_progress = false
  GROUP BY t.team_name ) AS leaderboard
GROUP BY name
ORDER BY totalPoints DESC, totalVictories DESC, goalsBalance DESC, goalsFavor DESC;`;

export default getLeaderboard;
