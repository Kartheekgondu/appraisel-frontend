export default function EmployeeDetails({ form, updateField }) {
  const fields = [
    ["employeeName", "Employee Name", "text"],
    ["employeeId", "Employee ID", "text"],
    ["employeeEmail", "Employee Email", "email"],
    ["designation", "Designation", "text"],
    ["department", "Department", "text"],
    ["currentCtc", "Current Annual CTC (₹)", "number"],
    ["revisedCtc", "Revised Annual CTC (₹)", "number"],
    ["effectiveDate", "Effective Date", "date"],
    ["variablePay", "Annual Variable Pay (₹)", "number"],
    ["employeePf", "Employee PF / month (₹)", "number"],
    ["employerPf", "Employer PF / month (₹)", "number"],
    ["professionalTax", "Professional Tax / month (₹)", "number"],
  ];

  return (
    <div className="form-grid">
      {fields.map(([name, label, type]) => (
        <label key={name} className="form-field">
          <span>{label}</span>
          <input
            type={type}
            name={name}
            value={form[name] ?? ""}
            min={type === "number" ? (name === "currentCtc" ? 1 : 0) : undefined}
            step={type === "number" ? "0.01" : undefined}
            onChange={(event) => {
              const value = event.target.value;
              // Employee names start with a letter; spaces are allowed only after the first letter.
              if (name === "employeeName" && !/^(?! )[A-Za-z ]*$/.test(value)) return;
              updateField(name, value);
            }}
            pattern={name === "employeeName" ? "[A-Za-z]+(?: [A-Za-z]+)*" : undefined}
            title={name === "employeeName" ? "Start with an English letter; spaces are allowed between names." : undefined}
            maxLength={name === "employeeName" ? 100 : undefined}
            readOnly={["employeePf", "employerPf", "professionalTax"].includes(name)}
            required
          />
        </label>
      ))}
    </div>
  );
}
