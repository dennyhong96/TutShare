import getConfig from "next/config";

// So we dont have to use getConfig() everytime we need config
const { publicRuntimeConfig } = getConfig();

export const APP_NAME = publicRuntimeConfig.TUT_SHARE;
export const API = publicRuntimeConfig.API;
export const PRODUCTION = publicRuntimeConfig.PRODUCTION;
export const DOMAIN = publicRuntimeConfig.DOMAIN;
export const FB_APP_ID = publicRuntimeConfig.FB_APP_ID;
