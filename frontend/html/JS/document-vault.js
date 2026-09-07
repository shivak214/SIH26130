const apiBase = "http://localhost:5000";
const vaultApproval = document.getElementById("vaultApproval");
const vaultRequirement = document.getElementById("vaultRequirement");
const vaultForm = document.getElementById("vaultForm");
const vaultList = document.getElementById("vaultList");
const vaultCount = document.getElementById("vaultCount");
const vaultMessage = document.getElementById("vaultMessage");
const verificationResult = document.getElementById("verificationResult");
const manualFields = document.getElementById("manualFields");
let businessProfileId = null;
let databaseApproval = null;
let selectedTemplate = null;

const fieldSets = {
    "CA Certificate": [["companyName", "Company name", "text"], ["capitalInvestmentCrore", "Capital investment (crore)", "number"], ["certificateIssueDate", "Certificate issue date", "date"], ["caMembershipNumber", "CA membership number", "text"], ["signedAndStamped", "Signed and stamped", "checkbox"], ["udinPresent", "UDIN is present", "checkbox"]],
    "Land Ownership / MIDC Allotment Document": [["ownerOrLesseeName", "Owner or lessee name", "text"], ["plotNumber", "Plot number", "text"], ["landArea", "Land area", "number"], ["location", "Location", "text"], ["registrationOrAllotmentNumber", "Registration/allotment number", "text"], ["documentDate", "Document date", "date"]],
    "Site Plan": [["plotBoundaryMarked", "Plot boundary marked", "checkbox"], ["buildingOrProcessAreaMarked", "Building/process area marked", "checkbox"], ["roadAccessShown", "Road access shown", "checkbox"], ["effluentDischargePointMarked", "Effluent discharge point marked", "checkbox"], ["emissionStackLocationMarked", "Emission stack location marked", "checkbox"], ["etpLocationMarked", "ETP location marked", "checkbox"], ["northDirectionMarked", "North direction marked", "checkbox"], ["professionalDrawingReviewDeclared", "Professional drawing review declared", "checkbox"]],
    "Process Flow Diagram": [["rawMaterialsListed", "Raw materials listed", "checkbox"], ["manufacturingStepsListed", "Manufacturing steps listed", "checkbox"], ["finalProductName", "Final product name", "text"], ["solventsOrChemicalsListed", "Solvents or chemicals listed", "checkbox"], ["effluentGenerationPointsListed", "Effluent generation points listed", "checkbox"], ["airEmissionPointsListed", "Air-emission points listed", "checkbox"], ["hazardousWastePointsListed", "Hazardous-waste points listed", "checkbox"], ["pollutionControlLinkageShown", "Pollution-control linkage shown", "checkbox"]],
    "Mass Balance": [["totalInputKg", "Total input (kg)", "number"], ["productOutputKg", "Product output (kg)", "number"], ["byProductOutputKg", "By-product output (kg)", "number"], ["wasteOutputKg", "Waste output (kg)", "number"], ["processLossKg", "Process loss (kg)", "number"], ["solventRecoveryMentioned", "Solvent recovery disclosed", "checkbox"], ["unitsConsistent", "Units are consistent", "checkbox"], ["professionalTechnicalReviewDeclared", "Professional technical review declared", "checkbox"]],
    "ETP Proposal / ETP Design": [["proposedETPCapacityKLD", "Proposed ETP capacity (KLD)", "number"], ["treatmentStagesDescribed", "Treatment stages described", "checkbox"], ["sludgeManagementMentioned", "Sludge management mentioned", "checkbox"], ["disposalOrReusePathMentioned", "Disposal/reuse path mentioned", "checkbox"], ["consultantOrDesignerDetailsProvided", "Consultant/design details provided", "checkbox"], ["engineeringReviewDeclared", "Engineering review declared", "checkbox"]]
};

function populateApprovals() {
    const databaseOption = document.createElement("option");
    databaseOption.value = "MPCB_CTE_PHARMA";
    databaseOption.textContent = "MPCB Consent to Establish (CTE)";
    vaultApproval.appendChild(databaseOption);
    PHARMA_APPROVALS.filter(approval => approval.id !== "CTE_001").forEach(approval => {
        const option = document.createElement("option");
        option.value = approval.id;
        option.textContent = approval.shortName;
        vaultApproval.appendChild(option);
    });
}
function checklistTypeFor(documentName) {
    const name = String(documentName || "").toLowerCase();
    if (name.includes("ca certificate")) return "CA Certificate";
    if (name.includes("land") || name.includes("lease") || name.includes("allotment")) return "Land Ownership / MIDC Allotment Document";
    if (name.includes("site plan")) return "Site Plan";
    if (name.includes("process flow")) return "Process Flow Diagram";
    if (name.includes("mass balance")) return "Mass Balance";
    if (name.includes("etp")) return "ETP Proposal / ETP Design";
    return null;
}

function populateRequirements() {
    if (vaultApproval.value === "MPCB_CTE_PHARMA" && !databaseApproval) {
        vaultRequirement.disabled = true;
        vaultRequirement.innerHTML = "<option value=\"\">Loading database requirements...</option>";
        loadDatabaseApproval().then(populateRequirements);
        return;
    }
    const approval = vaultApproval.value === "MPCB_CTE_PHARMA" ? databaseApproval : PHARMA_APPROVALS.find(item => item.id === vaultApproval.value);
    const availableTypes = [...new Set((approval?.documents || []).map(item => typeof item === "string" ? item : item.name))];
    vaultRequirement.innerHTML = `<option value="">${approval ? "Select document type" : "Select approval first"}</option>`;
    vaultRequirement.disabled = !approval || availableTypes.length === 0;
    availableTypes.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        vaultRequirement.appendChild(option);
    });
    selectedTemplate = null;
    renderManualFields();
}
function escapeHtml(value) { return String(value ?? "").replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#039;" }[character])); }
function formatBytes(bytes) { return !bytes ? "0 KB" : bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`; }
function scoreClass(score) { return score >= 90 ? "ready" : score >= 70 ? "minor" : score >= 40 ? "major" : "not-ready"; }
function displayValue(value) { return value === undefined || value === null || value === "" ? "Not provided" : typeof value === "object" ? JSON.stringify(value) : String(value); }
async function loadSelectedTemplate() {
    const selectedName = vaultRequirement.value;
    const template = databaseApproval?.documents?.find(item => item.name === selectedName);
        if (!template && vaultApproval.value !== "MPCB_CTE_PHARMA") {
            try {
                const response = await fetch(`${apiBase}/api/document-templates/by-name?name=${encodeURIComponent(selectedName)}&approvalCode=${encodeURIComponent(vaultApproval.value)}`);
                if (!response.ok) throw new Error("Checklist template not found.");
                const result = await response.json();
                selectedTemplate = result.data;
                renderManualFields();
            } catch (error) {
                selectedTemplate = null;
                renderManualFields();
            }
            return;
        }
        if (!template) { selectedTemplate = null; renderManualFields(); return; }
    try {
        const response = await fetch(`${apiBase}/api/document-templates/${encodeURIComponent(template.code)}`);
        if (!response.ok) throw new Error("Unable to load document checklist.");
        const result = await response.json();
        selectedTemplate = result.data;
    } catch (error) {
        selectedTemplate = template;
    }
    renderManualFields();
}

function renderManualFields() {
    const checklistType = checklistTypeFor(vaultRequirement.value);
    const databaseTemplate = selectedTemplate || databaseApproval?.documents?.find(item => item.name === vaultRequirement.value);
    const fields = databaseTemplate?.questions?.map(question => [question.id, question.label, question.helpText]) || (fieldSets[checklistType] || []).map(([id, label]) => [id, label, ""]);
    manualFields.innerHTML = `<div class="checklist-intro">Select the checklist items confirmed by the uploaded document. Each item is worth 10 points.</div>${fields.map(([id, label, helpText]) => `<label class="manual-checkbox"><input data-field="${id}" type="checkbox" value="true"> <span>${escapeHtml(label)}${helpText ? `<small>${escapeHtml(helpText)}</small>` : ""}</span></label>`).join("")}`;
}
function collectManualFields() { const fields = {}; manualFields.querySelectorAll("[data-field]").forEach(input => { fields[input.dataset.field] = input.type === "checkbox" ? input.checked : input.value; }); return fields; }
function renderVerification(result) {
    const checks = result.checks || [];
    const checkText = item => `${escapeHtml(item.label)}: ${escapeHtml(item.message)} <small>Actual: ${escapeHtml(displayValue(item.actualValue))} · Expected: ${escapeHtml(displayValue(item.expectedValue))}</small>`;
    const passed = checks.filter(item => item.passed).map(item => `<li class="issue-success"><strong>PASS</strong><span>${checkText(item)}</span></li>`).join("") || "<li>No checks passed yet.</li>";
    const failed = checks.filter(item => !item.passed && !item.needsManualReview).map(item => `<li class="issue-critical"><strong>${escapeHtml(item.status)}</strong><span>${checkText(item)}</span></li>`).join("") || `<li class="issue-success"><strong>PASS</strong><span>No missing or failed checks.</span></li>`;
    const manual = checks.filter(item => item.needsManualReview).map(item => `<li class="issue-warning"><strong>REVIEW</strong><span>${checkText(item)}</span></li>`).join("") || "<li>No manual-review items.</li>";
    const recommendations = (result.recommendations || []).map(item => `<li>${escapeHtml(item)}</li>`).join("") || "<li>No further checklist action.</li>";
    const disclaimers = (result.disclaimers || []).map(item => `<p>${escapeHtml(item)}</p>`).join("");
    verificationResult.hidden = false;
    const source = result.source?.title ? `${result.source.title}${result.lastVerified ? ` · Last verified ${new Date(result.lastVerified).toLocaleDateString()}` : ""}` : "Configured checklist source";
    const checkedCount = checks.filter(item => item.passed).length;
    verificationResult.innerHTML = `<div class="verification-heading"><div><span class="eyebrow">RULE-BASED PRE-SUBMISSION CHECKLIST</span><h2>Document readiness</h2><p>Based only on checked checklist questions. The uploaded image is not scored.</p></div><div class="verification-score ${scoreClass(result.overallScore)}"><strong>${result.overallScore}</strong><span>/100</span><small>${checkedCount}/${checks.length} checked</small></div></div><div class="verification-progress"><span style="width:${result.overallScore}%"></span></div><div class="verification-status ${scoreClass(result.overallScore)}">${escapeHtml(String(result.status).replaceAll("_", " "))}</div><div class="verification-columns"><div><h3>Passed checks</h3><ul class="verification-issues">${passed}</ul><h3>Missing or failed checks</h3><ul class="verification-issues">${failed}</ul></div><div><h3>Manual-review items</h3><ul class="verification-issues">${manual}</ul><h3>What needs your attention</h3><ul class="verification-recommendations">${recommendations}</ul><h3>Source notes and disclaimer</h3><div class="verification-disclaimer"><p>${escapeHtml(source)}</p>${disclaimers}</div></div></div>`;
    lucide.createIcons();
}
function renderDocuments(items) { vaultCount.textContent = `${items.length} document${items.length === 1 ? "" : "s"} stored`; vaultList.innerHTML = items.length ? items.map(item => { const document = item.document; const result = item.verificationResult; return `<article class="vault-file"><div class="vault-file-icon"><i data-lucide="file-check-2"></i></div><div class="vault-file-info"><strong>${escapeHtml(document.originalName)}</strong><span>${escapeHtml(document.documentType)}</span><small>${formatBytes(document.size)} · ${result ? `${result.overallScore}/100` : "Pending"}</small></div><button class="vault-delete" type="button" data-id="${document._id}" aria-label="Remove ${escapeHtml(document.originalName)}"><i data-lucide="trash-2"></i></button></article>`; }).join("") : `<div class="vault-empty"><i data-lucide="file-up"></i><p>No documents saved yet.</p><span>Upload a requirement for a pre-submission checklist.</span></div>`; vaultList.querySelectorAll(".vault-delete").forEach(button => button.addEventListener("click", async () => { await fetch(`${apiBase}/api/documents/${button.dataset.id}`, { method: "DELETE" }); loadDocuments(); })); lucide.createIcons(); }
async function loadDocuments() { try { const profileResponse = await fetch(`${apiBase}/api/business/latest`); if (!profileResponse.ok) throw new Error("Create a business profile first."); const profile = await profileResponse.json(); businessProfileId = profile.business._id; const response = await fetch(`${apiBase}/api/documents/business/${businessProfileId}`); const result = await response.json(); renderDocuments(result.data || []); } catch (error) { vaultMessage.textContent = error.message; vaultMessage.className = "vault-message error"; } }
async function loadDatabaseApproval() { try { const response = await fetch(`${apiBase}/api/approvals/MPCB_CTE_PHARMA`); if (!response.ok) return; const result = await response.json(); databaseApproval = { ...result.data.approval, documents: result.data.documents }; } catch (error) { databaseApproval = null; } }

vaultApproval.addEventListener("change", populateRequirements);
vaultRequirement.addEventListener("change", loadSelectedTemplate);
vaultForm.addEventListener("submit", async event => { event.preventDefault(); const file = document.getElementById("vaultFile").files[0]; if (!file || !vaultRequirement.value || !document.getElementById("declarationAccepted").checked) return; const submitButton = vaultForm.querySelector("button"); submitButton.disabled = true; submitButton.querySelector("span").textContent = "Checking..."; const formData = new FormData(); formData.append("document", file); formData.append("documentType", vaultRequirement.value); formData.append("approvalType", vaultApproval.value); formData.append("manualFields", JSON.stringify(collectManualFields())); formData.append("declarationAccepted", "true"); if (businessProfileId) formData.append("businessProfileId", businessProfileId); try { const response = await fetch(`${apiBase}/api/documents/upload-and-check`, { method: "POST", body: formData }); const result = await response.json(); if (!response.ok) throw new Error(result.error || "Upload failed."); renderVerification(result.data.verificationResult); vaultMessage.textContent = "Document uploaded and checklist completed."; vaultMessage.className = "vault-message success"; vaultForm.reset(); vaultRequirement.disabled = true; manualFields.innerHTML = ""; loadDocuments(); } catch (error) { vaultMessage.textContent = error.message; vaultMessage.className = "vault-message error"; } finally { submitButton.disabled = false; submitButton.querySelector("span").textContent = "Check document readiness"; } });

populateApprovals();
loadDatabaseApproval().then(loadDocuments);