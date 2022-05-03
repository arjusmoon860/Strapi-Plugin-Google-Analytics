'use strict';

const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

module.exports = ({ strapi }) => ({
  async getGoogleCredentials() {
    let data = await strapi.db.query('plugin::strapi-plugin-google-analytics.google-credential').findOne();
    return data;
  },

  makeRandomPassword(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  },

  createGoogleCredentials(data) {
    return new Promise(async (resolve, reject) => {
      try {
        let credentials = await this.getGoogleCredentials();
        if (!credentials) {
          await strapi.db.query('plugin::strapi-plugin-google-analytics.google-credential').create({
            data
          });
        } else {
          await strapi.db.query('plugin::strapi-plugin-google-analytics.google-credential').update({
            where: { id: credentials.id },
            data
          });
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    })
  },

  createConnection(clientId, clientSecret, redirect) {
    return new google.auth.OAuth2(clientId, clientSecret, redirect);
  },

  getConnectionUrl(auth, scopes) {
    return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes
    });
  },

  createAuthURL() {
    return new Promise(async (resolve, reject) => {
      try {
        let credentials = await this.getGoogleCredentials();
        console.log(credentials)
        if (!credentials) {
          return reject({ error: true, message: "Add credentials to activate the login feature." })
        }

        let scopesData = credentials.google_scopes;
        if (!scopesData) {
          return reject({ error: true, message: "Invalid/missing scopes" })
        }
        let scopesObject = JSON.parse(scopesData);
        let scopes = scopesObject.scopes;

        if (!scopes || !scopes.length) {
          return reject({ error: true, message: "Invalid/missing scopes" })
        }

        const { google_client_id, google_client_secret, google_redirect_url, google_scopes } = credentials;
        if (!google_client_id || !google_client_secret || !google_redirect_url || !google_scopes) {
          return reject({ error: true, message: "Missing credentials" });
        }

        const auth = this.createConnection(google_client_id, google_client_secret, google_redirect_url);
        const connectonURL = this.getConnectionUrl(auth, scopes);
        resolve({ url: connectonURL })
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  },

  getUserProfile(code) {
    return new Promise(async (resolve, reject) => {
      try {
        let credentials = await this.getGoogleCredentials();
        if (!credentials) {
          return reject({ error: true, message: "Add credentials to activate the login feature." })
        }

        const { google_client_id, google_client_secret, google_redirect_url, google_scopes } = credentials;
        if (!google_client_id || !google_client_secret || !google_redirect_url || !google_scopes) {
          return reject({ error: true, message: "Missing credentials" });
        }

        const oAuthClient = this.createConnection(google_client_id, google_client_secret, google_redirect_url);
        const tokens = await oAuthClient.getToken(code);
        const { access_token, refresh_token } = tokens.tokens;

        await strapi.db.query('plugin::strapi-plugin-google-analytics.google-credential').update({
          where: { id: credentials.id },
          data: {
            access_token,
            refresh_token
          }
        });

        resolve();
      } catch (error) {
        console.log(error);
        reject(error);
      }
    })
  }
});
