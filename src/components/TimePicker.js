import React from "react";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import AdapterDateFns from "@mui/x-date-pickers/AdapterDateFns";
import TextField from "@mui/material/TextField";
import { Field, ErrorMessage } from "formik";

const TimePickerField = ({ field, form, label }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileTimePicker
        label={label}
        value={field.value || null} // Use Formik's field value
        onChange={(newValue) => {
          form.setFieldValue(field.name, newValue); // Update Formik's state
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            fullWidth
            error={Boolean(form.errors[field.name] && form.touched[field.name])}
            helperText={form.errors[field.name] && form.touched[field.name] ? form.errors[field.name] : ""}
          />
        )}
      />
    </LocalizationProvider>
  );
};

const MyFormComponent = () => (
  <div className="form-group">
    <label htmlFor="start_booking_time">Booking Time</label>
    <Field
      name="start_booking_time"
      component={TimePickerField}
      label="Select Booking Time"
    />
    <ErrorMessage name="start_booking_time" component="div" className="error-message" />
  </div>
);

export default MyFormComponent;
