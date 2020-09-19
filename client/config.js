// Central place for extracing configs from next.config.js

import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
export const APP_NAME = publicRuntimeConfig.TUT_SHARE;
export const API = publicRuntimeConfig.API;
export const PRODUCTION = publicRuntimeConfig.PRODUCTION;
export const DOMAIN = publicRuntimeConfig.DOMAIN;
export const FB_APP_ID = publicRuntimeConfig.FB_APP_ID;
