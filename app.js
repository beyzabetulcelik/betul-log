async function loadPosts() {
  const root = document.getElementById("posts");

  try {
    const response = await fetch("/api/posts", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const posts = await response.json();

    root.innerHTML = "";

    if (posts.length === 0) {
      root.innerHTML = `
        <article class="entry">
          <p>No entries yet.</p>
        </article>
      `;
      return;
    }

    for (const post of posts) {
      const article = document.createElement("article");
      article.className = "entry";

      const formattedDate = formatDate(post.date);

      article.innerHTML = `
        <p class="date">${escapeHtml(formattedDate)}</p>

        ${post.image
          ? `<img
               src="${post.image}"
               alt=""
               style="
                 display:block;
                 width:100%;
                 max-height:720px;
                 object-fit:cover;
                 border-radius:14px;
                 margin:0 0 20px;
               "
             >`
          : ""
        }

        <h2>${escapeHtml(post.title)}</h2>

        <p style="white-space:pre-wrap">${escapeHtml(post.body)}</p>

        ${post.place
          ? `<p style="color:#6f6a61">📍 ${escapeHtml(post.place)}</p>`
          : ""
        }
      `;

      root.appendChild(article);
    }
  } catch (error) {
    root.innerHTML = `
      <article class="entry">
        <p>Could not load entries: ${escapeHtml(error.message)}</p>
      </article>
    `;
  }
}

function formatDate(value) {
  const date = new Date(`${value}T12:00:00`);

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadPosts();
