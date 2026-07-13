import pg from "pg";

export const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Expenses",
  password: "123456",
  port: 5432,
});