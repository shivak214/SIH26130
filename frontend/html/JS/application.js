// =============================================
//  PHARMACEUTICAL (API MANUFACTURING) APPROVALS
//  Maharashtra — Complete Data for Prototype
// =============================================

const PHARMA_APPROVALS = [

    // =========================================
    //  LEVEL 0 : PREREQUISITES
    // =========================================

    {
        id: "LAND_001",
        name: "Land Ownership / Lease Certificate",
        shortName: "Land Ownership",
        authority: "Revenue Department / MIDC",
        level: 0,
        levelName: "Prerequisites",
        timeline: "N/A (must already have)",
        timelineDays: 0,
        validity: "Permanent (ownership) / Lease period",
        fees: "N/A",
        category: null,
        canStartIndependently: true,
        dependencies: [],
        documents: [
            "Sale deed / Lease agreement",
            "7/12 extract (for non-MIDC land)",
            "MIDC allotment letter (for MIDC land)",
            "Property tax receipt",
            "Land use certificate (industrial zoning)"
        ],
        conditions: [],
        officialSource: null,
        applyUrl: null,
        applyMethod: "Revenue Department / MIDC office",
        icon: "map-pin",
        description: "Proof of land ownership or valid lease agreement for the industrial premises. Required before any other approval can be applied for.",
        maitriIntegrated: false
    },

    {
        id: "ROC_001",
        name: "Company Registration (ROC)",
        shortName: "Company Registration",
        authority: "Ministry of Corporate Affairs",
        level: 0,
        levelName: "Prerequisites",
        timeline: "7–15 days",
        timelineDays: 15,
        validity: "Permanent",
        fees: "Based on authorized capital",
        category: null,
        canStartIndependently: true,
        dependencies: [],
        documents: [
            "Incorporation certificate",
            "Memorandum of Association (MOA)",
            "Articles of Association (AOA)",
            "PAN card of company",
            "GST registration (optional at this stage)"
        ],
        conditions: [],
        officialSource: "https://www.mca.gov.in/",
        applyUrl: "https://www.mca.gov.in/",
        applyMethod: "Online: MCA Portal",
        icon: "building",
        description: "Company registration with the Registrar of Companies under the Ministry of Corporate Affairs. Must be completed before applying for any industrial approvals.",
        maitriIntegrated: false
    },

    {
        id: "MSME_001",
        name: "Udyam Registration (MSME)",
        shortName: "Udyam / MSME",
        authority: "Ministry of MSME",
        level: 0,
        levelName: "Prerequisites",
        timeline: "1–3 days",
        timelineDays: 3,
        validity: "Permanent",
        fees: "Free",
        category: null,
        canStartIndependently: true,
        dependencies: [],
        documents: [
            "Aadhaar number",
            "PAN card",
            "Company registration certificate",
            "Investment details (plant & machinery)",
            "Bank account details"
        ],
        conditions: [],
        officialSource: "https://udyamregistration.gov.in/",
        applyUrl: "https://udyamregistration.gov.in/",
        applyMethod: "Online: Udyam Portal",
        icon: "award",
        description: "MSME registration under the Udyam portal. Optional but highly recommended — unlocks government schemes, subsidies, and priority lending.",
        maitriIntegrated: false
    },


    // =========================================
    //  LEVEL 1 : INDEPENDENT START
    // =========================================

    {
        id: "CTE_001",
        name: "Consent to Establish (CTE) — Red Category",
        shortName: "MPCB CTE",
        authority: "Maharashtra Pollution Control Board (MPCB)",
        level: 1,
        levelName: "Independent Start",
        timeline: "30 days",
        timelineDays: 30,
        validity: "3–5 years (project development period)",
        fees: "0.02% of capital investment or slab-based",
        category: "Red",
        canStartIndependently: true,
        dependencies: [],
        documents: [
            "CA Certificate (Capital Investment certificate)",
            "Balance Sheet / Capital Investment proof",
            "Manufacturing Process description",
            "Industry Registration (Udyam/ROC)",
            "Land Ownership Certificate (Sale deed/Lease/MIDC allotment)",
            "Detailed proposal of pollution control system",
            "Process flow diagram (all chemical reactions)",
            "Mass balance calculations",
            "ETP (Effluent Treatment Plant) design",
            "Air pollution control devices (scrubber/bag filter)",
            "Stack details",
            "Water balance statement",
            "Site plan showing boundaries, access, process areas, and pollution-control points",
            "Topographical map",
            "Layout plan of different processes",
            "Point sources of effluent discharge/emissions",
            "Position of stack and chimney details",
            "Consent fee payment proof (DD/online)"
        ],
        conditions: [
            "Construct ETP as per approved design",
            "Install air pollution control devices",
            "Maintain green belt and site safeguards as applicable to the project and competent authority requirements",
            "Submit compliance report before CTO application",
            "Install OCEMS (Online Continuous Emission Monitoring System) for Red Category"
        ],
        officialSource: "https://mpcb.gov.in/en/consentmgt/water-and-air-act",
        applyUrl: "https://www.ecmpcb.in/",
        applyMethod: "Online: ecmpcb.in / MPCB Sub-Regional Office",
        icon: "shield-check",
        description: "Consent to Establish from MPCB is mandatory BEFORE construction begins. Pharmaceutical API manufacturing is classified as Red Category. Delegated to Regional Officer (up to ₹10 Cr), Head of Department (₹10–50 Cr), or Consent Committee (₹50–150 Cr).",
        maitriIntegrated: true
    },

    {
        id: "BLDG_001",
        name: "Building Plan Approval",
        shortName: "Building Plan",
        authority: "Local Body (Municipal Corporation/Council) / MIDC",
        level: 1,
        levelName: "Independent Start",
        timeline: "1–3 months",
        timelineDays: 90,
        validity: "Permanent (for approved structure)",
        fees: "Based on built-up area, varies by local body",
        category: null,
        canStartIndependently: true,
        dependencies: [],
        documents: [
            "Application form (local body format)",
            "Land ownership / lease documents",
            "Site plan (showing boundaries, access road)",
            "Building plan (architectural drawings)",
            "Structural stability certificate (licensed structural engineer)",
            "FAR (Floor Area Ratio) calculation",
            "Setback compliance statement",
            "Parking provision details",
            "Fire scheme drawings (for Fire NOC)",
            "Property tax receipt",
            "Building permission fees payment proof",
            "Environmental clearance (if applicable, for large projects)"
        ],
        conditions: [
            "FAR as per local body bye-laws",
            "Ground coverage limits",
            "Setbacks (front, rear, sides)",
            "Height restrictions",
            "Fire tender access (minimum road width)",
            "Mandatory green belt"
        ],
        officialSource: null,
        applyUrl: null,
        applyMethod: "Local Municipal Corporation / MIDC office",
        icon: "layout",
        description: "Approval of building plans from the local municipal authority or MIDC before construction can begin. Covers structural safety, FAR, setbacks, and fire access.",
        maitriIntegrated: false
    },

    {
        id: "DISH_PLAN_001",
        name: "Factory Building Plan Approval (DISH)",
        shortName: "Factory Plan (DISH)",
        authority: "Directorate of Industrial Safety & Health (DISH)",
        level: 1,
        levelName: "Independent Start",
        timeline: "1–2 months",
        timelineDays: 60,
        validity: "Permanent (for approved layout)",
        fees: "Based on factory area, horsepower",
        category: null,
        canStartIndependently: true,
        dependencies: [],
        documents: [
            "Form No. 1 (prescribed format)",
            "Certificate of Incorporation",
            "MOA/AOA",
            "Board resolution for factory setup",
            "Occupier photograph (passport size)",
            "Occupier signature",
            "Occupier appointment letter",
            "Site plan (showing factory location, access)",
            "Factory layout plan (machine positions, aisle widths, exits, ventilation, sanitary facilities, first aid, fire safety)",
            "Manufacturing process description",
            "List of machinery with horsepower",
            "Worker strength (maximum expected)",
            "Safety policy (for hazardous factories)",
            "Risk assessment (for hazardous factories)",
            "Building plan approval copy (from local body)",
            "MPCB CTE copy (recommended)",
            "Fees payment proof"
        ],
        conditions: [],
        officialSource: "https://labour.maharashtra.gov.in/en/services",
        applyUrl: "https://lms.mahaonline.gov.in/",
        applyMethod: "Online: lms.mahaonline.gov.in / MAITRI portal",
        icon: "factory",
        description: "Factory building plan approval from DISH ensures the factory layout meets safety standards under the Factories Act 1948. Can be started parallel to building plan approval.",
        maitriIntegrated: true
    },

    {
        id: "FIRE_PROV_001",
        name: "Provisional Fire NOC",
        shortName: "Provisional Fire NOC",
        authority: "Maharashtra Fire Services (Local Fire Department)",
        level: 1,
        levelName: "Independent Start",
        timeline: "3–8 weeks",
        timelineDays: 56,
        validity: "Until final Fire NOC (typically 1–2 years)",
        fees: "Based on built-up area, varies",
        category: null,
        canStartIndependently: true,
        dependencies: [],
        documents: [
            "Application form (Annexure II or local format)",
            "Building proposal number (from local body)",
            "Approved building plans (from local body/MIDC)",
            "Fire safety layout plan (certified by licensed fire consultant)",
            "Underground static water tank details (capacity as per NBC 2016)",
            "Terrace fire tank details",
            "Fire pump room layout",
            "Hydrant ring main layout",
            "Sprinkler system details (if required for occupancy/height)",
            "Fire alarm system details",
            "Fire extinguishers provision",
            "Occupancy classification (Industrial/Storage as per NBC 2016 Part 4)",
            "Building height details",
            "Access road details (width for fire tender)",
            "Turning radius for fire tender",
            "Exit details (number, width, travel distance)",
            "Land ownership / lease documents",
            "Company registration documents",
            "Fees payment proof"
        ],
        conditions: [
            "Fire tender access (minimum 6m road width)",
            "Static water tank capacity based on occupancy and area",
            "Hydrant spacing as per NBC",
            "Exit widths and travel distances as per NBC",
            "Refuge area (if height > 24m)",
            "Pump room compliance"
        ],
        officialSource: null,
        applyUrl: null,
        applyMethod: "Local Fire Department office / Local body portal",
        icon: "flame",
        description: "Provisional Fire NOC is obtained at the design stage, before construction. Based on NBC 2016 Part 4. The fire department reviews fire safety provisions in the building plans.",
        maitriIntegrated: false
    },


    // =========================================
    //  LEVEL 2 : DEPENDENT ON LEVEL 1
    // =========================================

    {
        id: "PESO_001",
        name: "PESO License",
        shortName: "PESO License",
        authority: "Petroleum & Explosives Safety Organisation (PESO), Govt. of India",
        level: 2,
        levelName: "Dependent on Level 1",
        timeline: "2–6 months",
        timelineDays: 180,
        validity: "Annual renewal",
        fees: "Based on storage capacity",
        category: null,
        canStartIndependently: false,
        dependencies: ["FIRE_PROV_001", "BLDG_001"],
        documents: [
            "Application form (Form XIV/F for petroleum storage)",
            "Site plan showing storage tank location",
            "Safety distances from buildings, roads, other tanks",
            "Fire protection provisions layout",
            "Installation drawings (tank foundation, piping, valves)",
            "Fire NOC copy (provisional or final)",
            "Building plan approval copy",
            "Land ownership / lease documents",
            "NOC from local authority (municipality/panchayat)",
            "Tank test certificate (from manufacturer)",
            "Fire extinguishers details",
            "Sand bucket provisions",
            "'No Smoking' signboards details",
            "Lightning protection details (if applicable)",
            "Safety policy for petroleum storage",
            "Emergency response plan",
            "Fees payment proof"
        ],
        conditions: [
            "Diesel (Class B): >2,500 L requires District Authority license; >25,000 L requires PESO",
            "Petrol (Class A): Any quantity requires license",
            "LPG: >100 kg requires license"
        ],
        officialSource: "https://peso.gov.in/",
        applyUrl: "https://peso.gov.in/",
        applyMethod: "Online: peso.gov.in",
        icon: "fuel",
        description: "PESO license is required before storing diesel, solvents, or any petroleum product above threshold limits. Central government authority — not on MAITRI portal.",
        maitriIntegrated: false
    },

    {
        id: "CEIG_001",
        name: "Electrical Inspector (CEIG) Approval",
        shortName: "CEIG Electrical",
        authority: "Chief Electrical Inspectorate, Maharashtra",
        level: 2,
        levelName: "Dependent on Level 1",
        timeline: "3–8 weeks",
        timelineDays: 56,
        validity: "Permanent (for approved installation)",
        fees: "Based on connected load",
        category: null,
        canStartIndependently: false,
        dependencies: ["BLDG_001"],
        documents: [
            "Application form (CEIG format)",
            "Single Line Diagram (SLD) of electrical installation",
            "Load schedule (all machinery, lighting, HVAC)",
            "Transformer details (capacity, make, test certificates)",
            "DG set details (if applicable)",
            "Protection scheme (relays, circuit breakers)",
            "Earthing details",
            "Cable laying details",
            "Substation layout",
            "Electrical contractor license copy",
            "Test reports (from licensed electrical tester)",
            "Fees payment proof"
        ],
        conditions: [],
        officialSource: null,
        applyUrl: null,
        applyMethod: "CEIG office (Mumbai/Pune regional offices)",
        icon: "zap",
        description: "Approval from the Chief Electrical Inspector is required before energising an HT (High Tension) electrical connection. The installation must be complete before applying.",
        maitriIntegrated: false
    },

    {
        id: "BOILER_001",
        name: "Boiler Registration",
        shortName: "Boiler Registration",
        authority: "Chief Inspector of Boilers, Maharashtra",
        level: 2,
        levelName: "Dependent on Level 1",
        timeline: "4–10 weeks",
        timelineDays: 70,
        validity: "Annual renewal",
        fees: "Based on boiler capacity",
        category: null,
        canStartIndependently: false,
        dependencies: ["DISH_PLAN_001"],
        documents: [
            "Application form (Boiler Form)",
            "Boiler details (make, model, capacity)",
            "Manufacturing test certificates",
            "IBR (Indian Boiler Regulations) compliance certificate",
            "Boiler room layout",
            "Foundation details",
            "Safety valve details",
            "Pressure gauge details",
            "Feed pump details",
            "Water treatment plant details",
            "Operator certificates (licensed boiler operator)",
            "Fees payment proof"
        ],
        conditions: [],
        officialSource: null,
        applyUrl: null,
        applyMethod: "Directorate of Industrial Safety & Health (DISH)",
        icon: "gauge",
        description: "Boiler registration is required before firing any boiler in the factory. Requires the boiler to be fully installed and an IBR-compliant operator to be appointed.",
        maitriIntegrated: false
    },


    // =========================================
    //  LEVEL 3 : POST-CONSTRUCTION
    // =========================================

    {
        id: "CTO_001",
        name: "Consent to Operate (CTO) — Red Category",
        shortName: "MPCB CTO",
        authority: "Maharashtra Pollution Control Board (MPCB)",
        level: 3,
        levelName: "Post-Construction",
        timeline: "15 days (post-Feb 2026 reforms)",
        timelineDays: 15,
        validity: "1 year (Red Category — annual renewal)",
        fees: "Same as CTE (0.02% of capital investment or slab-based)",
        category: "Red",
        canStartIndependently: false,
        dependencies: ["CTE_001"],
        documents: [
            "Previous CTE copy",
            "Compliance report against CTE conditions",
            "CA Certificate / Balance Sheet / Capital Investment proof",
            "Manufacturing Process description",
            "Industry Registration",
            "Land Ownership Certificate",
            "Updated pollution control system proposal",
            "Photographs of installed pollution control systems",
            "ETP performance test report (from NABL-accredited lab)",
            "Effluent analysis reports (BOD, COD, TSS, pH, oil & grease)",
            "Air emission monitoring reports (from approved lab)",
            "Noise monitoring report",
            "Hazardous Waste Authorization copy",
            "Hazardous waste disposal records (manifest copies)",
            "OCEMS installation certificate",
            "OCEMS data summary",
            "ETP operation log book",
            "Updated machinery list",
            "Water audit data",
            "Third-party ETP audit report (for large Red units)",
            "Updated plant layout",
            "Consent fee payment proof"
        ],
        conditions: [
            "Effluent BOD: < 30 mg/L",
            "Effluent COD: < 250 mg/L",
            "Effluent TSS: < 100 mg/L",
            "Effluent pH: 6.5–9.0",
            "Bioassay: 96-hr LC₅₀ > 100%"
        ],
        officialSource: "https://mpcb.gov.in/en/consentmgt/water-and-air-act",
        applyUrl: "https://www.ecmpcb.in/",
        applyMethod: "Online: ecmpcb.in",
        icon: "shield",
        description: "Consent to Operate from MPCB is mandatory AFTER construction is complete but BEFORE starting operations. For Red Category, validity is 1 year with annual renewal. Post-Feb 2026 reforms reduced timeline to 15 days.",
        maitriIntegrated: true
    },

    {
        id: "FIRE_FINAL_001",
        name: "Final Fire NOC",
        shortName: "Final Fire NOC",
        authority: "Maharashtra Fire Services",
        level: 3,
        levelName: "Post-Construction",
        timeline: "2–6 weeks",
        timelineDays: 42,
        validity: "Annual renewal",
        fees: "Based on built-up area",
        category: null,
        canStartIndependently: false,
        dependencies: ["FIRE_PROV_001"],
        documents: [
            "Application for final NOC",
            "Provisional Fire NOC copy",
            "Completion certificate (from architect)",
            "As-built drawings (fire protection systems)",
            "Static water tank capacity test certificate",
            "Terrace tank installation certificate",
            "Fire pumps test certificates",
            "Hydrant ring pressure test report",
            "Sprinkler system test report (if installed)",
            "Fire alarm system installation certificate",
            "Fire extinguishers purchase bills & installation proof",
            "Fire safety audit report (from licensed consultant)",
            "Electrical installation certificate (for fire systems)",
            "Occupancy certificate (from local body, if available)",
            "Building completion photos",
            "Fire drill / evacuation plan",
            "Fire safety staff appointment (if required)",
            "Fees payment proof"
        ],
        conditions: [
            "Physical inspection by Fire department",
            "Tests fire pumps, hydrants, alarms on-site",
            "Verifies exit widths, travel distances",
            "Checks fire tender access road"
        ],
        officialSource: null,
        applyUrl: null,
        applyMethod: "Local Fire Department office",
        icon: "siren",
        description: "Final Fire NOC is issued after construction is complete and all fire protection systems are installed and tested. Fire department conducts a physical site inspection.",
        maitriIntegrated: false
    },

    {
        id: "FACTORY_LIC_001",
        name: "Factory License (DISH)",
        shortName: "Factory License",
        authority: "Directorate of Industrial Safety & Health (DISH)",
        level: 3,
        levelName: "Post-Construction",
        timeline: "30 days (MAITRI reforms)",
        timelineDays: 30,
        validity: "Annual renewal",
        fees: "Based on factory area, horsepower, worker strength",
        category: null,
        canStartIndependently: false,
        dependencies: ["DISH_PLAN_001", "CTO_001", "FIRE_FINAL_001"],
        documents: [
            "Form No. 2 (for factory license)",
            "Certificate of Incorporation",
            "MOA/AOA",
            "Board resolution for commencing operations",
            "Occupier photograph",
            "Occupier signature",
            "Occupier appointment letter",
            "Factory plan approval copy (Form 1 approval)",
            "MPCB CTO copy",
            "Fire NOC copy (final)",
            "As-built factory layout (actual machine positions)",
            "List of machinery with horsepower",
            "Worker strength (actual/expected)",
            "Manufacturing process description",
            "Safety policy (for hazardous factories)",
            "Risk assessment (for hazardous factories)",
            "Hazardous chemical storage details (if applicable)",
            "First aid provisions",
            "Sanitary facilities details",
            "Welfare facilities (canteen, restrooms, if applicable)",
            "Fees payment proof"
        ],
        conditions: [],
        officialSource: "https://labour.maharashtra.gov.in/en/services",
        applyUrl: "https://lms.mahaonline.gov.in/",
        applyMethod: "Online: lms.mahaonline.gov.in / MAITRI portal",
        icon: "file-check",
        description: "Factory License from DISH is mandatory BEFORE commencing operations. Under MAITRI reforms, timeline reduced to 30 days. Requires CTO, Final Fire NOC, and factory plan approval to be in place.",
        maitriIntegrated: true
    },

    {
        id: "HWA_001",
        name: "Hazardous Waste Authorization",
        shortName: "Hazardous Waste Auth.",
        authority: "Maharashtra Pollution Control Board (MPCB)",
        level: 3,
        levelName: "Post-Construction",
        timeline: "30–60 days",
        timelineDays: 60,
        validity: "5 years",
        fees: "Based on waste generation quantity",
        category: null,
        canStartIndependently: false,
        dependencies: ["CTO_001"],
        documents: [
            "Form 1 (prescribed format for hazardous waste authorization)",
            "Company registration documents",
            "MPCB CTE/CTO copy",
            "Process flow diagram showing hazardous waste generation points",
            "Hazardous waste characterisation (type, quantity, characteristics)",
            "Hazardous waste storage area layout",
            "Secondary containment provisions",
            "Labeling provisions",
            "Safety provisions (fire extinguishers, spill kit)",
            "Authorized recycler / TSDF details",
            "MoU with TSDF",
            "Authorized transporter details",
            "Hazardous waste manifest system (Form 8, 9, 10)",
            "Annual hazardous waste return (Form 3)",
            "Emergency response plan for hazardous waste incidents",
            "Fees payment proof"
        ],
        conditions: [
            "Solvent waste, chemical sludge must be characterized",
            "Secondary containment mandatory for storage",
            "MoU with authorized TSDF required",
            "Manifest system for all waste movements"
        ],
        officialSource: "https://mpcb.gov.in/en/hazardous",
        applyUrl: "https://mpcb.ecmpcb.in/marathi/hazardous/Registration.php",
        applyMethod: "Online: MPCB hazardous waste portal",
        icon: "alert-triangle",
        description: "Hazardous Waste Authorization is required before generating any hazardous waste. Pharmaceutical API manufacturing generates solvent waste, chemical sludge, and other hazardous materials. Can be applied simultaneously with CTO.",
        maitriIntegrated: true
    },


    // =========================================
    //  LEVEL 4 : INDUSTRY-SPECIFIC
    // =========================================

    {
        id: "DRUG_LIC_001",
        name: "Drug Manufacturing License",
        shortName: "Drug Mfg. License",
        authority: "State Drug Control Authority / Maharashtra FDA",
        level: 4,
        levelName: "Industry-Specific (Pharma)",
        timeline: "30–60 days (after inspection)",
        timelineDays: 60,
        validity: "5 years",
        fees: "₹6,000+ (varies by license type)",
        category: null,
        canStartIndependently: false,
        dependencies: ["CTO_001", "FIRE_FINAL_001", "FACTORY_LIC_001"],
        documents: [
            "Application Form 27-B (for Schedule C & C(1) drugs)",
            "Certificate of Incorporation",
            "MOA/AOA",
            "Board resolution for drug manufacturing",
            "Partnership deed (if partnership firm)",
            "Key Plan and Site Plan (blueprint/ammonia print)",
            "Land ownership / lease documents",
            "Property tax receipt",
            "Building plan approval copy",
            "MPCB CTE/CTO copies",
            "Fire NOC copy",
            "Factory License copy",
            "Site layout and plant master file",
            "Premises blueprint (manufacturing, QC lab, QA area, warehousing)",
            "Area measurements as per Schedule M",
            "List of equipment with calibration certificates",
            "Production head (qualification, experience, appointment letter)",
            "QA head (qualification, experience, appointment letter)",
            "QC head (qualification, experience, appointment letter)",
            "Biodata on proforma for technical staff",
            "Photographs (3 each) of key personnel",
            "Standard Operating Procedures (SOPs) covering Schedule M",
            "Validation Master Plan (VMP)",
            "Quality Manual aligned with Revised Schedule M",
            "Affidavit of non-conviction",
            "Affidavit from employer and technical staff for full-time working",
            "License fees payment proof (₹6,000+)",
            "Inspection fees payment proof (₹1,500)",
            "Declaration Form"
        ],
        conditions: [
            "Premises must comply with Schedule M (GMP requirements)",
            "Qualified personnel must be appointed full-time",
            "QC lab must be operational with equipment",
            "SOPs must cover all Schedule M requirements",
            "Physical inspection by Drug Inspector before license grant"
        ],
        officialSource: "https://cdsco.gov.in/",
        applyUrl: null,
        applyMethod: "Maharashtra FDA portal / CDSCO online system",
        icon: "pill",
        description: "Drug Manufacturing License is the final industry-specific approval required BEFORE manufacturing any pharmaceutical product. Issued under the Drugs and Cosmetics Act, 1940. Requires Schedule M compliance (GMP). State FDA conducts a physical inspection of premises.",
        maitriIntegrated: false
    }

];


// Level metadata
const LEVEL_META = {
    0: {
        name: "Prerequisites",
        subtitle: "Build the foundation for your application",
        action: "Start here",
        guide: "Complete these basic business and land requirements first.",
        color: "#64748b",
        bgColor: "#f1f5f9",
        borderColor: "#cbd5e1",
        icon: "clipboard-list"
    },
    1: {
        name: "Independent Start",
        subtitle: "Approvals you can begin next",
        action: "Start when ready",
        guide: "These can move forward once your prerequisites are in place.",
        color: "#1264d8",
        bgColor: "#eaf3ff",
        borderColor: "#bfdbfe",
        icon: "rocket"
    },
    2: {
        name: "Dependent on Level 1",
        subtitle: "Unlock after the previous stage",
        action: "Complete dependencies first",
        guide: "Finish the linked approvals below before starting these applications.",
        color: "#7c3aed",
        bgColor: "#f3f0ff",
        borderColor: "#ddd6fe",
        icon: "git-branch"
    },
    3: {
        name: "Post-Construction",
        subtitle: "Complete after your site is ready",
        action: "Plan for later",
        guide: "These approvals come after construction and installation are complete.",
        color: "#059669",
        bgColor: "#ecfdf5",
        borderColor: "#a7f3d0",
        icon: "check-circle"
    },
    4: {
        name: "Industry-Specific",
        subtitle: "Final approvals for your industry",
        action: "Finish your journey",
        guide: "Complete these final requirements before you begin operations.",
        color: "#d97706",
        bgColor: "#fffbeb",
        borderColor: "#fde68a",
        icon: "star"
    }
};


// =============================================
//  STATE
// =============================================

let completedApprovals = JSON.parse(
    localStorage.getItem("sih26130_completed") || "[]"
);

let activeApprovalId = null;


// =============================================
//  HELPER FUNCTIONS
// =============================================

function formatInvestment(amount) {

    if (!amount || amount === 0) return "—";

    if (amount >= 10000000) {
        return "₹" + (amount / 10000000).toFixed(2) + " Cr";
    }

    if (amount >= 100000) {
        return "₹" + (amount / 100000).toFixed(2) + " L";
    }

    return "₹" + amount.toLocaleString("en-IN");
}


function isCompleted(approvalId) {
    return completedApprovals.includes(approvalId);
}


function areDependenciesMet(approval) {

    if (approval.dependencies.length === 0) return true;

    return approval.dependencies.every(
        depId => isCompleted(depId)
    );
}


function getApprovalById(id) {
    return PHARMA_APPROVALS.find(a => a.id === id);
}


function saveCompleted() {
    localStorage.setItem(
        "sih26130_completed",
        JSON.stringify(completedApprovals)
    );
}

function getVaultDocuments() {
    return JSON.parse(localStorage.getItem("sih26130_document_vault") || "[]");
}

function getApprovalReadiness(approval) {
    const uploaded = getVaultDocuments().filter(document => document.approvalId === approval.id);
    const uploadedNames = new Set(uploaded.map(document => document.requirement));
    const complete = approval.documents.filter(document => uploadedNames.has(document)).length;

    return {
        complete,
        total: approval.documents.length,
        percent: approval.documents.length
            ? Math.round((complete / approval.documents.length) * 100)
            : 0
    };
}

function getReadinessAssessment(approval) {
    const readiness = getApprovalReadiness(approval);
    const dependenciesMet = areDependenciesMet(approval);
    const missingDocuments = approval.documents.filter(documentName => {
        return !getVaultDocuments().some(document => (
            document.approvalId === approval.id && document.requirement === documentName
        ));
    });
    const blockers = [];

    if (!dependenciesMet) {
        blockers.push("Complete the required prerequisite approvals first.");
    }

    if (missingDocuments.length > 0) {
        blockers.push(`${missingDocuments.length} mandatory document${missingDocuments.length === 1 ? " is" : "s are"} missing from the vault.`);
    }

    let state = "READY FOR SUBMISSION";
    if (!dependenciesMet || missingDocuments.length > 0) {
        state = "BLOCKED";
    } else {
        state = "NEEDS VERIFICATION";
    }

    return {
        state,
        score: readiness.percent,
        dependenciesMet,
        missingDocuments,
        blockers,
        note: state === "NEEDS VERIFICATION"
            ? "All listed documents are present. Verify authenticity, validity, signatures, and data consistency before submission."
            : "Resolve the blockers below before preparing a submission."
    };
}

function getNextAction(approval, assessment) {
    if (!assessment.dependenciesMet) {
        const pendingDependency = approval.dependencies.find(id => !isCompleted(id));
        const dependency = getApprovalById(pendingDependency);
        return dependency
            ? `Complete ${dependency.shortName} first.`
            : "Complete the pending prerequisite approval first.";
    }

    if (assessment.missingDocuments.length > 0) {
        return `Upload ${assessment.missingDocuments[0]} to the Document Vault.`;
    }

    return "Verify document authenticity and application details before submission.";
}

// =============================================
//  FETCH BUSINESS PROFILE
// =============================================

async function fetchProfile() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/business/latest"
        );

        const data = await response.json();

        if (data.success && data.business) {
            return data.business;
        }

        return null;

    } catch (error) {

        console.error("Failed to fetch profile:", error);
        return null;

    }
}


// =============================================
//  RENDER PROFILE SUMMARY
// =============================================

function renderProfile(business) {

    const container = document.getElementById("profileSummary");

    if (!business) {
        container.innerHTML = `
            <div class="no-profile">
                <i data-lucide="alert-circle"></i>
                <p>No business profile found. <a href="profile.html">Create one</a> to get your personalised approval roadmap.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    const industryLabels = {
        food_processing: "Food Processing",
        textile: "Textile",
        automobile: "Automobile",
        pharmaceutical: "Pharmaceutical",
        electronics: "Electronics",
        chemical: "Chemical",
        it: "Information Technology",
        other: "Other"
    };

    const stageLabels = {
        planning: "Planning / Proposed",
        setup: "Setting Up",
        operational: "Operational",
        expansion: "Expansion"
    };

    const typeLabels = {
        manufacturing: "Manufacturing",
        service: "Service",
        trading: "Trading",
        startup: "Startup",
        msme: "MSME"
    };

    container.innerHTML = `

        <div class="summary-header">

            <div class="summary-title">
                <i data-lucide="building-2"></i>
                <div>
                    <h3>${business.businessName}</h3>
                    <span class="summary-badge">${typeLabels[business.businessType] || business.businessType}</span>
                    <span class="summary-badge stage">${stageLabels[business.businessStage] || business.businessStage}</span>
                </div>
            </div>

            <a href="profile.html" class="edit-link">
                <i data-lucide="pencil"></i>
                Edit Profile
            </a>

        </div>

        <div class="summary-grid">

            <div class="summary-item">
                <label>Industry</label>
                <span>${industryLabels[business.industry] || business.industry}</span>
            </div>

            <div class="summary-item">
                <label>Sub-Industry</label>
                <span>${business.subIndustry || "—"}</span>
            </div>

            <div class="summary-item">
                <label>District</label>
                <span>${business.district}, ${business.state}</span>
            </div>

            <div class="summary-item">
                <label>Investment</label>
                <span>${formatInvestment(business.investment)}</span>
            </div>

            <div class="summary-item">
                <label>Land Area</label>
                <span>${business.landArea} Acres</span>
            </div>

            <div class="summary-item">
                <label>Employees</label>
                <span>${business.employees}</span>
            </div>

        </div>
    `;

    lucide.createIcons();
}

function renderIndustryMessage(business) {
    const container = document.getElementById("dependencyGraph");

    if (!business) {
        container.innerHTML = `
            <div class="industry-message">
                <i data-lucide="user-plus"></i>
                <div>
                    <h3>Create your business profile first</h3>
                    <p>We need your business details before we can prepare your approval roadmap.</p>
                    <a class="industry-edit-link" href="profile.html">Create Business Profile</a>
                </div>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    container.innerHTML = `
        <div class="industry-message">
            <i data-lucide="info"></i>
            <div>
                <h3>Sorry, we currently have approval data only for pharmaceutical businesses.</h3>
                <a class="industry-edit-link" href="profile.html">Edit Profile</a>
            </div>
        </div>
    `;
    lucide.createIcons();
}


// =============================================
//  RENDER DEPENDENCY GRAPH
// =============================================

function renderGraph() {

    const container = document.getElementById("dependencyGraph");

    // Group by level
    const levels = {};

    PHARMA_APPROVALS.forEach(approval => {
        if (!levels[approval.level]) {
            levels[approval.level] = [];
        }
        levels[approval.level].push(approval);
    });


    let html = "";

    const levelKeys = Object.keys(levels).sort((a, b) => a - b);

    levelKeys.forEach((level, index) => {

        const meta = LEVEL_META[level];
        const approvals = levels[level];

        // Level connector (between levels)
        if (index > 0) {
            html += `
                <div class="level-connector">
                    <div class="connector-line" style="background: ${meta.color}20; border-left: 2px dashed ${meta.color}60"></div>
                    <div class="connector-dots">
                        <span style="background: ${meta.color}"></span>
                        <span style="background: ${meta.color}"></span>
                        <span style="background: ${meta.color}"></span>
                    </div>
                </div>
            `;
        }

        // Level group
        html += `
            <div class="level-group" data-level="${level}">

                <div class="level-header">

                    <div class="level-badge" style="background: ${meta.bgColor}; color: ${meta.color}; border-color: ${meta.borderColor}">
                        <i data-lucide="${meta.icon}"></i>
                        <span>Step ${Number(level) + 1}</span>
                    </div>

                    <div class="level-info">
                        <h3>${meta.name}</h3>
                        <p>${meta.subtitle}</p>
                    </div>

                    <div class="level-count">
                        <strong>${approvals.filter(a => isCompleted(a.id)).length} / ${approvals.length}</strong>
                        <span>complete</span>
                    </div>

                </div>

                <div class="level-guide">
                    <span class="level-action" style="color: ${meta.color}">${meta.action}</span>
                    <span>${meta.guide}</span>
                </div>

                <div class="level-cards">
        `;


        approvals.forEach(approval => {

            const completed = isCompleted(approval.id);
            const depsMet = areDependenciesMet(approval);
            const isActive = activeApprovalId === approval.id;
            const readiness = getApprovalReadiness(approval);
            const assessment = getReadinessAssessment(approval);

            let statusClass = "not-started";
            let statusText = "Not Started";
            let statusIcon = "circle";

            if (completed) {
                statusClass = "completed";
                statusText = "Completed";
                statusIcon = "check-circle";
            } else if (assessment.state === "BLOCKED") {
                statusClass = "blocked";
                statusText = "Blocked";
                statusIcon = "lock";
            } else {
                statusText = "Needs verification";
                statusIcon = "search-check";
            }

            html += `
                <div class="approval-card ${statusClass} ${isActive ? "active" : ""}"
                     data-id="${approval.id}"
                     onclick="openDetail('${approval.id}')"
                     style="border-left-color: ${meta.color}">

                    <div class="card-icon" style="background: ${meta.bgColor}; color: ${meta.color}">
                        <i data-lucide="${approval.icon}"></i>
                    </div>

                    <div class="card-body">

                        <h4>${approval.shortName}</h4>

                        <p class="card-authority">${approval.authority.split("(")[0].trim()}</p>

                        <div class="card-meta">

                            <span class="card-timeline">
                                <i data-lucide="clock"></i>
                                ${approval.timeline}
                            </span>

                            <span class="card-readiness">Prep ${assessment.score}%</span>

                        </div>

                        <span class="card-next-action">${completed ? "Review details" : getNextAction(approval, assessment)}</span>

                    </div>

                    <div class="card-status ${statusClass}">
                        <i data-lucide="${statusIcon}"></i>
                        <span>${statusText}</span>
                    </div>

                    ${approval.maitriIntegrated ? '<div class="maitri-tag">MAITRI</div>' : ''}

                </div>
            `;
        });


        html += `
                </div>
            </div>
        `;
    });


    container.innerHTML = html;

    lucide.createIcons();
}


// =============================================
//  RENDER DETAIL PANEL
// =============================================

function openDetail(approvalId) {

    const approval = getApprovalById(approvalId);

    if (!approval) return;

    // Toggle if same
    if (activeApprovalId === approvalId) {
        closeDetail();
        return;
    }

    activeApprovalId = approvalId;

    const panel = document.getElementById("detailPanel");
    const meta = LEVEL_META[approval.level];
    const completed = isCompleted(approval.id);
    const depsMet = areDependenciesMet(approval);
    const assessment = getReadinessAssessment(approval);
    const nextAction = getNextAction(approval, assessment);


    // Dependencies HTML
    let depsHtml = "";

    if (approval.dependencies.length > 0) {

        depsHtml = `
            <div class="detail-section">
                <h4>
                    <i data-lucide="git-branch"></i>
                    Dependencies
                </h4>
                <div class="dep-list">
        `;

        approval.dependencies.forEach(depId => {

            const dep = getApprovalById(depId);
            const depDone = isCompleted(depId);

            depsHtml += `
                <div class="dep-item ${depDone ? "met" : "unmet"}">
                    <i data-lucide="${depDone ? "check-circle" : "circle"}"></i>
                    <span>${dep ? dep.shortName : depId}</span>
                    <span class="dep-status">${depDone ? "Complete" : "Pending"}</span>
                </div>
            `;
        });

        depsHtml += `
                </div>
            </div>
        `;

    } else {

        depsHtml = `
            <div class="detail-section">
                <h4>
                    <i data-lucide="git-branch"></i>
                    Dependencies
                </h4>
                <p class="no-deps">
                    <i data-lucide="check-circle"></i>
                    No dependencies — can start independently
                </p>
            </div>
        `;
    }


    // Documents HTML
    let docsHtml = `
        <div class="detail-section">
            <h4>
                <i data-lucide="file-text"></i>
                Documents Required (${approval.documents.length}) · ${assessment.score}% present
            </h4>
            <div class="doc-list">
    `;

    const uploadedRequirements = new Set(
        getVaultDocuments()
            .filter(document => document.approvalId === approval.id)
            .map(document => document.requirement)
    );

    approval.documents.forEach((doc, i) => {
        const uploaded = uploadedRequirements.has(doc);
        docsHtml += `
            <div class="doc-item ${uploaded ? "uploaded" : "missing"}">
                <span class="doc-number">${i + 1}</span>
                <span class="doc-name">${doc}</span>
                <span class="doc-status">${uploaded ? "Present · verify" : "Missing"}</span>
            </div>
        `;
    });

    docsHtml += `
            </div>
        </div>
    `;


    // Conditions HTML
    let conditionsHtml = "";

    if (approval.conditions && approval.conditions.length > 0) {

        conditionsHtml = `
            <div class="detail-section">
                <h4>
                    <i data-lucide="alert-circle"></i>
                    Key Conditions / Requirements
                </h4>
                <ul class="conditions-list">
        `;

        approval.conditions.forEach(cond => {
            conditionsHtml += `<li>${cond}</li>`;
        });

        conditionsHtml += `
                </ul>
            </div>
        `;
    }


    // Links HTML
    let linksHtml = `<div class="detail-links">`;

    if (approval.officialSource) {
        linksHtml += `
            <a href="${approval.officialSource}" target="_blank" class="detail-link official">
                <i data-lucide="external-link"></i>
                Official Source
            </a>
        `;
    }

    if (approval.applyUrl) {
        linksHtml += `
            <a href="${approval.applyUrl}" target="_blank" class="detail-link apply">
                <i data-lucide="send"></i>
                Apply Online
            </a>
        `;
    }

    if (approval.applyMethod) {
        linksHtml += `
            <span class="apply-method">
                <i data-lucide="info"></i>
                ${approval.applyMethod}
            </span>
        `;
    }

    linksHtml += `</div>`;


    // Full panel
    panel.innerHTML = `

        <div class="detail-top" style="border-top-color: ${meta.color}">

            <button class="detail-close" onclick="closeDetail()">
                <i data-lucide="x"></i>
            </button>

            <div class="detail-header">

                <div class="detail-icon" style="background: ${meta.bgColor}; color: ${meta.color}">
                    <i data-lucide="${approval.icon}"></i>
                </div>

                <div class="detail-title">
                    <h3>${approval.name}</h3>
                    <p class="detail-authority">${approval.authority}</p>
                </div>

            </div>

            <p class="detail-desc">${approval.description}</p>

            <div class="readiness-assessment ${assessment.state === "BLOCKED" ? "blocked" : "verification-needed"}">
                <div class="assessment-state">
                    <span class="assessment-label">APPLICATION READINESS</span>
                    <strong>${assessment.state}</strong>
                    <span>${assessment.score}% preparation complete</span>
                </div>
                <div class="assessment-next">
                    <span>Next best action</span>
                    <strong>${nextAction}</strong>
                </div>
            </div>

            <div class="detail-meta-grid">

                <div class="meta-item">
                    <i data-lucide="clock"></i>
                    <div>
                        <label>Timeline</label>
                        <span>${approval.timeline}</span>
                    </div>
                </div>

                <div class="meta-item">
                    <i data-lucide="calendar"></i>
                    <div>
                        <label>Validity</label>
                        <span>${approval.validity}</span>
                    </div>
                </div>

                <div class="meta-item">
                    <i data-lucide="indian-rupee"></i>
                    <div>
                        <label>Fees</label>
                        <span>${approval.fees}</span>
                    </div>
                </div>

                ${approval.category ? `
                <div class="meta-item">
                    <i data-lucide="tag"></i>
                    <div>
                        <label>Category</label>
                        <span class="category-tag red">${approval.category}</span>
                    </div>
                </div>
                ` : ""}

            </div>

        </div>

        ${depsHtml}

        ${assessment.blockers.length ? `
            <div class="detail-section assessment-issues">
                <h4><i data-lucide="alert-triangle"></i> Why this is not ready</h4>
                <ul class="conditions-list">${assessment.blockers.map(blocker => `<li>${blocker}</li>`).join("")}</ul>
            </div>
        ` : `
            <div class="detail-section assessment-clear">
                <h4><i data-lucide="shield-check"></i> Pre-submission check</h4>
                <p>${assessment.note}</p>
            </div>
        `}

        ${docsHtml}

        ${conditionsHtml}

        ${linksHtml}

        <div class="detail-action">
            <button class="complete-btn ${completed ? "completed" : ""}"
                    onclick="toggleComplete('${approval.id}')">
                <i data-lucide="${completed ? "check-circle" : "circle"}"></i>
                <span>${completed ? "Marked as Complete" : "Mark as Complete"}</span>
            </button>
        </div>

    `;


    panel.classList.add("show");

    // Refresh icons
    lucide.createIcons();

    // Update graph card states
    renderGraph();

    // Scroll detail into view
    panel.scrollIntoView({ behavior: "smooth", block: "start" });
}


function closeDetail() {

    activeApprovalId = null;

    const panel = document.getElementById("detailPanel");
    panel.classList.remove("show");
    panel.innerHTML = "";

    renderGraph();
}


// =============================================
//  COMPLETION TOGGLE
// =============================================

function toggleComplete(approvalId) {

    if (isCompleted(approvalId)) {

        completedApprovals = completedApprovals.filter(
            id => id !== approvalId
        );

    } else {

        completedApprovals.push(approvalId);

    }

    saveCompleted();

    updateProgress();
    // Re-render detail and graph
    activeApprovalId = null;
    openDetail(approvalId);
}


// =============================================
//  PROGRESS BAR
// =============================================

function updateProgress() {

    const total = PHARMA_APPROVALS.length;
    const done = completedApprovals.length;
    const percent = Math.round((done / total) * 100);

    document.getElementById("progressFill").style.width =
        percent + "%";

    document.getElementById("progressText").textContent =
        `${done} / ${total} Approvals Complete`;

    document.getElementById("progressPercent").textContent =
        `${percent}%`;

    // Update critical path
    const criticalEl = document.getElementById("criticalPath");

    if (done === 0) {
        criticalEl.textContent = "Estimated Timeline: 8–9 months (best case)";
    } else if (done <= 3) {
        criticalEl.textContent = "Estimated Remaining: 7–8 months";
    } else if (done <= 7) {
        criticalEl.textContent = "Estimated Remaining: 4–6 months";
    } else if (done <= 11) {
        criticalEl.textContent = "Estimated Remaining: 2–3 months";
    } else if (done <= 14) {
        criticalEl.textContent = "Estimated Remaining: 1–2 months";
    } else {
        criticalEl.textContent = "🎉 All approvals complete!";
    }
}


// =============================================
//  INITIALISE
// =============================================

async function init() {

    if (!document.getElementById("dependencyGraph")) {
        return;
    }

    // Fetch and render profile
    const business = await fetchProfile();
    renderProfile(business);

    if (business && business.industry === "pharmaceutical") {
        renderGraph();
    } else {
        renderIndustryMessage(business);
    }

    // Update progress bar
    updateProgress();

}


document.addEventListener("DOMContentLoaded", init);
