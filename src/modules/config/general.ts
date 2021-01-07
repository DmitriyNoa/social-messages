"use strict";

interface IConfig {
    rateLimiter: {
        windowMs: number;
        max: number;
    };
    env: {
        PRIVATE_KEY_PATH: string;
        PUBLIC_KEY_PATH: string;
        DB_NAME: string;
        DB_USER: string;
        DB_URI: string;
        DB_PASS: string;
        DB_PORT: number;
        PORT: number;
        NODE_ENV: string;
    };
}
const generalConfig: IConfig = {
    rateLimiter: {
        windowMs: 5 * 60 * 1000, // 15 minutes
        max: 1000, // limit each IP to 100 requests per windowMs
    },
    env: {
        PRIVATE_KEY_PATH: process.env.PRIVATE_KEY_PATH || "",
        PUBLIC_KEY_PATH: process.env.PUBLIC_KEY_PATH || "",
        DB_NAME: process.env.DB_NAME || "",
        DB_USER: process.env.DB_USER || "",
        DB_URI: process.env.DB_URI || "",
        DB_PASS: process.env.DB_PASS || "",
        DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
        PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
        NODE_ENV: process.env.NODE_ENV || "development",
    },
};

export  {
    generalConfig,
};
