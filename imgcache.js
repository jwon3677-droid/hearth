// Browser caching for images stored in the database. Sends an ETag computed by Postgres (md5 of the image), so when the browser
// asks "has this changed?" we answer 304 without pulling the image bytes out of the database (that transfer is what ate the Neon quota).
const CC='private, max-age=3600, stale-while-revalidate=86400';
module.exports=async(q,req,res,sql,params)=>{const[r]=await q(sql,params);if(!r||!r.h)return false;const et='"'+r.h+'"';res.set({ETag:et,'Cache-Control':CC});if(req.headers['if-none-match']===et){res.sendStatus(304);return true}return false};
module.exports.CC=CC;
