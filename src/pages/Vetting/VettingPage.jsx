import { useState } from "react";
import Box from "@mui/material/Box";
import { useToast } from "../../components/common/ToastContext";
import { createEmptyVettingForm } from "./VettingData";
import { VettingForm } from "./VettingForm";

export default function VettingPage() {
  const { success } = useToast();
  const [formValues, setFormValues] = useState(createEmptyVettingForm);

  const patchForm = (patch) => setFormValues((prev) => ({ ...prev, ...patch }));

  const handleSaveDraft = () => {
    console.log("=== DRAFT SAVED ===");
    console.log("Form Values:", JSON.stringify(formValues, null, 2));
    console.log("Form Mode:", "add");
    success("Draft saved successfully");
  };

  const handleSubmitVetting = () => {
    console.log("=== SUBMITTED FOR VETTING ===");
    console.log("Form Values:", JSON.stringify(formValues, null, 2));
    console.log("Form Mode:", "add");
    success("Submitted for vetting");
  };

  return (
    <Box>
      <VettingForm
        mode="add"
        values={formValues}
        onChange={patchForm}
        onSaveDraft={handleSaveDraft}
        onSubmitVetting={handleSubmitVetting}
      />
    </Box>
  );
}
