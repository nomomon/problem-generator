import postgres from "postgres";

export type TopicData = {
  id: number;
  name: string;
  createdAt: string;
};

export async function getOrCreateTopics(
  sql: postgres.Sql,
  topicNames: string[],
): Promise<TopicData[]> {
  if (topicNames.length === 0) return [];

  // First, try to find existing topics
  const existingTopics = await sql<TopicData[]>`
    SELECT id, name, created_at as "createdAt"
    FROM topics 
    WHERE name = ANY(${topicNames})
  `;

  // Find which topics need to be created
  const existingNames = existingTopics.map((t) => t.name);
  const newTopicNames = topicNames.filter(
    (name) => !existingNames.includes(name),
  );

  // Create new topics if needed
  let newTopics: TopicData[] = [];
  if (newTopicNames.length > 0) {
    newTopics = await sql<TopicData[]>`
      INSERT INTO topics (name)
      VALUES ${sql(newTopicNames.map((name) => ({ name })))}
      ON CONFLICT (name) DO NOTHING
      RETURNING id, name, created_at as "createdAt"
    `;

    // If some topics already existed due to race conditions, fetch them
    if (newTopics.length < newTopicNames.length) {
      const missingNames = newTopicNames.filter(
        (name) => !newTopics.some((t) => t.name === name),
      );
      const existingNewTopics = await sql<TopicData[]>`
        SELECT id, name, created_at as "createdAt"
        FROM topics 
        WHERE name = ANY(${missingNames})
      `;
      newTopics = [...newTopics, ...existingNewTopics];
    }
  }

  return [...existingTopics, ...newTopics];
}

export async function updateProblemTopics(
  sql: postgres.Sql,
  problemId: number,
  topicNames: string[],
): Promise<void> {
  // Remove existing topic associations
  await sql`
    DELETE FROM problem_topics 
    WHERE problem_id = ${problemId}
  `;

  if (topicNames.length === 0) return;

  // Get or create topics
  const topics = await getOrCreateTopics(sql, topicNames);

  // Create new associations
  const associations = topics.map((topic) => ({
    problemId,
    topicId: topic.id,
  }));

  await sql`
    INSERT INTO problem_topics (problem_id, topic_id)
    VALUES ${sql(associations.map((a) => [a.problemId, a.topicId]))}
  `;
}

export async function getProblemTopics(
  sql: postgres.Sql,
  problemId: number,
): Promise<string[]> {
  const result = await sql<{ name: string }[]>`
    SELECT t.name
    FROM topics t
    INNER JOIN problem_topics pt ON t.id = pt.topic_id
    WHERE pt.problem_id = ${problemId}
    ORDER BY t.name
  `;

  return result.map((r) => r.name);
}
