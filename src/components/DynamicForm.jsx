import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  BOITextField,
  BOIAutocomplete,
  BOIButton,
  BOICard,
  showBOIToast,
} from "./common";
import { Grid, Box, Stack, Typography } from "@mui/material";

const DynamicForm = forwardRef(
  (
    {
      fields,
      optionsMap,
      initialValues = {},
      onSubmit,
      onCancel,
      title = "Dynamic Form",
      submitLabel = "Submit",
      cancelLabel = "Cancel",
      columns = 2,
      readOnly = false,
      showActions = true,
      validateOnSubmit = true,
    },
    ref,
  ) => {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
      const initialFormState = {};
      fields.forEach((field) => {
        if (field.name.includes(".")) {
          const [parent, child] = field.name.split(".");
          if (!initialFormState[parent]) {
            initialFormState[parent] = {};
          }
          initialFormState[parent][child] = initialValues[field.name] || "";
        } else {
          initialFormState[field.name] = initialValues[field.name] || "";
        }
      });
      setFormData(initialFormState);
    }, [fields, initialValues]);

    useImperativeHandle(ref, () => ({
      getFormData: () => formData,
      validateForm: () => validateAllFields(),
      resetForm: () => {
        const resetState = {};
        fields.forEach((field) => {
          if (field.name.includes(".")) {
            const [parent, child] = field.name.split(".");
            if (!resetState[parent]) {
              resetState[parent] = {};
            }
            resetState[parent][child] = "";
          } else {
            resetState[field.name] = "";
          }
        });
        setFormData(resetState);
        setErrors({});
        setTouched({});
      },
    }));

    const getFieldValue = (field) => {
      if (field.name.includes(".")) {
        const [parent, child] = field.name.split(".");
        return formData[parent]?.[child] || "";
      }
      return formData[field.name] || "";
    };

    const setFieldValue = (field, value) => {
      if (field.name.includes(".")) {
        const [parent, child] = field.name.split(".");
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [field.name]: value,
        }));
      }
    };

    const validateField = (field, value) => {
      const errors = {};

      if (field.required && (!value || value === "")) {
        errors[field.name] = `${field.label} is required`;
        return errors;
      }

      if (field.pattern && value && !new RegExp(field.pattern).test(value)) {
        errors[field.name] =
          field.errorMessage || `Invalid ${field.label.toLowerCase()}`;
        return errors;
      }

      if (field.maxLength && value && value.length > field.maxLength) {
        errors[field.name] =
          `${field.label} must be less than ${field.maxLength} characters`;
        return errors;
      }

      if (field.minLength && value && value.length < field.minLength) {
        errors[field.name] =
          `${field.label} must be at least ${field.minLength} characters`;
        return errors;
      }

      if (
        field.type === "email" &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        errors[field.name] = `Invalid email address`;
        return errors;
      }

      return errors;
    };

    const validateAllFields = () => {
      const newErrors = {};
      fields.forEach((field) => {
        const value = getFieldValue(field);
        const fieldErrors = validateField(field, value);
        Object.assign(newErrors, fieldErrors);
      });
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
      setFieldValue(field, value);

      setTouched((prev) => ({ ...prev, [field.name]: true }));

      if (touched[field.name]) {
        const fieldErrors = validateField(field, value);
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
    };

    const handleBlur = (field) => {
      setTouched((prev) => ({ ...prev, [field.name]: true }));
      const value = getFieldValue(field);
      const fieldErrors = validateField(field, value);
      setErrors((prev) => ({ ...prev, ...fieldErrors }));
    };

    const handleSubmit = () => {
      if (validateOnSubmit && !validateAllFields()) {
        showBOIToast({
          message: "Please fix all validation errors before submitting",
          type: "error",
          title: "Validation Error",
        });
        return;
      }

      onSubmit(formData);
    };

    const handleCancel = () => {
      if (onCancel) {
        onCancel();
      }
    };

    const renderField = (field) => {
      const value = getFieldValue(field);
      const error = errors[field.name];
      const commonProps = {
        label: field.label,
        required: field.required,
        disabled: readOnly,
        error: !!error,
        helperText: error,
        placeholder: field.placeholder,
        fullWidth: true,
      };

      switch (field.type) {
        case "select":
          return (
            <BOIAutocomplete
              {...commonProps}
              options={optionsMap[field.optionsKey] || []}
              value={
                optionsMap[field.optionsKey]?.find((opt) => opt.id === value) ||
                null
              }
              onChange={(event, newValue) =>
                handleChange(field, newValue?.id || "")
              }
              onBlur={() => handleBlur(field)}
              getOptionLabel={(option) => option.label || ""}
              isOptionEqualToValue={(option, val) => option.id === val?.id}
            />
          );

        case "multiselect":
          return (
            <BOIAutocomplete
              {...commonProps}
              multiple
              options={optionsMap[field.optionsKey] || []}
              value={
                optionsMap[field.optionsKey]?.filter((opt) =>
                  value.includes?.(opt.id),
                ) || []
              }
              onChange={(event, newValue) =>
                handleChange(
                  field,
                  newValue.map((v) => v.id),
                )
              }
              onBlur={() => handleBlur(field)}
              getOptionLabel={(option) => option.label || ""}
              isOptionEqualToValue={(option, val) => option.id === val?.id}
            />
          );

        case "textarea":
          return (
            <BOITextField
              {...commonProps}
              multiline
              rows={field.rows || 4}
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={() => handleBlur(field)}
            />
          );

        case "date":
          return (
            <BOITextField
              {...commonProps}
              type="date"
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={() => handleBlur(field)}
              InputLabelProps={{ shrink: true }}
            />
          );

        case "email":
        case "text":
        default:
          return (
            <BOITextField
              {...commonProps}
              type={field.type || "text"}
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              onBlur={() => handleBlur(field)}
              inputProps={{
                maxLength: field.maxLength,
                pattern: field.pattern,
              }}
            />
          );
      }
    };

    return (
      <BOICard title={title}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={3}>
            {fields.map((field) => (
              <Grid item xs={12} sm={12 / columns} key={field.name}>
                {renderField(field)}
              </Grid>
            ))}
          </Grid>

          {showActions && !readOnly && (
            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              sx={{ mt: 3 }}
            >
              <BOIButton variant="outlined" onClick={handleCancel}>
                {cancelLabel}
              </BOIButton>
              <BOIButton
                variant="contained"
                onClick={handleSubmit}
                color="primary"
              >
                {submitLabel}
              </BOIButton>
            </Stack>
          )}
        </Box>
      </BOICard>
    );
  },
);

DynamicForm.displayName = "DynamicForm";

export default DynamicForm;
