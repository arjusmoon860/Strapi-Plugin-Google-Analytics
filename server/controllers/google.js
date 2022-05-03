'use strict';

const { ValidationError } = require('@strapi/utils').errors;

module.exports = {
    async getCredentials(ctx) {
        ctx.body = await strapi
            .plugin('strapi-plugin-google-analytics')
            .service('google')
            .getGoogleCredentials();
    },
    async createCredentials(ctx) {
        try {
            await strapi
                .plugin('strapi-plugin-google-analytics')
                .service('google')
                .createGoogleCredentials(ctx.request.body);

            ctx.body = { status: true }
        } catch (error) {
            console.log(error)
            ctx.body = { status: false }
        }
    },
    async initLogin(ctx) {
        try {
            let loginURL = await strapi
                .plugin('strapi-plugin-google-analytics')
                .service('google')
                .createAuthURL();
            ctx.body = loginURL
        } catch (error) {
            ctx.badRequest("Error fetching the Login URL", null);
        }
    },
    async getUserProfile(ctx) {
        try {
            const code = ctx.request.body.code ? ctx.request.body.code : null;
            if (!code) {
                throw new ValidationError("Invalid/Missing auth code", null);
            }

            let user = await strapi
                .plugin('strapi-plugin-google-analytics')
                .service('google')
                .getUserProfile(code);

            ctx.body = user;
        } catch (error) {
            ctx.badRequest("Error occured while fetching the user profile", null);
        }
    },
    async handleGoogleRedirect(ctx) {
        try {
            const code = ctx.request.query.code ? ctx.request.query.code : null;
            if (!code) {
                throw new ValidationError("Invalid/Missing auth code", null);
            }
            await strapi
                .plugin('strapi-plugin-google-analytics')
                .service('google')
                .getUserProfile(code);

            ctx.redirect("/admin/settings/google-analytics/configuration");
            return;
        } catch (error) {
            ctx.badRequest("Error occured while fetching the user profile", null);
        }
    },
    async fetchAnalyticsData(ctx) {
        try {
            ctx.body = "ok";
        } catch (error) {
            ctx.badRequest("Unable to fetch the data", null);
        }
    }
};
