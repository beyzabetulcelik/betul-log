const form = document.getElementById("entry-form");
const status = document.getElementById("status");
const dateInput = document.getElementById("date");

// Today's date
dateInput.value = new Date().toISOString().slice(0, 10);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const cfg = window.BETUL_LOG_CONFIG;

  status.textContent = "Publishing...";

  try {
    const formData = new FormData(form);
    formData.append("postingKey", cfg.postingKey);

    const response = await fetch(cfg.workerUrl, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    const result = await response.json();

    console.log(result);

    status.textContent = "✅ Published!";
    form.reset();
    dateInput.value = new Date().toISOString().slice(0, 10);

  } catch (err) {
    console.error(err);
    status.textContent = "❌ " + err.message;
  }
});
