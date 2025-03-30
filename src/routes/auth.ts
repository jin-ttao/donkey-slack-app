import express from 'express';
import { CONFIG } from '../config';
import { User } from '../models/User';

interface GoogleTokenResponse {
  access_token: string;
}

interface GoogleUserInfo {
  email: string;
  name: string;
  id: string;
}

const router = express.Router();

router.get('/google/callback', async (req, res) => {
  const { code, state } = req.query;
  
  if (!state) {
    throw new Error('State parameter is missing');
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: CONFIG.GOOGLE.CLIENT_ID,
        client_secret: CONFIG.GOOGLE.CLIENT_SECRET,
        redirect_uri: `${CONFIG.BASE_URL}/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    const { access_token } = await tokenResponse.json() as GoogleTokenResponse;

    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { email, name, id: googleId } = await userInfoResponse.json() as GoogleUserInfo;

    const [teamId] = state.toString().split(':');

    await User.findOneAndUpdate(
      { googleId },
      {
        email,
        name,
        googleId,
        $addToSet: { workspaces: teamId },
      },
      { upsert: true, new: true }
    );

    res.send('로그인이 완료되었습니다. 이 창을 닫고 Slack으로 돌아가세요.');
  } catch (error) {
    console.error('Google OAuth Error:', error);
    res.status(500).send('로그인 중 오류가 발생했습니다.');
  }
});

export default router; 
