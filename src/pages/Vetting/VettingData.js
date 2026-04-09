const formatToday = () =>
  new Intl.DateTimeFormat("en-GB").format(new Date()).replace(/\//g, ".");

const createRows = (count, factory) =>
  Array.from({ length: count }, (_, index) => factory(index));

export const STATUS_OPTS = [
  "All Statuses",
  "Vetted",
  "Draft",
  "Pending",
  "Not vetted",
];

export const TYPE_OPTS = [
  "All Types",
  "Fraud",
  "PIDPI",
  "CVC",
  "Whistle blower",
  "Misconduct",
  "NPA",
];

export const SOURCE_OPTS = [
  "All Sources",
  "Internal",
  "Customer",
  "RBI",
  "Agency",
  "FRMD",
  "Whistleblower",
];

export const VETTING_CHECKLIST_SECTIONS = [
  {
    number: "1.",
    items: [
      {
        field: "prescribedFormat",
        label: "Whether report is in prescribed format",
      },
    ],
  },
  {
    number: "2.",
    title: "Coverage",
    items: [
      { field: "coverageListedScope", label: "Coverage of listed scope" },
      {
        field: "coverageConcernedPersons",
        label: 'All concerned persons are contacted "in person"',
      },
      {
        field: "coverageStatementsObtained",
        label:
          "Statement of staff members and customer / borrower / complainant is obtained",
      },
      {
        field: "coverageOfficialsRole",
        label:
          "Examination of role of all officials (period wise) in Pre Sanction / Recommendation / Sanction / Disbursement / Monitoring stage is brought out",
      },
      {
        field: "coverageExternalAgencyRole",
        label:
          "Examination of role of External agency such as Due-diligence / Legal / Valuator etc",
      },
      {
        field: "coverageSanctionCommitteeRole",
        label:
          "Role of all members of Sanctioning Committee i.e. SZLCC and ZLCC / NBGLCC, SMECC / RBC (including committee head) is brought out",
      },
      {
        field: "coverageCpaRbia",
        label: "Examination of role of CPA officials involved in RBIA",
      },
      {
        field: "coverageCpaPsr",
        label: "Examination of role of CPA officials involved in PSRs",
      },
      {
        field: "coverageCpaInspections",
        label:
          "Examination of role of CPA officials involved in Credit / Other Inspections",
      },
      {
        field: "coverageAuditFindings",
        label:
          "Findings / Scrutiny of Concurrent Audit / Statutory Audit / Legal Audit",
      },
      {
        field: "coverageControllingOfficeRole",
        label: "Examination of role of Controlling Office / Authority",
      },
      {
        field: "coverageBankAccounts",
        label: "Scrutiny of Bank accounts of erring officials has been done?",
      },
    ],
  },
  {
    number: "3.",
    title: "Attribution of lapses",
    items: [
      {
        field: "attributionDocumentaryProof",
        label:
          "Lapses reported in the report are backed by documentary proof.",
      },
      {
        field: "attributionOfficialWise",
        label:
          "Official wise attribution of lapses is brought out in report supported by evidences",
      },
      {
        field: "attributionVersionCalled",
        label:
          "Versions of erring official are called and observation of IO provided",
      },
      {
        field: "attributionProperlyAttributed",
        label:
          "Lapses are properly attributed considering official's role, capacity / designation, tenure and considering version of official, if no provide details.",
      },
    ],
  },
  {
    number: "4.",
    items: [
      {
        field: "officialsSuperannuatingNext12Months",
        label:
          "Officials, superannuating in next 12 months and / or Case of expiring of Cause of Action is brought out in report",
      },
    ],
  },
  {
    number: "5.",
    items: [
      {
        field: "evidencesEnclosed",
        label: "Evidences / documents are enclosed with report.",
      },
    ],
  },
  {
    number: "6.",
    items: [
      {
        field: "delayReasonMentioned",
        label: "Reason for delay in submission of report is mentioned.",
      },
    ],
  },
];

const createChecklistResponses = () =>
  VETTING_CHECKLIST_SECTIONS.flatMap((section) => section.items).reduce(
    (acc, item) => {
      acc[item.field] = "";
      return acc;
    },
    {},
  );

const createAttributableOfficials = () =>
  createRows(4, () => ({
    namePfDesignation: "",
    stage: "",
    lapses: "",
  }));

const createAssetLiabilityRows = () =>
  createRows(3, () => ({
    namePfDesignation: "",
    statementDetails: "",
    observations: "",
  }));

const createSuperannuatingOfficials = () =>
  createRows(5, () => ({
    namePfNo: "",
    scaleDesignation: "",
    roleInCase: "",
    dateOfSuperannuation: "",
  }));

const createSuspendedOfficials = () =>
  createRows(1, () => ({
    namePfNo: "",
    scaleDesignation: "",
    dateOfSuspension: "",
  }));

export function createEmptyVettingForm() {
  return {
    refNo: "",
    referenceNumber: "",
    date: formatToday(),
    status: "Draft",
    typeOfComplaint: "",
    sourceOfComplaint: "",
    branchZone: "",
    caseNo: "",
    accountIncident: "",
    dateOfIncident: "",
    dateOfInvestigationOrder: "",
    dateOfAllotmentInvestigation: "",
    dateOfSubmissionReport: "",
    presentReferenceMemoNo: "",
    presentReferenceDate: "",
    attributableOfficials: createAttributableOfficials(),
    assetLiabilityRows: createAssetLiabilityRows(),
    superannuatingOfficials: createSuperannuatingOfficials(),
    suspendedOfficials: createSuspendedOfficials(),
    checklistResponses: createChecklistResponses(),
    deskOfficerName: "",
    deskOfficerDesignation: "",
    committeeObservation: "",
    reportPerusedDate: "",
    reportPerusedAccount: "",
    reportSubmittedBy: "",
    committeeDate: "",
    isFormVetted: "",
    dateOfVetting: "",
    attachDocument: null,
  };
}

const buildVettingRow = (overrides = {}) => ({
  ...createEmptyVettingForm(),
  ...overrides,
});

export const mockDashboard = {
  vettingList: [
    buildVettingRow({
      id: "1",
      referenceNumber: "HO/VIG/2023-24/017",
      refNo: "HO/VIG/Case/2023-24/017",
      date: "07.09.2023",
      typeOfComplaint: "Fraud",
      sourceOfComplaint: "Internal",
      status: "Pending",
      branchZone: "Mumbai Zone",
      caseNo: "VIG/IR/017",
      accountIncident: "ABC Industries Ltd.",
      dateOfIncident: "06.06.2023",
      dateOfInvestigationOrder: "12.06.2023",
      dateOfAllotmentInvestigation: "15.06.2023",
      dateOfSubmissionReport: "07.09.2023",
      presentReferenceMemoNo: "17",
      presentReferenceDate: "07-09-2023",
      attributableOfficials: [
        {
          namePfDesignation: "R. Kumar / PF12345 / Branch Manager",
          stage: "Sanction",
          lapses: "Deviation in sanction and monitoring controls",
        },
        {
          namePfDesignation: "S. Nair / PF54321 / Senior Manager",
          stage: "Post disbursement",
          lapses: "Irregular review of stock statements and inspection",
        },
        ...createAttributableOfficials().slice(2),
      ],
      assetLiabilityRows: [
        {
          namePfDesignation: "R. Kumar / PF12345 / Branch Manager",
          statementDetails: "Statement received on 04.09.2023",
          observations: "No material mismatch observed",
        },
        {
          namePfDesignation: "S. Nair / PF54321 / Senior Manager",
          statementDetails: "Statement awaited from official",
          observations: "Follow-up required before closure",
        },
        ...createAssetLiabilityRows().slice(2),
      ],
      superannuatingOfficials: [
        {
          namePfNo: "A. Mehta / PF88441",
          scaleDesignation: "SMGS-IV / Chief Manager",
          roleInCase: "Sanctioning authority",
          dateOfSuperannuation: "31.03.2024",
        },
        {
          namePfNo: "V. Rao / PF77219",
          scaleDesignation: "MMGS-III / Senior Manager",
          roleInCase: "Monitoring",
          dateOfSuperannuation: "30.06.2024",
        },
        ...createSuperannuatingOfficials().slice(2),
      ],
      suspendedOfficials: [
        {
          namePfNo: "P. Roy / PF90211",
          scaleDesignation: "MMGS-II / Manager",
          dateOfSuspension: "22.07.2023",
        },
      ],
      checklistResponses: {
        ...createChecklistResponses(),
        prescribedFormat: "Yes",
        coverageListedScope: "Yes",
        coverageConcernedPersons: "Yes",
        coverageStatementsObtained: "Yes",
        coverageOfficialsRole: "Yes",
        coverageExternalAgencyRole: "NA",
        coverageSanctionCommitteeRole: "Yes",
        coverageCpaRbia: "Yes",
        coverageCpaPsr: "Yes",
        coverageCpaInspections: "No",
        coverageAuditFindings: "Yes",
        coverageControllingOfficeRole: "Yes",
        coverageBankAccounts: "No",
        attributionDocumentaryProof: "Yes",
        attributionOfficialWise: "Yes",
        attributionVersionCalled: "Yes",
        attributionProperlyAttributed: "Yes",
        officialsSuperannuatingNext12Months: "Yes",
        evidencesEnclosed: "Yes",
        delayReasonMentioned: "Yes",
      },
      deskOfficerName: "Rahul Sharma",
      deskOfficerDesignation: "Senior Manager",
      committeeObservation:
        "Report reviewed. Attribution of lapses and supporting records may be placed before the competent authority.",
      reportPerusedDate: "07.09.2023",
      reportPerusedAccount: "ABC Industries Ltd.",
      reportSubmittedBy: "Senior Manager, Vigilance Desk",
      committeeDate: "18-09-2023",
      isFormVetted: "Pending",
    }),
    buildVettingRow({
      id: "2",
      referenceNumber: "HO/VIG/2024-25/006",
      refNo: "HO/VIG/Case/2024-25/006",
      date: "18.01.2024",
      typeOfComplaint: "PIDPI",
      sourceOfComplaint: "Customer",
      status: "Vetted",
      branchZone: "Ahmedabad Zone",
      caseNo: "VIG/IR/006",
      accountIncident: "XYZ Exports",
      dateOfIncident: "04.01.2024",
      dateOfInvestigationOrder: "09.01.2024",
      dateOfAllotmentInvestigation: "11.01.2024",
      dateOfSubmissionReport: "18.01.2024",
      presentReferenceMemoNo: "06",
      presentReferenceDate: "18-01-2024",
      attributableOfficials: [
        {
          namePfDesignation: "P. Sharma / PF67890 / Assistant Manager",
          stage: "Recovery",
          lapses: "Improper conduct with complainant during recovery visit",
        },
        ...createAttributableOfficials().slice(1),
      ],
      assetLiabilityRows: createAssetLiabilityRows(),
      superannuatingOfficials: createSuperannuatingOfficials(),
      suspendedOfficials: createSuspendedOfficials(),
      checklistResponses: {
        ...createChecklistResponses(),
        prescribedFormat: "Yes",
        coverageListedScope: "Yes",
        coverageConcernedPersons: "Yes",
        coverageStatementsObtained: "Yes",
        coverageOfficialsRole: "Yes",
        coverageExternalAgencyRole: "NA",
        coverageSanctionCommitteeRole: "NA",
        coverageCpaRbia: "NA",
        coverageCpaPsr: "NA",
        coverageCpaInspections: "NA",
        coverageAuditFindings: "No",
        coverageControllingOfficeRole: "Yes",
        coverageBankAccounts: "NA",
        attributionDocumentaryProof: "Yes",
        attributionOfficialWise: "Yes",
        attributionVersionCalled: "Yes",
        attributionProperlyAttributed: "Yes",
        officialsSuperannuatingNext12Months: "No",
        evidencesEnclosed: "Yes",
        delayReasonMentioned: "Yes",
      },
      deskOfficerName: "Priya Desai",
      deskOfficerDesignation: "Manager",
      committeeObservation:
        "Investigation report is in order and may be processed further.",
      reportPerusedDate: "18.01.2024",
      reportPerusedAccount: "XYZ Exports",
      reportSubmittedBy: "Manager, Vigilance Desk",
      committeeDate: "22-01-2024",
      isFormVetted: "Yes",
      dateOfVetting: "22.01.2024",
    }),
    buildVettingRow({
      id: "3",
      referenceNumber: "HO/VIG/2024-25/014",
      refNo: "HO/VIG/Case/2024-25/014",
      date: "05.02.2024",
      typeOfComplaint: "CVC",
      sourceOfComplaint: "RBI",
      status: "Draft",
      branchZone: "Delhi Zone",
      caseNo: "VIG/IR/014",
      accountIncident: "LMN Infrastructure",
      dateOfIncident: "25.01.2024",
      dateOfInvestigationOrder: "28.01.2024",
      dateOfAllotmentInvestigation: "30.01.2024",
      dateOfSubmissionReport: "",
      presentReferenceMemoNo: "",
      presentReferenceDate: "",
      isFormVetted: "No",
    }),
  ],
};
