// import React from "react";
// import { useSelector } from "react-redux";

// const AddClassRoomTab = ({ reusableColor}) => {

//     const { classrooms , error, loading} 
//     =  useSelector((state) => state.classroom);
//     console.log("Classroome" , classrooms)

//     const [className, setClassName] = useState("");

//      const handleAddDc = async (e) => {
//     e.preventDefault();

//     if (!newDcNumber.trim()) {
//       toast.error("DC Number cannot be empty");
//       return;
//     }



//     const payload = {
//       dc_number: newDcNumber,
//       created_by: "1",
//     };

//     // Show loading toast
//     const toastId = toast.loading("Adding DC...");

//     try {
//       const resultAction = await dispatch(addDC(payload));

//       if (addDC.fulfilled.match(resultAction)) {
//         toast.success("DC added successfully", { id: toastId });
//         setNewDcNumber("");
//       } else {
//         throw new Error(resultAction.payload || "Failed to add DC");
//       }
//     } catch (err) {
//       toast.error(err.message || "Something went wrong", { id: toastId });
//     }
//   };

//   useEffect(() => {
//     dispatch(fetchDCs());
//   }, [dispatch])


//   const { confirmAndDelete } = useConfirmDelete();

//   const handleDelete = (id) => {
//     confirmAndDelete({
//       id,
//       action: deleteDC,
//       entity: "DC",
//       onSuccess: () => {
//         dispatch(fetchDCs());

//       },
//     });
//   };



//   return (
//     <div>
//       <h2 className="h5 fw-semibold text-dark mb-4">Add Classroom</h2>

//       <div className="mb-3">
//         <label className="form-label fw-medium text-dark">Total ClassRoom</label>
//         <input
//           type="text"
//           className="form-control"
//           value={dc.length}
//           readOnly
//         />
//       </div>

//       <form
//         onSubmit={(e) => {
//           e.preventDefault();
//           handleAddDc();
//         }}
//       >
//         <div className="row g-3 align-items-end">
//           <div className="col-md-6">
//             <label className="form-label fw-medium text-dark">
//               Enter ClassRoom
//             </label>
//             <input
//               type="text"
//               className="form-control"
//               placeholder="e.g., DC-1003"
//               value={className}
//               onChange={(e) => setClassName(e.target.value)}
//             />
//           </div>
//           <div className="col-md-3">
//             <button
//               className="btn text-white w-100"
//               style={{ backgroundColor: reusableColor.customTextColor }}
//               onClick={handleAddDc}
//             >
//               Add DC
//             </button>
//           </div>
//         </div>
//       </form>

//       <div className="mt-4">
//         <h5 className="text-dark mb-3">Existing DCs</h5>
//         <ul className="list-group">
//           {dc.map((item) => (
//             <li
//               key={item.id}
//               className="list-group-item d-flex justify-content-between align-items-center"
//             >
//               {item.dcNumber}
//               <button
//                 className="btn btn-sm btn-danger"
//                 onClick={() => handleDelete(item.id)}
//               >
//                 Remove
//               </button>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default AddClassRoomTab;

import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { addClassRoom, deleteClassroom, getClassroom } from "../../../redux/slices/classroomSlice";
import { useConfirmDelete } from "../../../hooks/useCustomDelete";


const AddClassRoomTab = ({ reusableColor }) => {
 const dispatch = useDispatch();
  const [className, setClassName] = useState("");

  const { classroom, loading, error } = useSelector((state) => state.classroom);
  console.log("classroom", classroom)

  console.log("GDFHgfhgfh")

  // Fetch all classrooms
  useEffect(() => {
    console.log("eudesre")
    dispatch(getClassroom());
  }, [dispatch]);

  // Add classroom
  const handleAddClassroom = async (e) => {
    e.preventDefault();

    if (!className.trim()) {
      toast.error("Classroom name cannot be empty");
      return;
    }

    const toastId = toast.loading("Adding Classroom...");
    try {
      const result = await dispatch(addClassRoom({ name: className }));

      if (addClassRoom.fulfilled.match(result)) {
        toast.success("Classroom added successfully", { id: toastId });
        setClassName("");
         dispatch(getClassroom());

      } else {
        throw new Error(result.payload || "Failed to add classroom");
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong", { id: toastId });
    }
  };


//   const { confirmAndDelete } = useConfirmDelete();

// }
//   // Delete classroom
//   const handleDelete = async (id) => {

//     confirmAndDelete ({
//       id,
//       action: deleteClassroom,
//       entity: "Classroom",
//       onSuccess: () => {
//         dispatch(getClassroom());
//       },
//       title: "Delete Classroom",
//     })
  
  
//   };



   const { confirmAndDelete } = useConfirmDelete();
  
    const handleDelete = (id) => {
      confirmAndDelete({
        id,
        action: deleteClassroom,
        entity: "classroom",
        onSuccess: () => {
          dispatch(getClassroom());
  
        },
      });
    };

  return (
    <div>
      <h2 className="h5 fw-semibold text-dark mb-4">Add Classroom</h2>

      <div className="mb-3">
        <label className="form-label fw-medium text-dark">Total Classrooms</label>
        <input
          type="text"
          className="form-control"
          value={classroom.length}
          readOnly
        />
      </div>

      <form onSubmit={handleAddClassroom}>
        <div className="row g-3 align-items-end">
          <div className="col-md-6">
            <label className="form-label fw-medium text-dark">
              Enter Classroom Name
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., 4A"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button
              className="btn text-white w-100"
              style={{ backgroundColor: reusableColor.customTextColor }}
              type="submit"
           
            >
              {  "Add Classroom"}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-4">
        <h5 className="text-dark mb-3">Existing Classrooms</h5>
        {classroom.length === 0 ? (
          <p>No classrooms found.</p>
        ) : (
          <ul className="list-group">
            {classroom.map((item) => (
              <li
                key={item.classroom_id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                {item.name}
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(item.classroom_id)}
                >
                 Delete
                 {/* <i className="fas fa-trash danger"></i> */}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AddClassRoomTab;

