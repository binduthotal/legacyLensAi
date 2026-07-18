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

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const projectName = formData.get("projectName");
  const sourcePath = formData.get("sourcePath");

  formResult.textContent = `${projectName} is ready for analysis planning from ${sourcePath}.`;
});

refreshBackendStatus();
