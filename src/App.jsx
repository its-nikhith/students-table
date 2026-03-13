import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", age: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [errors, setErrors] = useState({});

  // Simulated loading
  useEffect(() => {
    setTimeout(() => {
      const data = [
        { name: "John Doe", email: "john@gmail.com", age: 21 },
        { name: "Nikhil Kumar", email: "nikhil@gmail.com", age: 22 },
      ];
      setStudents(data);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!form.age) newErrors.age = "Age is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editIndex !== null) {
      const updated = [...students];
      updated[editIndex] = form;
      setStudents(updated);
      setEditIndex(null);
    } else {
      setStudents([...students, form]);
    }

    setForm({ name: "", email: "", age: "" });
    setErrors({});
  };

  const handleEdit = (index) => {
    setForm(students[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      const updated = students.filter((_, i) => i !== index);
      setStudents(updated);
    }
  };

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, "students.xlsx");
  };

  if (loading)
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );

  return (
    <div className="container">
      <div className="card">
        <h2>Students Management</h2>

        <form onSubmit={handleSubmit} className="form">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Student Name"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Student Email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div>
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
            />
            {errors.age && <p className="error">{errors.age}</p>}
          </div>

          <button type="submit" className="primary-btn">
            {editIndex !== null ? "Update Student" : "Add Student"}
          </button>
        </form>

        <div className="top-bar">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search"
          />

          <div>
            <button
              className="secondary-btn"
              onClick={() => downloadExcel(filteredStudents)}
            >
              Download Filtered
            </button>
            <button
              className="secondary-btn"
              onClick={() => downloadExcel(students)}
            >
              Download All
            </button>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student, index) => (
                <tr key={index}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.age}</td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;