"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
var adapter_libsql_1 = require("@prisma/adapter-libsql");
var client_1 = require("@/app/generated/prisma-client/client");
var globalForPrisma = globalThis;
function createPrismaClient() {
    var databaseUrl = process.env.TURSO_DATABASE_URL;
    var authToken = process.env.TURSO_AUTH_TOKEN;
    if (!databaseUrl) {
        throw new Error("TURSO_DATABASE_URL no está configurada.");
    }
    if (!authToken) {
        throw new Error("TURSO_AUTH_TOKEN no está configurada.");
    }
    var adapter = new adapter_libsql_1.PrismaLibSql({
        url: databaseUrl,
        authToken: authToken,
    });
    return new client_1.PrismaClient({ adapter: adapter });
}
exports.prisma = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : createPrismaClient();
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = exports.prisma;
}
