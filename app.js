async function loadPosts() {

    const res =
        await fetch("/api/posts");

    const posts =
        await res.json();

    const root =
        document.getElementById("posts");

    root.innerHTML = "";

    for (const p of posts) {

        root.innerHTML += `
        <article class="entry">

            <p class="date">${p.date}</p>

            <h2>${p.title}</h2>

            <p>${p.body}</p>

            ${
                p.place
                ? `<small>${p.place}</small>`
                : ""
            }

        </article>
        `;
    }

}

loadPosts();
