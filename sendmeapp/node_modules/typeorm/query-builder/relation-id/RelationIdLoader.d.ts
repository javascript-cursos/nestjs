import { RelationIdAttribute } from "./RelationIdAttribute";
import { Connection } from "../../connection/Connection";
import { RelationIdLoadResult } from "./RelationIdLoadResult";
import { QueryRunner } from "../../query-runner/QueryRunner";
export declare class RelationIdLoader {
    protected connection: Connection;
    protected queryRunner: QueryRunner | undefined;
    protected relationIdAttributes: RelationIdAttribute[];
    constructor(connection: Connection, queryRunner: QueryRunner | undefined, relationIdAttributes: RelationIdAttribute[]);
    load(rawEntities: any[]): Promise<RelationIdLoadResult[]>;
    /**
     * Builds column alias from given alias name and column name,
     * If alias length is more than 29, abbreviates column name.
     */
    protected buildColumnAlias(aliasName: string, columnName: string): string;
}
