// src/lib/google/gmail.ts
import { gmail } from './auth';
import { encode } from 'base-64';

export const gmailService = {
  async sendEmail(to: string, subject: string, body: string) {
    try {
      const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
      const messageParts = [
        `To: ${to}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        `Subject: ${utf8Subject}`,
        '',
        body,
      ];
      const message = messageParts.join('\n');
      const encodedMessage = encode(message);

      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: encodedMessage,
        },
      });
    } catch (error) {
      console.error('Gmail send error:', error);
      throw error;
    }
  },
};