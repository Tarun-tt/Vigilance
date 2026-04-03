import React, { useRef } from "react";
import DynamicForm from "./DynamicForm";
import { showBOIToast } from "./common";
import { getOptionsMap, metaDataFields } from "./config/formConfig";

const SimpleFormExample = () => {
  const formRef = useRef();

  const handleSubmit = (formData) => {
    console.log("Form submitted:", formData);
    showBOIToast({
      message: "Form submitted successfully!",
      type: "success",
      title: "Success",
    });
  };

  const handleCancel = () => {
    showBOIToast({
      message: "Form cancelled",
      type: "info",
      title: "Cancelled",
    });
  };

  return (
    <DynamicForm
      ref={formRef}
      fields={metaDataFields}
      optionsMap={getOptionsMap()}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      title="Document Metadata Form"
      submitLabel="Submit Document"
      cancelLabel="Cancel"
      columns={2}
    />
  );
};

export default SimpleFormExample;
