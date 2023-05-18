const getLeaderboard = `
  SELECT t.team_name AS name,
  SUM(CASE 
  WHEN m.home_team_goals > m.away_team_goals THEN 3
  WHEN m.home_team_goals = m.away_team_goals THEN 1
  ELSE 0 END) as totalPoints,
  COUNT(*) as totalGames,
  COUNT(CASE
  WHEN m.home_team_goals > m.away_team_goals THEN 1
  ELSE null END) as totalVictories,
  COUNT(CASE
  WHEN m.home_team_goals = m.away_team_goals THEN 1
  ELSE null END) as totalDraws,
  COUNT(CASE
  WHEN m.home_team_goals < m.away_team_goals THEN 1
  ELSE null END) as totalLosses,
  SUM(m.home_team_goals) AS goalsFavor,
  SUM(m.away_team_goals) AS goalsOwn
  FROM matches AS m
  JOIN teams AS t
  ON t.id = m.home_team_id
  WHERE m.in_progress = false
  GROUP BY t.team_name`;

export default getLeaderboard;
