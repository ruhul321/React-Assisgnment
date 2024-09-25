import React, { useState } from "react";
import "./App.css";

const SegmentForm = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [schemaList, setSchemaList] = useState([]); // Stores all added schemas
  const [selectedSchema, setSelectedSchema] = useState(""); // Tracks selected option in "Add schema to segment"
  const [availableSchemas, setAvailableSchemas] = useState([
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" },
  ]);

  // Open the popup
  const openPopup = () => {
    setIsPopupOpen(true);
  };

  // Close the popup
  const closePopup = () => {
    setIsPopupOpen(false);
  };

  // Handle schema dropdown change for added schemas in blue box
  const handleSchemaChange = (index, newValue) => {
    const updatedSchemaList = [...schemaList];
    updatedSchemaList[index].value = newValue;
    setSchemaList(updatedSchemaList);
  };

  // Handle "Add schema to segment" dropdown change
  const handleSelectedSchemaChange = (e) => {
    setSelectedSchema(e.target.value);
  };

  // Handle adding a new schema to the blue box
  const handleAddNewSchema = () => {
    if (selectedSchema) {
      const newSchemaList = [...schemaList, { value: selectedSchema }];
      setSchemaList(newSchemaList);
      // Optionally, keep the selected schema for easy further additions
      // setSelectedSchema(""); // Uncomment if you want to reset it after adding
    }
  };

  // Get remaining options for the dropdowns in blue box, excluding already selected options
  const getRemainingOptions = (currentValue) => {
    const selectedValues = schemaList.map((schema) => schema.value);
    return availableSchemas.filter(
      (schema) =>
        !selectedValues.includes(schema.value) || schema.value === currentValue
    );
  };

  // Handle saving the segment
  const handleSaveSegment = async () => {
    const schemaData = schemaList
      .filter((schema) => schema.value) // Filter out any empty selections
      .map((schema) => ({
        [schema.value]: availableSchemas.find((s) => s.value === schema.value)
          ?.label,
      }));

    const segmentData = {
      segment_name: segmentName,
      schema: schemaData,
    };

    console.log("Sending segment data to server:", segmentData);
    const webhookUrl =
      "https://webhook.site/a6315034-39b9-47ae-a2d8-128e0f8275f0";
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(segmentData),
      });

      if (response.ok) {
        console.log("Data sent successfully!");
        closePopup();
      } else {
        console.error("Error sending data:", response.statusText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <div className="container">
      <button className="save-segment-btn" onClick={openPopup}>
        Save segment
      </button>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Saving Segment</h3>
            <span className="close" onClick={closePopup}>
              &times;
            </span>

            {/* Segment Name */}
            <div className="input-group">
              <label>Enter the Name of the Segment</label>
              <input
                type="text"
                placeholder="Name of the segment"
                value={segmentName}
                onChange={(e) => setSegmentName(e.target.value)}
              />
            </div>

            {/* Schema Selection */}
            <div className="input-group">
              <p>
                To save your segment, you need to add the schemas to build the
                query
              </p>

              {/* Render existing schemas in blue box */}
              {schemaList.map((schema, index) => (
                <div key={index} className="schema-dropdown">
                  <select
                    value={schema.value}
                    onChange={(e) => handleSchemaChange(index, e.target.value)}
                  >
                    <option value="">Select schema</option>
                    {getRemainingOptions(schema.value).map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

              {/* "Add schema to segment" dropdown */}
              <div className="schema-dropdown">
                <select
                  value={selectedSchema}
                  onChange={handleSelectedSchemaChange}
                >
                  <option value="">Add schema to segment</option>
                  {getRemainingOptions(null).map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add new schema button */}
              <button className="add-new-schema" onClick={handleAddNewSchema}>
                + Add new schema
              </button>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button className="save-segment" onClick={handleSaveSegment}>
                Save the Segment
              </button>
              <button className="cancel" onClick={closePopup}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SegmentForm;
