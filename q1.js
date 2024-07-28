const getRecommendations = async (userId, db) => {
    const userProfile = await db.query(`
      SELECT gender, location, university, interests
      FROM users
      WHERE id = ?
    `, [userId]);
  
    const { gender, location, university, interests } = userProfile[0];
  
    // Assuming we're looking for opposite gender
    const oppositeGender = gender === 'male' ? 'female' : 'male';
  
    const query = `
      SELECT u.id, u.name, u.gender, u.location, u.university, u.interests,
             (CASE
               WHEN u.university = ? THEN 30
               ELSE 0
             END +
             (CASE
               WHEN u.interests LIKE ? THEN 20
               ELSE 0
             END) +
             (CASE
               WHEN u.location = ? THEN 10
               ELSE 0
             END) +
             RAND() * 40) AS score
      FROM users u
      LEFT JOIN matches m ON (m.user1_id = ? AND m.user2_id = u.id) OR (m.user1_id = u.id AND m.user2_id = ?)
      WHERE u.gender = ?
        AND u.id != ?
        AND m.id IS NULL
      ORDER BY score DESC
      LIMIT 10
    `;
  
    const recommendations = await db.query(query, [
      university,
      `%${interests}%`,
      location,
      userId,
      userId,
      oppositeGender,
      userId
    ]);
  
    return recommendations;
  };