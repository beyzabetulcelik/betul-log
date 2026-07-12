export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/posts" && request.method === "GET") {
      const posts = await env.BLOG.get("posts", { type: "json" });

      return Response.json(posts || [], {
        headers: {
          "Cache-Control": "no-store"
        }
      });
    }

    if (url.pathname === "/api/publish" && request.method === "POST") {
      try {
        const form = await request.formData();

        if (form.get("postingKey") !== env.POSTING_KEY) {
          return new Response("Unauthorized", { status: 401 });
        }

        const date = String(form.get("date") || "").trim();
        const title = String(form.get("title") || "").trim();
        const body = String(form.get("body") || "").trim();
        const place = String(form.get("place") || "").trim();
        const image = String(form.get("image") || "");

        if (!date || !title || !body) {
          return new Response("Date, title and note are required.", {
            status: 400
          });
        }

        const currentPosts =
          (await env.BLOG.get("posts", { type: "json" })) || [];

        const entry = {
          id: crypto.randomUUID(),
          date,
          title,
          body,
          place,
          image: image || null,
          createdAt: new Date().toISOString()
        };

        currentPosts.push(entry);

        currentPosts.sort((a, b) => {
          const dateDifference = b.date.localeCompare(a.date);

          if (dateDifference !== 0) {
            return dateDifference;
          }

          return b.createdAt.localeCompare(a.createdAt);
        });

        await env.BLOG.put("posts", JSON.stringify(currentPosts));

        return Response.json({
          ok: true,
          entry
        });
      } catch (error) {
        return new Response(
          `Publish failed: ${error?.message || "Unknown error"}`,
          { status: 500 }
        );
      }
    }

    return env.ASSETS.fetch(request);
  }
};
