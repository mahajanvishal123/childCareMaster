import React from "react";

const AddDcTab = ({
  dc,
  newDcNumber,
  setNewDcNumber,
  handleAddDc,
  handleDelete,
  reusableColor,
}) => {
  return (
    <div>
      <h2 className="h5 fw-semibold text-dark mb-4">Add DC numbers</h2>

      <div className="mb-3">
        <label className="form-label fw-medium text-dark">Total DCs</label>
        <input
          type="text"
          className="form-control"
          value={dc?.length}
          readOnly
        />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddDc();
        }}
      >
        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <label className="form-label fw-medium text-dark">
              Enter Unique DC Number
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., DC-1003"
              value={newDcNumber}
              onChange={(e) => setNewDcNumber(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button
              className="btn text-white w-100"
              style={{ backgroundColor: reusableColor.customTextColor }}
              onClick={handleAddDc}
            >
              Add DC
            </button>
          </div>
        </div>
      </form>

      <div className="mt-4">
        <h5 className="text-dark mb-3">Existing DCs</h5>
        <ul className="list-group">
          {dc.map((item) => (
            <li
              key={item.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {item.dcNumber}
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(item.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AddDcTab;
