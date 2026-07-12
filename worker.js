export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ---------- GET POSTS ----------
    if (url.pathname === "/api/posts") {
      const data = await env.BLOG.get("posts");

      return new Response(data || "[]", {
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // ---------- SAVE ----------
    if (url.pathname === "/api/publish" && request.method === "POST") {

      const form = await request.formData();

      if (form.get("postingKey") !== env.POSTING_KEY) {
        return new Response("Unauthorized", { status: 401 });
      }

      const entry = {
        id: crypto.randomUUID(),
        date: form.get("date"),
        title: form.get("title"),
        body: form.get("body"),
        place: form.get("place"),
        createdAt: new Date().toISOString()
      };

      let posts = [];

      const current = await env.BLOG.get("posts");

      if (current) {
        posts = JSON.parse(current);
      }

      posts.unshift(entry);

      await env.BLOG.put(
        "posts",
        JSON.stringify(posts)
      );

      return Response.json({
        ok: true
      });
    }

    return env.ASSETS.fetch(request);
  }
}
