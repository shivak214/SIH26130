const form = document.getElementById("businessForm");

const requiredFields = [
    "businessName",
    "businessType",
    "businessStage",
    "industry",
    "state",
    "district",
    "investment",
    "landArea",
    "employees",
    "contactPerson",
    "phone",
    "email"
];

function updateProgress() {
    let completed = 0;

    requiredFields.forEach(id => {
        const field = document.getElementById(id);

        if (field && field.value.trim() !== "") {
            completed++;
        }
    });

    const percentage = Math.round(
        (completed / requiredFields.length) * 100
    );

    document.getElementById("progressFill").style.width =
        `${percentage}%`;

    document.getElementById("progressText").textContent =
        `${percentage}% Complete`;
}

requiredFields.forEach(id => {
    const field = document.getElementById(id);

    if (field) {
        field.addEventListener("change", updateProgress);
        field.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                updateProgress();
            }
        });
    }
});

updateProgress();

const deleteProfileButton = document.getElementById("deleteProfileButton");

deleteProfileButton.addEventListener("click", async function () {

    const confirmed = window.confirm(
        "Delete the most recently saved business profile? This will also clear its readiness progress and vault documents from this browser."
    );

    if (!confirmed) return;

    deleteProfileButton.disabled = true;
    deleteProfileButton.textContent = "Deleting...";

    try {

        const response = await fetch(
            "http://localhost:5000/api/business/latest",
            { method: "DELETE" }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unable to delete profile");
        }

        localStorage.removeItem("sih26130_completed");
        localStorage.removeItem("sih26130_document_vault");
        alert("Business profile deleted successfully.");
        window.location.href = "application.html";

    } catch (error) {

        alert("Unable to delete profile.\n\n" + error.message);
        deleteProfileButton.disabled = false;
        deleteProfileButton.innerHTML = '<i data-lucide="trash-2"></i> Delete Existing Profile';
        lucide.createIcons();

    }

});


form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const submitButton = document.getElementById("submitButton");

    // Prevent double clicking
    submitButton.disabled = true;
    submitButton.querySelector("span").textContent = "Saving...";

    const businessData = {

        businessName: document.getElementById("businessName").value.trim(),

        businessType: document.getElementById("businessType").value,

        businessStage: document.getElementById("businessStage").value,

        industry: document.getElementById("industry").value,

        subIndustry: document.getElementById("subIndustry").value.trim(),

        state: document.getElementById("state").value,

        district: document.getElementById("district").value,

        investment: Number(
            document.getElementById("investment").value
        ),

        landArea: Number(
            document.getElementById("landArea").value
        ),

        employees: Number(
            document.getElementById("employees").value
        ),

        turnover: Number(
            document.getElementById("turnover").value || 0
        ),

        contactPerson: document.getElementById("contactPerson").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        email: document.getElementById("email").value.trim(),

        website: document.getElementById("website").value.trim()

    };


    try {

        console.log("Sending business data:", businessData);

        const response = await fetch(
            "http://localhost:5000/api/business",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(businessData)
            }
        );


        const result = await response.json();

        console.log("Server response:", result);


        if (!response.ok) {

            throw new Error(
                result.message || "Failed to save business profile"
            );

        }


        if (result.success) {

            console.log("Business saved successfully:", result.business);

            // Show success message
            document
                .getElementById("successMessage")
                .classList.add("show");


            // Change button text
            submitButton.querySelector("span").textContent =
                "Saved Successfully";


            /*
             * CONTINUE TO NEXT PAGE
             *
             * Change this filename when you create
             * your next page.
             */
            setTimeout(() => {

                window.location.href = "application.html";

            }, 1500);

        }

    } catch (error) {

        console.error("Save error:", error);

        alert(
            "Unable to save profile.\n\n" +
            error.message
        );

        submitButton.disabled = false;

        submitButton.querySelector("span").textContent =
            "Save & Continue";

    }

});