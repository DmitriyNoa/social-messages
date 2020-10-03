interface Config {
    rateLimiter: {
        windowMs: number;
        max: number;
    },
    env: {
        PRIVATE_KEY_PATH: string;
        PUBLIC_KEY_PATH: string;
        DB_NAME: string;
        DB_USER: string;
        DB_URI: string;
        DB_PASS: string;
    }
}
const generalConfig: Config = {
    rateLimiter: {
        windowMs: 5 * 60 * 1000, // 15 minutes
        max: 1000 // limit each IP to 100 requests per windowMs
    },
    env: {
        PRIVATE_KEY_PATH: process.env.PRIVATE_KEY_PATH || "",
        PUBLIC_KEY_PATH: process.env.PUBLIC_KEY_PATH || "",
        DB_NAME: process.env.DB_NAME || "",
        DB_USER: process.env.DB_USER || "",
        DB_URI: process.env.DB_URI || "",
        DB_PASS: process.env.DB_PASS || "",
    }
};

export  {
    generalConfig
};
