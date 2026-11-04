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
            step={type === "number" ? "0.01" : undefined}
            min={type === "date" ? `${new Date().getFullYear()}-01-01` : (type === "number" ? (name === "currentCtc" ? 1 : 0) : undefined)}
            max={type === "date" ? `${new Date().getFullYear()}-12-31` : undefined}
            onChange={(event) => {
              let value = event.target.value;
              if (name === "employeeName") {
                // Keep English letters and at most one space between words.
                value = value.replace(/[^A-Za-z ]/g, "").replace(/^ +/, "").replace(/ +/g, " ");
              }
              if (name === "employeeId") {
                value = value.replace(/[^A-Za-z0-9]/g, "");
              }
              if (name === "designation" || name === "department") {
                // Letters and single spaces only; capitalize the first letter of each word.
                value = value.replace(/[^A-Za-z ]/g, "").replace(/^ +/, "").replace(/ +/g, " ");
                value = value.replace(/(^| )([a-z])/g, (_, prefix, letter) => prefix + letter.toUpperCase());
              }
              updateField(name, value);
            }}
            pattern={
              name === "employeeName"
                ? "(?!([A-Za-z])\\1+$)[A-Za-z]{2,}( [A-Za-z]+)*"
                : (name === "employeeId"
                    ? "(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{2,}"
                    : (name === "designation" || name === "department"
                    ? "(?!.*([A-Za-z])\\1{2})[A-Z][a-zA-Z]*( [A-Z][a-zA-Z]*)*"
                    : (type === "text" || type === "email"
                    ? "(?!([\\s\\S])\\1+$)[\\s\\S]{2,}"
                    : undefined)))
            }
            title={
              name === "employeeName"
                ? "Enter a name with at least 2 characters; repeated identical characters are not allowed."
                : (name === "employeeId"
                    ? "Employee ID must contain at least one letter and one number; only letters and numbers are allowed."
                    : (name === "designation" || name === "department"
                    ? "Use alphabets only; capitalize the first letter of each word."
                    : (type === "text" || type === "email"
                    ? "Enter at least 2 characters; repeated identical characters are not allowed."
                    : undefined)))
            }
            maxLength={name === "employeeEmail" ? 100 : (type === "text" ? 60 : undefined)}
            readOnly={["employeePf", "employerPf", "professionalTax"].includes(name)}
            required
          />
        </label>
      ))}
    </div>
  );
}
