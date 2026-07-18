const backendStatus = document.querySelector("#backend-status");
const apiState = document.querySelector("#api-state");
const form = document.querySelector("#project-form");
const formResult = document.querySelector("#form-result");

const apiBaseUrl = "http://127.0.0.1:4000";

async function refreshBackendStatus() {
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/health`);
    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const health = await response.json();
    backendStatus.textContent = `${health.service}: ${health.status}`;
    backendStatus.dataset.state = "ok";
    apiState.textContent = "Ready";
  } catch {
    backendStatus.textContent = "Backend offline";
    backendStatus.dataset.state = "error";
    apiState.textContent = "Offline";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const projectName = formData.get("projectName");
  const sourcePath = formData.get("sourcePath");

  formResult.textContent = "Analyzing project inventory...";

  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/projects/analyze`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        projectName,
        sourcePath,
        maxFiles: 25,
      }),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error?.message ?? "Analysis failed.");
    }

    const languages = payload.languages
      .map((item) => `${item.language} (${item.fileCount})`)
      .join(", ");

    formResult.textContent = `${payload.projectName}: ${payload.fileCount} files discovered, ${payload.analyzedFileCount} analyzed. Languages: ${languages}.`;
  } catch (error) {
    formResult.textContent = error.message;
  }
});

refreshBackendStatus();
