"use strict";

import { DbService } from "./db.service";

let DBInstance: any;

function getDBInstance(): DbService {
    if (!DBInstance) {
        DBInstance = new DbService();
    }
    return DBInstance;
}

export {
    getDBInstance,
};
