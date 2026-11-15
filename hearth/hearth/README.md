# Hearth
1. Make a free Postgres DB at neon.tech (copy the connection string).
2. Push this folder to a GitHub repo.
3. On render.com: New > Web Service > your repo. Build: `npm install`, Start: `npm start`.
4. Env vars: DATABASE_URL, JWT_SECRET (32+ random chars), NODE_ENV=production.
5. The FIRST account to sign up becomes admin. Sign up yourself right away.
Local: DATABASE_URL=... JWT_SECRET=... npm start
Voice uses WebRTC (STUN only): works for small groups on most networks; strict NATs may need a free TURN service added in app.js.
Fresh DB recommended; existing users are auto-joined to the "Hearth Lounge" server on start.
