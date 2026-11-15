// extra user columns sent with every message / member / profile row
module.exports="u.dname,u.pronouns,u.peffect,u.pc1,u.pc2,u.adeco,(select row_to_json(t) from (select s.id,s.tag,s.tag_icon,s.tag_color from servers s join members mm on mm.server_id=s.id and mm.user_id=u.id where s.id=u.tag_server and s.tag is not null) t) tg";
