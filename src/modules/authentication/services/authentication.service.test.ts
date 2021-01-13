import { AuthenticationService } from "./authentication.service";
import { getDBInstance } from "../../db";
import { compare } from "bcrypt";

jest.mock("fs", () => ({
    readFileSync: jest.fn(),
}));

jest.mock("../../db", () => ({
    getDBInstance: jest.fn(() => ({
        pool: {
            query: jest.fn(() => Promise.resolve({
                rows: [],
            })),
        },
    })),
}));

jest.mock("path", () => ({
    join: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(() => Promise.resolve("JWT")),
    verify: jest.fn(),
}));

jest.mock("bcrypt", () => ({
    compare: jest.fn(() => Promise.reject(false)),
    genSalt: jest.fn(() => Promise.resolve("salt")),
    hash: jest.fn(),
}));

describe("authentication.service", () => {
    let auth: any;
    beforeEach(() => {
        auth = new AuthenticationService({});
        jest.clearAllMocks();
    });

    describe("login",  () => {
        it("should return error if no user found", async () => {
            await expect(  auth.login("some@email.com", "password")).rejects.toEqual(Error("No user found"));
        });

        it("should return error if user password in invalid", async () => {
            (getDBInstance as jest.Mock).mockImplementationOnce(() => ({
                pool: {
                    query: jest.fn(() => Promise.resolve({
                        rows: [{
                            email: "some@email.com",
                            password: "password",
                        }],
                    })),
                },
            }));

            (compare as jest.Mock).mockImplementationOnce(() => Promise.resolve(false));
            await expect(  auth.login("some@email.com", "password")).rejects.toEqual(Error("invalid password"));
        });

        it("should return JWT is user logins properly", async () => {
            (getDBInstance as jest.Mock).mockImplementationOnce(() => ({
                pool: {
                    query: jest.fn(() => Promise.resolve({
                        rows: [{
                            email: "some@email.com",
                            password: "password",
                        }],
                    })),
                },
            }));

            (compare as jest.Mock).mockImplementationOnce(() => Promise.resolve(true));
            await expect(  auth.login("some@email.com", "password")).resolves.toEqual("JWT");
        });
    });
});
