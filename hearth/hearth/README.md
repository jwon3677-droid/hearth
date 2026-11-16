# Hearth
1. Make a free Postgres DB at neon.tech (copy the connection string).
2. Push this folder to a GitHub repo.
3. On render.com: New > Web Service > your repo. Build: `npm install`, Start: `npm start`.
4. Env vars: DATABASE_URL, JWT_SECRET (32+ random chars), NODE_ENV=production.
5. The FIRST account to sign up becomes admin. Sign up yourself right away.
**Uploads**: server icons (owner: Server Settings > Overview) and file attachments (📎, drag-drop or paste in chat) are capped at 10MB and stored in Postgres. Mind your DB size limit.
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

## Profile kit (badges, effects, tags)
New files: `profile.js` (server), `ux.js`, `public/profile2.js`, `public/favicon.svg`. New columns are added automatically on start. No new packages.
- **Badges**: staff, verified (animated gradients), og, early, supporter, mgmt (Hearth Management), helper (Hearth Helper), bugrep, elitebug, bughunter. All icons are custom SVGs in `BD` in `profile2.js`. Staff Panel can grant any of them. To add one: add it to `BD` AND to `BADGES` in `server.js`.
- **Profile**: display name (32), pronouns (30), 10 profile themes + custom two-color gradient, 8 profile effects (bubbles, sparkles, snow, embers, hearts, stars, aurora, rain), all in Edit Profile with a live preview.
- **Server tags**: owners use server menu > Server Tag (2-4 chars, icon, color). Members pick one to wear under Edit Profile > Server Tag.
- **Favicon**: the mascot, `public/favicon.svg`.

## Staff admin, server settings, user settings
New: `manage.js`, `public/settings.js`. New table `mod_servers` and column `users.allow_fr` are created on start.
- **Staff admin on every server**: Staff Panel > Servers > Moderate. Staff/admin get owner-level control (settings, channels, kicks, delete, tag, pins, @everyone) and can read/send in any server's channels, without being a member, so they don't appear in member lists or counts. Moderated servers show a shield on the rail; "Stop Moderating" in the server menu removes it. Staff can't be removed by server owners.
- **Server settings** (owner or staff): server menu > Server Settings: rename, invite code (copy/reset), tag, rename/delete channels, remove members, delete server (the default Lounge is protected).
- **User settings** (gear bottom-left): My Account (username, password, delete account), Appearance (text size, compact, 24h time, reduce motion, hide effects), Notifications (mention sound, desktop notifications), Privacy (allow friend requests). Appearance/notification choices are stored in the browser.

## Voice relay (optional)
Voice uses public STUN servers. If people on strict networks (some school/work/mobile connections) can't hear each other, add a TURN relay:
set `TURN_URL` (e.g. `turn:your-host:3478`, comma-separate several), `TURN_USER` and `TURN_PASS` as env vars. Clients pick them up from `/api/ice`.

## v7: themes, badge cards, server profiles, invite links
- **Themes** (User settings > Appearance): 13 built-in themes plus a Custom theme (pick background, text and accent, or hit "Surprise me"). Themes recolor the whole app through CSS variables (`--p0..--p6`, `--t1..--t5`); the toggle below the grid decides whether the theme's accent replaces your profile color.
- **Badge hover cards**: hovering a badge animates it and opens an animated card (tap on phones) instead of the browser tooltip. Edit text in `BD` in `public/profile2.js`.
- **Server tag popout**: click any server tag to see the server's card (banner, icon, online/member counts, founded date, traits, description). Members get **Adopt Tag**, non-members get **Join** (disabled while invites are paused).
- **Server settings** now open as a full screen like Discord: Server Profile (name, icon, banner color or image, up to 5 traits, description, live preview), Server Tag, Invites, General, Notifications, Members, Channels, Safety Setup, Community, Delete Server. The server name menu has the matching entries.
- **Invite links**: `https://<your-site>/invite/<code>`. Owners can set a custom code in Server Settings > Invites. Pasting a full link into Join a Server also works. "Pause invites" is now enforced.
- Fixed the phone layout where a reply's preview text overlapped the message below it.
New DB columns (`servers.banner`, `servers.created`) are created automatically. No new npm packages.

## Roles
Server Settings > Roles (owner, staff, or anyone with **Manage Roles**). Up to 25 roles per server, each with a name, color, a "show separately in member list" option and permissions: Administrator, Manage Server, Manage Roles, Manage Channels, Manage Messages, Kick Members, Mention @everyone.
- Hierarchy: roles higher in the list outrank lower ones. You can only edit, give or take roles below your own highest role, and only grant permissions you have. Owner and site staff ignore the hierarchy.
- Members tab: give or take roles per member (and remove members if you can kick). Names use the color of their highest colored role (unless they picked their own name color). Hoisted roles get their own group in the member list.
- The server's settings screen, channel tools, server tag, icon/banner uploads, invites, pins, deleting other people's messages and @everyone all check these permissions on the server, not just in the UI.
- New tables (`roles`, `member_roles`) are created automatically on start.
