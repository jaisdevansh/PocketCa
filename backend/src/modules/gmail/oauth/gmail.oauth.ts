import { google } from 'googleapis';
import { gmailConfig } from '../../../config/gmail.config';

export class GmailOAuth {
  private static createClient() {
    return new google.auth.OAuth2(
      gmailConfig.GOOGLE_CLIENT_ID,
      gmailConfig.GOOGLE_CLIENT_SECRET,
      gmailConfig.GOOGLE_REDIRECT_URI
    );
  }

  static getAuthUrl(userId: string) {
    const oauth2Client = this.createClient();
    return oauth2Client.generateAuthUrl({
      access_type: 'offline', // Request a refresh token
      prompt: 'consent', // Force consent screen to guarantee refresh token
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/userinfo.email',
      ],
      state: userId, // Pass userId to callback to link the account
    });
  }

  static async getTokensFromCode(code: string) {
    const oauth2Client = this.createClient();
    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  }

  static async getUserProfile(accessToken: string) {
    const oauth2Client = this.createClient();
    oauth2Client.setCredentials({ access_token: accessToken });
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    return userInfo.data.email;
  }

  static getAuthenticatedClient(refreshToken: string) {
    const oauth2Client = this.createClient();
    oauth2Client.setCredentials({ refresh_token: refreshToken });
    return oauth2Client;
  }
}
