"use strict";

import { Router } from "express";
import {usersRoute} from "../modules/users/routes/users-route";

import pageNotFoundRoute from "./page-not-found-404-route";
import indexController from "../controllers/index-controller";
import { ROUTES } from "../constants/index";

import { authMiddleware } from "../modules/authentication/middlewares/authentication-middleware";
import { authenticationRoute, AuthenticationService, AUTHENTICATION_CONSTANTS } from "../modules/authentication";
import { USERS_CONSTANTS } from "../modules/users";


interface AppRouterProps {
    authService: AuthenticationService;
}

const router = Router();
function appRouter({authService}: AppRouterProps) {
    router.get(ROUTES.INDEX, authMiddleware(authService), indexController);
    router.use(USERS_CONSTANTS.ROUTES.INDEX, usersRoute);
    router.use(AUTHENTICATION_CONSTANTS.ROUTES.INDEX, authenticationRoute);
    router.use(pageNotFoundRoute);
    return router;
}

export default appRouter;
