# Hearth
1. Make a free Postgres DB at neon.tech (copy the connection string).
2. Push this folder to a GitHub repo.
3. On render.com: New > Web Service > your repo. Build: `npm install`, Start: `npm start`.
4. Env vars: DATABASE_URL, JWT_SECRET (32+ random chars), NODE_ENV=production.
5. The FIRST account to sign up becomes admin. Sign up yourself right away.
Local: DATABASE_URL=... JWT_SECRET=... npm start
Voice uses WebRTC (STUN only): works for small groups on most networks; strict NATs may need a free TURN service added in app.js.
Fresh DB recommended; existing users are auto-joined to the "Hearth Lounge" server on start.

## What's new
New columns and tables are created automatically on start (safe on an existing DB). No new npm packages.

**Display name styles** (User settings > Display name style): 12 fonts x 7 effects (Solid, Gradient, Neon, Toon, Pop, Gummy, Prism) x colors,
with a live preview. Shows on messages, replies, the member list, @autocomplete and profile cards.
Fonts are free SIL-OFL fonts self-hosted in `public/fonts` (see `public/fonts/LICENSES.txt`); add or swap one in `NF` in `public/features.js`
AND in the `FONTS` list in `features.js` on the server (the server only accepts listed ids).

**Pings**: type `@` for member autocomplete (Up/Down, Tab or Enter). Mentions are resolved on the server, so they can't be faked.
`@everyone` / `@here` work for the server owner and staff. Replying also pings the author. You get a yellow highlight on messages that ping you,
red badges on channels, DMs and server icons, and a `(n)` in the tab title while the tab is hidden. (Unread/ping counts reset on page reload.)

**Message actions**: hover a message for the quick bar; hold **Shift** while hovering for Copy / Pin / Delete; **right-click** for the full menu.
Shift+click on Delete skips the confirmation. Reply, edit (also: press Up in an empty box), delete, reactions, pins (header pin button lists them).
Pinning is for the server owner and staff in servers, and for either person in a DM.

**Also**: markdown (`**bold**`, `*italic*`, `__underline__`, `~~strike~~`, `` `code` ``, code blocks, `> quote`, `||spoiler||`, links),
Shift+Enter for a new line, typing indicator.

## UI revamp
New client files: `public/ui.js` (sidebar, dialogs, popouts, profiles, edit profile, voice) and `public/ui.css`.
New columns (`users.status`, `users.cstatus`) are added automatically on start. No new npm packages.
- Click a name/avatar for a profile popout; "View Full Profile" opens the full view with mutual servers and friends.
- Click yourself (bottom left) for the profile menu: edit profile, status (Online/Idle/Do Not Disturb/Invisible), custom status, badges.
- Edit Profile is a full-screen editor with a live preview. Display name style, avatar, banner, theme and bio all live there.
- Add a Server, Create Channel, Add Friend and Invite are real dialogs. The server name in the sidebar opens a menu (invite, create channel, leave).
- Voice channels list who is connected under each channel, with mute/deafen icons, speaking rings and a call timer. Mute, deafen and disconnect live in the sidebar.
