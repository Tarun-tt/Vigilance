export const metaDataFields = [
  {
    label: "File Name",
    name: "fileName",
    type: "text",
    required: true,
    maxLength: 50,
    placeholder: "Enter file name",
  },
  {
    label: "File Title",
    name: "fileTitle",
    type: "text",
    required: true,
    maxLength: 50,
    placeholder: "Enter file title",
  },
  {
    label: "Document Type",
    name: "docType",
    type: "select",
    required: true,
    optionsKey: "documentOptions",
    placeholder: "Select document type",
  },
  {
    label: "Category",
    name: "cateType",
    type: "select",
    required: true,
    optionsKey: "categoryOptions",
    placeholder: "Select category",
  },
  {
    label: "Classification",
    name: "classType",
    type: "select",
    required: true,
    optionsKey: "classificationOptions",
    placeholder: "Select classification",
  },
  {
    label: "Tags",
    name: "tagsType",
    type: "multiselect",
    required: true,
    optionsKey: "tagOptions",
    placeholder: "Select tags",
  },
  {
    label: "Keyword",
    name: "keyword",
    type: "text",
    required: true,
    maxLength: 50,
    placeholder: "Enter keywords",
  },
  {
    label: "Description",
    name: "description",
    type: "textarea",
    required: false,
    maxLength: 200,
    rows: 3,
    placeholder: "Enter description",
  },
  {
    label: "Issue Date",
    name: "issueDate",
    type: "date",
    required: true,
    placeholder: "Select issue date",
  },
  {
    label: "Expiry Date",
    name: "expiryDate",
    type: "date",
    required: false,
    placeholder: "Select expiry date",
  },
];

export const decisionFields = [
  {
    label: "Decision",
    name: "decision",
    type: "text",
    required: false,
    maxLength: 50,
    pattern: "^[a-zA-Z0-9 ]*$",
    errorMessage: "Special characters are not allowed",
    placeholder: "Enter decision",
  },
  {
    label: "Decision Date",
    name: "decisionDate",
    type: "date",
    required: false,
    placeholder: "Select decision date",
  },
  {
    label: "Decision Status",
    name: "decisionStatus",
    type: "select",
    required: false,
    optionsKey: "decisionStatusOptions",
    placeholder: "Select decision status",
  },
  {
    label: "Reviewer Comments",
    name: "reviewerComments",
    type: "textarea",
    required: false,
    maxLength: 500,
    rows: 4,
    placeholder: "Enter reviewer comments",
  },
];

export const allFields = [...metaDataFields, ...decisionFields];

export const getInitialFormState = () => {
  const formState = {};

  allFields.forEach((field) => {
    if (field.name.includes(".")) {
      const [parent, child] = field.name.split(".");
      if (!formState[parent]) {
        formState[parent] = {};
      }
      formState[parent][child] = "";
    } else {
      formState[field.name] = "";
    }
  });

  return formState;
};

export const getOptionsMap = () => ({
  documentOptions: [
    { id: "pdf", label: "PDF Document" },
    { id: "word", label: "Word Document" },
    { id: "excel", label: "Excel Spreadsheet" },
    { id: "image", label: "Image File" },
    { id: "other", label: "Other" },
  ],
  categoryOptions: [
    { id: "financial", label: "Financial" },
    { id: "legal", label: "Legal" },
    { id: "administrative", label: "Administrative" },
    { id: "technical", label: "Technical" },
    { id: "confidential", label: "Confidential" },
  ],
  classificationOptions: [
    { id: "top_secret", label: "Top Secret" },
    { id: "secret", label: "Secret" },
    { id: "confidential", label: "Confidential" },
    { id: "internal", label: "Internal" },
    { id: "public", label: "Public" },
  ],
  tagOptions: [
    { id: "urgent", label: "Urgent" },
    { id: "important", label: "Important" },
    { id: "review", label: "Under Review" },
    { id: "completed", label: "Completed" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ],
  decisionStatusOptions: [
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
    { id: "deferred", label: "Deferred" },
    { id: "under_review", label: "Under Review" },
  ],
});
