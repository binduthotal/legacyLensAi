const backendStatus = document.querySelector("#backend-status");
const apiState = document.querySelector("#api-state");
const form = document.querySelector("#project-form");
const formResult = document.querySelector("#form-result");
const projectRegistry = document.querySelector("#project-registry");
const projectDetail = document.querySelector("#project-detail");
const analysisTitle = document.querySelector("#analysis-title");
const analysisUpdated = document.querySelector("#analysis-updated");
const languageBreakdown = document.querySelector("#language-breakdown");
const chunkPreview = document.querySelector("#chunk-preview");
const fileInventory = document.querySelector("#file-inventory");
const sourceTitle = document.querySelector("#source-title");
const sourceCitation = document.querySelector("#source-citation");
const sourceContent = document.querySelector("#source-content");
const questionForm = document.querySelector("#question-form");
const questionAnswer = document.querySelector("#question-answer");

const apiBaseUrl = "http://127.0.0.1:4000";
let selectedProjectId;

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
        return `<li><button type="button" data-project-id="${escapeHtml(project.id)}"><strong>${escapeHtml(project.projectName)}</strong><span>${project.fileCount} files - ${project.analyzedFileCount} analyzed</span></button></li>`;
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
    renderProjectDetail(project);
  } catch (error) {
    projectDetail.textContent = error.message;
  }
}

function renderProjectDetail(project) {
  selectedProjectId = project.id;
  const languages = project.languages
    .map((item) => `${item.language} (${item.fileCount})`)
    .join(", ");

  projectDetail.textContent = `${project.projectName}: ${project.fileCount} files. Languages: ${languages}. Updated ${project.updatedAt}.`;
  analysisTitle.textContent = project.projectName;
  analysisUpdated.textContent = `Updated ${project.updatedAt}`;

  languageBreakdown.innerHTML = project.languages
    .map((item) => {
      return `<div><span>${escapeHtml(item.language)}</span><strong>${item.fileCount}</strong></div>`;
    })
    .join("");

  chunkPreview.innerHTML = project.knowledgeChunks
    .slice(0, 5)
    .map((chunk) => {
      const source = formatSourceLabel(chunk.source);
      return `<article><strong>${escapeHtml(source)}</strong><span>${escapeHtml(chunk.language)} - about ${chunk.tokenEstimate} tokens</span></article>`;
    })
    .join("");

  fileInventory.innerHTML = project.files
    .map((file) => {
      return `<tr><td><button type="button" class="file-link" data-file-path="${escapeHtml(file.path)}">${escapeHtml(file.path)}</button></td><td>${escapeHtml(file.language)}</td><td>${file.lineCount}</td><td>${formatBytes(file.sizeBytes)}</td></tr>`;
    })
    .join("");
}

projectRegistry.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-project-id]");
  if (!button) {
    return;
  }

  loadProjectDetail(button.dataset.projectId);
});

fileInventory.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-file-path]");
  if (!button || !selectedProjectId) {
    return;
  }

  loadSourceFile(selectedProjectId, button.dataset.filePath);
});

questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!selectedProjectId) {
    questionAnswer.textContent = "Select a project before asking a question.";
    return;
  }

  const formData = new FormData(questionForm);
  const question = formData.get("question");
  questionAnswer.textContent = "Looking for source evidence...";

  try {
    const response = await fetch(
      `${apiBaseUrl}/api/v1/projects/${selectedProjectId}/questions`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          question,
          maxResults: 3,
        }),
      },
    );
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error?.message ?? "Question answering failed.");
    }

    const citations =
      payload.citations.length > 0
        ? `<ul>${payload.citations
            .map((citation) => `<li>${escapeHtml(citation)}</li>`)
            .join("")}</ul>`
        : "<p>No source citations returned.</p>";

    questionAnswer.innerHTML = `<p>${escapeHtml(payload.answer)}</p>${citations}`;
  } catch (error) {
    questionAnswer.textContent = error.message;
  }
});

async function loadSourceFile(projectId, filePath) {
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/v1/projects/${projectId}/files?path=${encodeURIComponent(filePath)}`,
    );
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.error?.message ?? "Source file load failed.");
    }

    sourceTitle.textContent = payload.path;
    sourceCitation.textContent = payload.citationLabel;
    sourceContent.textContent = payload.content;
  } catch (error) {
    sourceTitle.textContent = "Source Viewer";
    sourceCitation.textContent = "Unable to load source.";
    sourceContent.textContent = error.message;
  }
}

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
    const previewResponse = await fetch(
      `${apiBaseUrl}/api/v1/projects/intake/preview`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(intakeBody),
      },
    );

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
    renderProjectDetail(payload);
    await refreshProjectRegistry();
  } catch (error) {
    formResult.textContent = error.message;
  }
});

refreshBackendStatus();
refreshProjectRegistry();

function formatSourceLabel(source) {
  if (source.startLine && source.endLine && source.startLine !== source.endLine) {
    return `${source.path}:${source.startLine}-${source.endLine}`;
  }

  if (source.startLine) {
    return `${source.path}:${source.startLine}`;
  }

  return source.path;
}

function formatBytes(value) {
  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
