export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Formdan gelen yayın isteği
    if (url.pathname === "/api/publish" && request.method === "POST") {
      try {
        const form = await request.formData();

        if (form.get("postingKey") !== env.POSTING_KEY) {
          return new Response("Unauthorized", { status: 401 });
        }

        const date = String(form.get("date") || "");
        const title = String(form.get("title") || "").trim();
        const body = String(form.get("body") || "").trim();
        const place = String(form.get("place") || "").trim();

        if (!date || !title || !body) {
          return new Response("Missing required fields", { status: 400 });
        }

        // Şimdilik Worker'ın gerçekten çalıştığını test ediyoruz.
        // Bir sonraki adımda buraya GitHub commit kodunu ekleyeceğiz.
        return Response.json({
          ok: true,
          entry: {
            date,
            title,
            body,
            place
          }
        });
      } catch (error) {
        return new Response(`Error: ${error.message}`, { status: 500 });
      }
    }

    // Diğer tüm adreslerde statik siteyi göster
    return env.ASSETS.fetch(request);
  }
};
