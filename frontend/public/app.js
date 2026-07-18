const backendStatus = document.querySelector("#backend-status");
const apiState = document.querySelector("#api-state");
const form = document.querySelector("#project-form");
const formResult = document.querySelector("#form-result");
const projectRegistry = document.querySelector("#project-registry");

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

async function refreshProjectRegistry() {
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/projects`);
    if (!response.ok) {
      throw new Error(`Project registry returned ${response.status}`);
    }

    const payload = await response.json();
    const projects = payload.projects ?? [];

    if (projects.length === 0) {
      projectRegistry.innerHTML = "<li>No analyzed projects yet.</li>";
      return;
    }

    projectRegistry.innerHTML = projects
      .map((project) => {
        return `<li><strong>${project.projectName}</strong><span>${project.fileCount} files · ${project.analyzedFileCount} analyzed</span></li>`;
      })
      .join("");
  } catch {
    projectRegistry.innerHTML = "<li>Project registry unavailable.</li>";
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
    await refreshProjectRegistry();
  } catch (error) {
    formResult.textContent = error.message;
  }
});

refreshBackendStatus();
refreshProjectRegistry();
