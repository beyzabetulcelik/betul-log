const form = document.getElementById("entry-form");
const statusElement = document.getElementById("status");
const dateInput = document.getElementById("date");

dateInput.value = new Date().toISOString().slice(0, 10);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const config = window.BETUL_LOG_CONFIG;
  const button = form.querySelector('button[type="submit"]');
  const photoInput = form.querySelector('input[name="photo"]');

  button.disabled = true;
  statusElement.textContent = "Publishing...";

  try {
    const formData = new FormData(form);

    formData.delete("photo");
    formData.append("postingKey", config.postingKey);

    const photo = photoInput.files[0];

    if (photo) {
      const compressedImage = await compressImage(photo);
      formData.append("image", compressedImage);
    }

    const response = await fetch(config.workerUrl, {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    form.reset();
    dateInput.value = new Date().toISOString().slice(0, 10);

    statusElement.textContent = "✅ Published!";

    setTimeout(() => {
      window.location.href = "/";
    }, 700);
  } catch (error) {
    statusElement.textContent = `❌ ${error.message}`;
  } finally {
    button.disabled = false;
  }
});

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Photo could not be read."));

    reader.onload = () => {
      image.src = reader.result;
    };

    image.onerror = () => reject(new Error("Photo could not be loaded."));

    image.onload = () => {
      const maximumWidth = 1200;
      const scale = Math.min(1, maximumWidth / image.width);

      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);

      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };

    reader.readAsDataURL(file);
  });
}
