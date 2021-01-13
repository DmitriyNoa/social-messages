"use strict";

import {readFileSync} from "fs";
import {join} from "path";
import { SignOptions, sign, verify, VerifyOptions } from "jsonwebtoken";
import { generalConfig } from "../../config/general";
import { getDBInstance } from "../../db";
import { compare, genSalt, hash } from "bcrypt";
import { AppError } from "../../common/utils/error-handler";
import {IUser} from "../../users/interfaces/user";
const privateKeyPath = join(process.cwd(), generalConfig.env.PRIVATE_KEY_PATH);
const publicKeyPath = join(process.cwd(),  generalConfig.env.PUBLIC_KEY_PATH);
const sshDefaultPrivateKey = readFileSync(privateKeyPath, "utf-8");
const sshDefaultPublicKey = readFileSync(publicKeyPath, "utf-8");

class AuthenticationService {

    private static signOptions: SignOptions = {
        algorithm: "RS256",
        audience: "c-universe",
        expiresIn: "12h",
        issuer: "c-universe",
    };

    private static verifyOptions: VerifyOptions = {
        audience: "c-universe",
        issuer: "c-universe",
    };

    constructor(public userModel?: any,
                private readonly sshPrivateKey: string = sshDefaultPrivateKey,
                private readonly sshPublicKey: string = sshDefaultPublicKey) {
        this.sshPrivateKey = sshPrivateKey;
        this.sshPublicKey = sshPublicKey;
        this.userModel = userModel;
    }

    public async checkToken(token: string) {
        return verify(token, this.sshPublicKey, AuthenticationService.verifyOptions);
    }

    public async getUserID(authString: string): Promise<string> {
        const token = authString.replace("Bearer ", "");
        const decoded = await this.decodeToken(token);
        return decoded.id;
    }

    public async login(email: string, password: string): Promise<string> {

        const db = getDBInstance();
        const user = await db.pool.query(`SELECT id, first_name,
                                                                  last_name,
                                                                  password,
                                                                  email FROM users WHERE email=$1`, [email]);
        if (user.rows.length === 0) {
            return Promise.reject(new AppError(401, "No user found"));
        }
        const userData = user.rows[0];
        const isValid = await this.checkUserCredentials(userData, password);

        if (!isValid) {
            return Promise.reject(new AppError(401, "invalid password", null));
        }

        delete userData.password;

        return this.signToken(userData);
    }

    public async checkUserCredentials(user: IUser, password: string): Promise<boolean> {
        return this.isSamePassword(password, user.password);
    }

    public signToken(payload: any) {
        return sign(payload, this.sshPrivateKey, AuthenticationService.signOptions);
    }

    public async hashPassword(password: string): Promise<string> {
        const salt = await genSalt(10);
        const hashed = await hash(password, salt);
        return hashed;
    }

    private async isSamePassword(password: string, encrypted: string): Promise<boolean> {
        return compare(password, encrypted);
    }

    private async decodeToken(token: string): Promise<any> {
        return verify(token, this.sshPublicKey, AuthenticationService.verifyOptions);
    }
}

export  {
    AuthenticationService,
};
