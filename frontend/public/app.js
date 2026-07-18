const backendStatus = document.querySelector("#backend-status");
const apiState = document.querySelector("#api-state");
const form = document.querySelector("#project-form");
const formResult = document.querySelector("#form-result");
const projectRegistry = document.querySelector("#project-registry");
const projectDetail = document.querySelector("#project-detail");

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
        return `<li><button type="button" data-project-id="${project.id}"><strong>${project.projectName}</strong><span>${project.fileCount} files · ${project.analyzedFileCount} analyzed</span></button></li>`;
      })
      .join("");
  } catch {
    projectRegistry.innerHTML = "<li>Project registry unavailable.</li>";
  }
}

async function loadProjectDetail(projectId) {
  try {
    const response = await fetch(`${apiBaseUrl}/api/v1/projects/${projectId}`);
    if (!response.ok) {
      throw new Error(`Project detail returned ${response.status}`);
    }

    const project = await response.json();
    const languages = project.languages
      .map((item) => `${item.language} (${item.fileCount})`)
      .join(", ");

    projectDetail.textContent = `${project.projectName}: ${project.fileCount} files. Languages: ${languages}. Updated ${project.updatedAt}.`;
  } catch (error) {
    projectDetail.textContent = error.message;
  }
}

projectRegistry.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-project-id]");
  if (!button) {
    return;
  }

  loadProjectDetail(button.dataset.projectId);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const projectName = formData.get("projectName");
  const sourcePath = formData.get("sourcePath");
  const maxFiles = Number(formData.get("maxFiles"));
  const maxFileSizeBytes = Number(formData.get("maxFileSizeBytes"));

  formResult.textContent = "Previewing project intake...";

  try {
    const intakeBody = {
      projectName,
      sourcePath,
      maxFiles,
      maxFileSizeBytes,
    };
    const previewResponse = await fetch(`${apiBaseUrl}/api/v1/projects/intake/preview`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(intakeBody),
    });

    const preview = await previewResponse.json();

    if (!previewResponse.ok) {
      throw new Error(preview.error?.message ?? "Intake preview failed.");
    }

    formResult.textContent = `Preview found ${preview.fileCount} files. Analyzing ${preview.previewFileCount} files...`;

    const response = await fetch(`${apiBaseUrl}/api/v1/projects/analyze`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(intakeBody),
    });

    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error?.message ?? "Analysis failed.");
    }

    const languages = payload.languages
      .map((item) => `${item.language} (${item.fileCount})`)
      .join(", ");

    formResult.textContent = `${payload.projectName}: ${payload.fileCount} files discovered, ${payload.analyzedFileCount} analyzed. Languages: ${languages}.`;
    await loadProjectDetail(payload.id);
    await refreshProjectRegistry();
  } catch (error) {
    formResult.textContent = error.message;
  }
});

refreshBackendStatus();
refreshProjectRegistry();
