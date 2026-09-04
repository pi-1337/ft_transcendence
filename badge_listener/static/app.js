const config = document.currentScript.dataset;
const pollInterval = Number(config.pollInterval || 1000);
const pollTimeout = Number(config.pollTimeout || 30000);
const $ = (selector) => document.querySelector(selector);
let pollToken = 0;
let organizations = [];

function safe(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function time(value) {
  return value ? new Intl.DateTimeFormat(undefined, {hour: "2-digit", minute: "2-digit", second: "2-digit"}).format(new Date(value)) : "—";
}
async function request(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = data.detail;
    throw new Error((typeof detail === "object" ? detail.message : detail) || data.error || `Request failed (${response.status})`);
  }
  return data;
}
function error(text = "") {
  $("#message").textContent = text;
  $("#message").hidden = !text;
}
function loading(on) {
  $("#scan-button").disabled = on || !$("#reader-id").value;
  $("#scan-button b").textContent = on ? "Sending scan…" : "Simulate badge scan";
}
function selectedOrganization() {
  return organizations.find((item) => String(item.id) === $("#organization-id").value);
}
function readerName(readerId) {
  for (const organization of organizations) {
    const reader = (organization.readers || []).find((item) => Number(item.id) === Number(readerId));
    if (reader) return `${reader.location} (#${reader.id})`;
  }
  return `#${readerId}`;
}
function addOption(select, value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  select.append(option);
}
function updateReaders() {
  const select = $("#reader-id");
  const readers = selectedOrganization()?.readers || [];
  select.replaceChildren();
  if (!readers.length) {
    addOption(select, "", "No readers available");
    select.disabled = true;
    $("#reader-help").textContent = "This organization has no registered RFID readers.";
  } else {
    readers.forEach((reader) => addOption(select, String(reader.id), `${reader.location} (#${reader.id})`));
    select.disabled = false;
    $("#reader-help").textContent = `${readers.length} reader${readers.length === 1 ? "" : "s"} available for this organization.`;
  }
  loading(false);
}
async function loadOrganizations() {
  const select = $("#organization-id");
  loading(true);
  error();
  try {
    const data = await request("/api/organizations");
    organizations = data.organizations || [];
    select.replaceChildren();
    if (!organizations.length) {
      addOption(select, "", "No active organizations");
      select.disabled = true;
      $("#reader-help").textContent = "Create or activate an organization before simulating scans.";
      updateReaders();
      return;
    }
    organizations.forEach((organization) => addOption(select, String(organization.id), organization.name));
    select.disabled = false;
    updateReaders();
  } catch (reason) {
    organizations = [];
    select.replaceChildren();
    addOption(select, "", "Organizations unavailable");
    select.disabled = true;
    updateReaders();
    error(reason.message);
  }
}
async function history() {
  const {events} = await request("/api/history");
  $("#history-body").innerHTML = events.length ? events.map((item) => `<tr><td>${safe(time(item.created_at))}</td><td class="mono">#${safe(item.scan_id)}</td><td class="mono">${safe(readerName(item.reader_id))}</td><td class="mono badge">${safe(item.badge_id)}</td><td><span class="pill ${safe(item.status.toLowerCase())}"><i></i>${safe(item.status)}</span></td></tr>`).join("") : '<tr class="no-events"><td colspan="5">No simulated scans in this session.</td></tr>';
}
async function poll(id, token) {
  const start = Date.now();
  while (Date.now() - start < pollTimeout && token === pollToken) {
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
    const scan = await request(`/api/scans/${id}`);
    await history();
    if (scan.status !== "PENDING") return;
  }
  if (token === pollToken) error("Status polling timed out. Refresh the event log to check again.");
}
$("#scan-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  error();
  loading(true);
  const token = ++pollToken;
  try {
    const scan = await request("/api/simulate-scan", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({badge_id: $("#badge-id").value.trim(), reader_id: Number($("#reader-id").value)}),
    });
    await history();
    loading(false);
    poll(scan.scan_id, token).catch((reason) => error(reason.message));
  } catch (reason) {
    error(reason.message);
    loading(false);
  }
});
$("#organization-id").addEventListener("change", updateReaders);
document.querySelectorAll("[data-badge]").forEach((button) => button.addEventListener("click", () => {
  $("#badge-id").value = button.dataset.badge;
  $("#badge-id").focus();
}));
$("#refresh-history").addEventListener("click", () => history().catch((reason) => error(reason.message)));
Promise.all([loadOrganizations(), history()]).catch((reason) => error(reason.message));