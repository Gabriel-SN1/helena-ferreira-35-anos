/** @typedef {{id: string, name: string, createdAt: string}} Confirmation */
/** @typedef {(text: string, values?: unknown[]) => Promise<Record<string, unknown>[]>} Query */

// Both statements use parameter binding; guest names never become SQL code.
/** @param {Query} query */
export function confirmationRepository(query) {
  return {
    /** @param {{id: string, name: string}} guest */
    async save({ id, name }) {
      await query(
        `INSERT INTO confirmations (id, name) VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`,
        [id, name],
      );
    },
    /** @returns {Promise<Confirmation[]>} */
    async list() {
      const rows = await query(
        'SELECT id, name, created_at FROM confirmations ORDER BY created_at DESC, id',
      );
      return rows.map((row) => ({
        id: String(row.id),
        name: String(row.name),
        createdAt: new Date(/** @type {string} */ (row.created_at)).toISOString(),
      }));
    },
  };
}
