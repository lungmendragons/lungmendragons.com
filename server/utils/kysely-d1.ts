// A patched version of the kysely-d1 package https://github.com/aidenwallis/kysely-d1
// this should work correctly in dev mode. This also uses a custom introspector
// to not read a private `_cf_METADATA` table that exists in D1.

import {
  CompiledQuery,
  DatabaseConnection,
  DatabaseIntrospector,
  Dialect,
  Driver,
  Kysely,
  SqliteAdapter,
  SqliteQueryCompiler,
  QueryCompiler,
  QueryResult,
  DatabaseMetadata,
  DatabaseMetadataOptions,
  SchemaMetadata,
  TableMetadata,
  QueryCreator,
  sql,
  DEFAULT_MIGRATION_TABLE,
  DEFAULT_MIGRATION_LOCK_TABLE,
} from "kysely";

export interface D1DialectConfig {
  database: D1Database;
}

export class D1Dialect implements Dialect {
  #config: D1DialectConfig;

  constructor(config: D1DialectConfig) {
    this.#config = config;
  }

  createAdapter() {
    return new SqliteAdapter();
  }

  createDriver(): Driver {
    return new D1Driver(this.#config);
  }

  createQueryCompiler(): QueryCompiler {
    return new SqliteQueryCompiler();
  }

  createIntrospector(db: Kysely<any>): DatabaseIntrospector {
    return new D1Introspector(db);
  }
}

class D1Introspector implements DatabaseIntrospector {
  #db: Kysely<any>;
  constructor(db: Kysely<any>) {
    this.#db = db;
  }

  async getSchemas(): Promise<SchemaMetadata[]> {
    return [];
  }
  async getTables(
    options: DatabaseMetadataOptions = { withInternalKyselyTables: false },
  ): Promise<TableMetadata[]> {
    return await this.#getTableMetadata(options)
  }
  async getMetadata(
    options?: DatabaseMetadataOptions,
  ): Promise<DatabaseMetadata> {
    return {
      tables: await this.getTables(options),
    }
  }
  #tablesQuery(
    qb: QueryCreator<any> | Kysely<any>,
    options: DatabaseMetadataOptions,
  ) {
    let tablesQuery = qb
      .selectFrom("sqlite_master")
      .where("type", "in", ["table", "view"])
      .where("name", "not like", "sqlite_%")
      .where("name", "!=", "_cf_METADATA")
      .select(["name", "sql", "type"])
      .orderBy("name")

    if (!options.withInternalKyselyTables) {
      tablesQuery = tablesQuery
        .where("name", "!=", DEFAULT_MIGRATION_TABLE)
        .where("name", "!=", DEFAULT_MIGRATION_LOCK_TABLE)
    }
    return tablesQuery
  }

  async #getTableMetadata(
    options: DatabaseMetadataOptions,
  ): Promise<TableMetadata[]> {
    const tablesResult = await this.#tablesQuery(this.#db, options).execute()

    const tableMetadata = await this.#db
      .with("table_list", (qb) => this.#tablesQuery(qb, options))
      .selectFrom([
        "table_list as tl",
        sql`pragma_table_info(tl.name)`.as("p"),
      ])
      .select([
        "tl.name as table",
        "p.cid",
        "p.name",
        "p.type",
        "p.notnull",
        "p.dflt_value",
        "p.pk",
      ])
      .orderBy("tl.name")
      .orderBy("p.cid")
      .execute()

    const columnsByTable: Record<string, typeof tableMetadata> = {}
    for (const row of tableMetadata) {
      columnsByTable[row.table] ??= []
      columnsByTable[row.table].push(row)
    }

    return tablesResult.map(({ name, sql, type }) => {
      // // Try to find the name of the column that has `autoincrement` 🤦
      let autoIncrementCol = sql
        ?.split(/[\(\),]/)
        ?.find((it: string) => it.toLowerCase().includes("autoincrement"))
        ?.trimStart()
        ?.split(/\s+/)?.[0]
        ?.replace(/["`]/g, "")

      const columns = columnsByTable[name] ?? []

      // Otherwise, check for an INTEGER PRIMARY KEY
      // https://www.sqlite.org/autoinc.html
      if (!autoIncrementCol) {
        const pkCols = columns.filter((r) => r.pk > 0)
        if (pkCols.length === 1 && pkCols[0].type.toLowerCase() === "integer") {
          autoIncrementCol = pkCols[0].name
        }
      }

      return {
        name: name,
        isView: type === "view",
        columns: columns.map((col) => ({
          name: col.name,
          dataType: col.type,
          isNullable: !col.notnull,
          isAutoIncrementing: col.name === autoIncrementCol,
          hasDefaultValue: col.dflt_value != null,
          comment: undefined,
        })),
      }
    })
  }
}

class D1Driver implements Driver {
  #config: D1DialectConfig;

  constructor(config: D1DialectConfig) {
    this.#config = config;
  }

  async init(): Promise<void> { }

  async acquireConnection(): Promise<DatabaseConnection> {
    return new D1Connection(this.#config);
  }

  async beginTransaction(conn: D1Connection): Promise<void> {
    return await conn.beginTransaction();
  }

  async commitTransaction(conn: D1Connection): Promise<void> {
    return await conn.commitTransaction();
  }

  async rollbackTransaction(conn: D1Connection): Promise<void> {
    return await conn.rollbackTransaction();
  }

  async releaseConnection(_conn: D1Connection): Promise<void> { }

  async destroy(): Promise<void> { }
}

class D1Connection implements DatabaseConnection {
  #config: D1DialectConfig;
  //   #transactionClient?: D1Connection

  constructor(config: D1DialectConfig) {
    this.#config = config;
  }

  async executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>> {
    // Transactions are not supported yet.
    // if (this.#transactionClient) return this.#transactionClient.executeQuery(compiledQuery)

    const results = await this.#config.database
      .prepare(compiledQuery.sql)
      .bind(...compiledQuery.parameters)
      .all();
    if (results.error) {
      throw new Error(results.error);
    }

    const numAffectedRows = results.meta.changes > 0 ? BigInt(results.meta.changes) : undefined;

    return {
      insertId:
        results.meta.last_row_id === undefined || results.meta.last_row_id === null
          ? undefined
          : BigInt(results.meta.last_row_id),
      rows: (results?.results as O[]) || [],
      numAffectedRows,
    };
  }

  async beginTransaction() {
    throw new Error("Transactions are not supported yet.");
  }

  async commitTransaction() {
    throw new Error("Transactions are not supported yet.");
  }

  async rollbackTransaction() {
    throw new Error("Transactions are not supported yet.");
  }

  async *streamQuery<O>(_compiledQuery: CompiledQuery, _chunkSize: number): AsyncIterableIterator<QueryResult<O>> {
    throw new Error("D1 Driver does not support streaming");
  }
}