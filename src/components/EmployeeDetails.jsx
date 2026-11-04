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
              let value = event.target.value;
              if (name === "employeeName") {
                // Keep English letters and at most one space between words.
                // Controlled input still allows Backspace and Delete normally.
                value = value.replace(/[^A-Za-z ]/g, "").replace(/^ +/, "").replace(/ +/g, " ");
              }
              updateField(name, value);
            }}
            pattern={name === "employeeName" ? "[A-Za-z]+( [A-Za-z]+)*" : undefined}
            title={name === "employeeName" ? "Start with an English letter; use only one space between words." : undefined}
            maxLength={name === "employeeName" ? 100 : undefined}
            readOnly={["employeePf", "employerPf", "professionalTax"].includes(name)}
            required
          />
        </label>
      ))}
    </div>
  );
}
