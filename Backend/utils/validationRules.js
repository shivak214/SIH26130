const SOURCE = "Prototype checklist item; requires official validation";

function getValidationRules(documentType = "") {
    return [{
        documentType,
        source: SOURCE,
        note: "Verify final requirements with the competent authority and on the official department portal."
    }];
}

module.exports = { getValidationRules };