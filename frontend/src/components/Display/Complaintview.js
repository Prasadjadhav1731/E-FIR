import React, { useState, useEffect } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import Personview from "./Personview";
import axios from "axios";
import { toast } from "react-hot-toast";
import { API_BASE_URL } from "../../config/api";

const Complaintview = ({
  complaintDetails,
  setComplaintDetails,
  currentUser,
  setFilters,
  myComplaints,
}) => {
  const [addPersonFlag, setAddPersonFlag] = useState("");
  const [personDetails, setPersonDetails] = useState("");
  const [remark, setRemark] = useState("");

  useEffect(() => {
    console.log(complaintDetails);
    setRemark("");
  }, [complaintDetails]);

  const remarkHandler = (e) => {
    if (
      complaintDetails.complaintStatus &&
      complaintDetails.complaintStatus.status &&
      complaintDetails.complaintStatus.status === "Pending"
    ) {
      setRemark(e.target.value);
    }
  };

  const statusHandler = async (e) => {
    const statusValue = e.currentTarget.name || e.target.name;
    if (statusValue !== "true" && statusValue !== "false") return;

    if (statusValue === "false" && !remark.trim()) {
      toast.error("Please enter a remark to park/reject this complaint.");
      return;
    }

    try {
      const response = await toast.promise(
        axios.post(
          `${API_BASE_URL}/complaints/handleComlplaints/superUser?state=${statusValue}`,
          {
            userId: currentUser._id,
            remark,
            complaintId: complaintDetails._id,
          }
        ),
        {
          loading: "Updating status...",
          success: statusValue === "true" ? "FIR Status updated to Completed!" : "FIR Status updated to Parked!",
          error: "Failed to update complaint status",
        }
      );

      if (response && response.data && response.data.updatedComplaint) {
        setComplaintDetails(response.data.updatedComplaint);
      }
      if (setFilters) {
        setFilters((prev) => ({ ...prev }));
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };
  return (
    complaintDetails && (
      <div className="min-w-[275px] transition-all duration-500 relative p-4  w-full flex-grow shadow-2xl rounded-xl">
        <div
          onClick={() => setComplaintDetails("")}
          className="absolute top-4 left-3 rounded-full bg-green-600 cursor-pointer hover:bg-green-700 transition-all duration-200 text-xl p-1 text-white"
        >
          <IoMdArrowRoundBack />
        </div>
        <div className="  flex flex-col gap-y-6 justify-center items-center ">
          <div className="text-2xl font-bold font-poppins ">Complaint</div>
          <div className=" border-gray-300  space-y-3 p-4  relative border-4 w-full flex flex-col  rounded-2xl">
            <div className="absolute font-bold font-poppins bg-white px-2 text-xl -top-3 left-2">
              Incident Details
            </div>
            <lable className="mx-2  ">
              <span className="mr-4 text-[1rem] font-bold">
                Date Of Incident:
              </span>
              <input
                disabled
                type="date"
                id="TimeDateofIncident"
                value={
                  complaintDetails &&
                  complaintDetails.IncidentDetail &&
                  new Date(complaintDetails.IncidentDetail.TimeDateofIncident)
                    .toISOString()
                    .split("T")[0]
                }
                className="shadow rounded-lg px-3 py-1 w-[8.7rem]"
              />
            </lable>
            <div className="relative p-3 border-slate-200 border-2 rounded-xl">
              <div className="absolute font-poppins font-bold bg-white px-2 -top-3 left-2">
                Place Of Incident
              </div>
              <lable className="mx-2 py-2 flex flex-col space-y-3">
                <textarea
                  disabled
                  placeholder="Landmark..."
                  value={
                    complaintDetails &&
                    complaintDetails.IncidentDetail &&
                    complaintDetails.IncidentDetail.LandMark
                  }
                  className=" p-3 rounded-xl resize-none shadow w-full"
                ></textarea>
                <div className="flex gap-x-8 flex-wrap">
                  <div>
                    <span className="mr-4 text-[1rem] font-bold">
                      District:
                    </span>

                    <select
                      id="District"
                      disabled
                      className="px-2 py-1 shadow rounded-lg"
                    >
                      <option>
                        {complaintDetails &&
                          complaintDetails.IncidentDetail &&
                          complaintDetails.IncidentDetail.District
                          ? complaintDetails.IncidentDetail.District
                          : "Not Mentioned"}
                      </option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[1rem] font-bold">Sub-District:</span>

                    <select
                      id="SubDistrict"
                      disabled
                      value={
                        complaintDetails &&
                        complaintDetails.IncidentDetail &&
                        complaintDetails.IncidentDetail.SubDistrict
                      }
                      className="px-2 py-1 shadow rounded-lg"
                    >
                      <option>
                        {complaintDetails &&
                          complaintDetails.IncidentDetail &&
                          complaintDetails.IncidentDetail.SubDistrict
                          ? complaintDetails.IncidentDetail.SubDistrict
                          : "Not Mentioned"}
                      </option>
                    </select>
                  </div>
                </div>
              </lable>
            </div>
            <lable className="mx-2 flex flex-col space-y-3">
              <div className="mr-4 text-[1rem] font-bold">
                Incident Description:
              </div>
              <textarea
                placeholder="Incident Description..."
                disabled
                className=" p-3 rounded-xl resize-none shadow w-full"
                value={
                  complaintDetails &&
                  complaintDetails.IncidentDetail &&
                  complaintDetails.IncidentDetail.IncidentDescription
                }
              // value={complaintDetails &&
              //   complaintDetails.IncidentDetail &&}
              ></textarea>
            </lable>
            {complaintDetails && complaintDetails.filedBy && (
              <div className="relative p-3 border-slate-200 border-2 rounded-xl">
                <div className="absolute font-poppins font-bold bg-white px-2 -top-3 left-2">
                  Complaint filed by
                </div>
                <label className="mx-2 py-2 flex flex-col space-y-3">
                  <div className="flex flex-row gap-4 xs:flex-wrap max-w-[3/4]">
                    <div className="flex flex-col gap-1 min-w-0 w-full">
                      <label className="font-bold">Name:</label>
                      <input
                        disabled
                        type="text"
                        name="age"
                        value={
                          complaintDetails &&
                          complaintDetails.filedBy &&
                          complaintDetails.filedBy.name
                        }
                        placeholder="Age"
                        className="shadow rounded-lg px-3 py-1 max-w-96"
                      />
                    </div>
                    <div className="flex flex-col gap-1 min-w-0 w-full">
                      <label className="text-[1rem] font-bold">
                        Contact Number:
                      </label>
                      <input
                        disabled
                        type="text"
                        name="contact"
                        value={
                          complaintDetails &&
                          complaintDetails.filedBy &&
                          complaintDetails.filedBy.mobile
                        }
                        placeholder="Contact Number"
                        className="shadow rounded-lg px-3 py-1 max-w-96"
                      />
                    </div>
                  </div>

                  <div className="mr-4 text-[1rem] font-bold inline-block ">
                    Email ID:
                  </div>
                  <input
                    type="text"
                    disabled
                    value={
                      complaintDetails &&
                      complaintDetails.filedBy &&
                      complaintDetails.filedBy.email
                    }
                    className="shadow rounded-lg px-3 py-1 w-full max-w-[500px]"
                  ></input>

                  <div className="flex gap-x-8 flex-wrap">
                    <div>
                      <span className="mr-4 text-[1rem] font-bold">
                        District:
                      </span>

                      <select
                        id="District"
                        disabled
                        className="px-2 py-1 shadow rounded-lg"
                      >
                        <option>
                          {complaintDetails &&
                            complaintDetails.filedBy &&
                            complaintDetails.filedBy.District
                            ? complaintDetails.IncidentDetail.District
                            : "Not Mentioned"}
                        </option>
                      </select>
                    </div>
                    <div>
                      <span className="text-[1rem] font-bold">
                        Sub-District:
                      </span>

                      <select
                        id="SubDistrict"
                        disabled
                        value={
                          complaintDetails &&
                          complaintDetails.filedBy &&
                          complaintDetails.filedBy.SubDistrict
                        }
                        className="px-2 py-1 shadow rounded-lg"
                      >
                        <option>
                          {complaintDetails &&
                            complaintDetails.IncidentDetail &&
                            complaintDetails.IncidentDetail.SubDistrict
                            ? complaintDetails.IncidentDetail.SubDistrict
                            : "Not Mentioned"}
                        </option>
                      </select>
                    </div>
                  </div>
                </label>
              </div>
            )}
          </div>
          {complaintDetails &&
            complaintDetails.VictimIds &&
            complaintDetails.VictimIds.length > 0 && (
              <div className=" border-gray-300  space-y-3 p-4  relative border-4 w-full flex flex-col  rounded-2xl">
                <div className="absolute font-poppins font-bold bg-white px-2 text-xl -top-3 left-2">
                  Victim Details
                </div>

                {
                  <table className="table-auto select-none text-sm w-full border-collapse border border-gray-300">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 px-2 py-1">
                          Name
                        </th>
                        <th className="border border-gray-300 px-2 py-1">
                          Contact
                        </th>
                        <th className="border border-gray-300 px-2 py-1">
                          Address
                        </th>
                        <th className="border border-gray-300 px-4 py-1 w-10 ">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {complaintDetails.VictimIds.map((ele, index) => (
                        <tr
                          key={index}
                          className=" hover:bg-slate-100 transition-all duration-200"
                        >
                          <td className="border text-center border-gray-300 px-2 py-1">
                            {ele.name}
                          </td>
                          <td className="border text-center border-gray-300 px-2 py-1">
                            {ele.contact}
                          </td>
                          <td className="border text-center border-gray-300 px-2 py-1">
                            {ele.address}
                          </td>
                          <td className=" flex gap-3 text-sm font- text-white text-center justify-center items-center py-1 px-2">
                            <div
                              onClick={() => {
                                setPersonDetails(ele);
                                setAddPersonFlag("VictimArray");
                              }}
                              className="rounded-full bg-green-600 cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-green-700 px-2 py-1"
                            >
                              View
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              </div>
            )}

          {complaintDetails &&
            complaintDetails.AccusedIds &&
            complaintDetails.AccusedIds.length > 0 && (
              <div className=" border-gray-300  space-y-3 p-4  relative border-4 w-full flex flex-col  rounded-2xl">
                <div className="absolute font-poppins font-bold bg-white px-2 text-xl -top-3 left-2">
                  Accused Details
                </div>

                {
                  <table className="table-auto select-none text-sm w-full border-collapse border border-gray-300">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 px-2 py-1">
                          Name
                        </th>
                        <th className="border border-gray-300 px-2 py-1">
                          Contact
                        </th>
                        <th className="border border-gray-300 px-2 py-1">
                          Address
                        </th>
                        <th className="border border-gray-300 px-4 py-1 w-10 ">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {complaintDetails.AccusedIds.map((ele, index) => (
                        <tr
                          key={index}
                          className=" hover:bg-slate-100 transition-all duration-200"
                        >
                          <td className="border text-center border-gray-300 px-2 py-1">
                            {ele && ele.name}
                          </td>
                          <td className="border text-center border-gray-300 px-2 py-1">
                            {ele && ele.contact}
                          </td>
                          <td className="border text-center border-gray-300 px-2 py-1">
                            {ele && ele.address}
                          </td>
                          <td className=" flex gap-3 text-sm text-white text-center justify-center items-center px-2 py-1">
                            <div
                              onClick={() => {
                                setPersonDetails(ele);
                                setAddPersonFlag("AccusedArray");
                              }}
                              className="rounded-full bg-green-600 cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-green-700 px-2 py-1"
                            >
                              View
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              </div>
            )}

          {complaintDetails &&
            complaintDetails.WitnessIds &&
            complaintDetails.WitnessIds.length > 0 && (
              <div className=" border-gray-300  space-y-3 p-4  relative border-4 w-full flex flex-col  rounded-2xl">
                <div className="absolute font-poppins font-bold bg-white px-2 text-xl -top-3 left-2">
                  Witness Details
                </div>

                {
                  <table className="table-auto select-none text-sm w-full border-collapse border border-gray-300">
                    <thead>
                      <tr>
                        <th className="border border-gray-300 px-2 py-1">
                          Name
                        </th>
                        <th className="border border-gray-300 px-2 py-1">
                          Contact
                        </th>
                        <th className="border border-gray-300 px-2 py-1">
                          Address
                        </th>
                        <th className="border border-gray-300 px-4 py-1 w-10 ">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {complaintDetails.WitnessIds.map((ele, index) => (
                        <tr
                          key={index}
                          className=" hover:bg-slate-100 transition-all duration-200"
                        >
                          <td className="border text-center border-gray-300 px-2 py-1">
                            {ele && ele.name}
                          </td>
                          <td className="border text-center border-gray-300 px-2 py-1">
                            {ele && ele.contact}
                          </td>
                          <td className="border text-center border-gray-300 px-2 py-1">
                            {ele && ele.address}
                          </td>
                          <td className=" flex gap-3 text-sm text-white text-center justify-center items-center px-2 py-1">
                            <div
                              onClick={() => {
                                setPersonDetails(ele);
                                setAddPersonFlag("WitnessArray");
                              }}
                              className="rounded-full bg-green-600 cursor-pointer hover:scale-105 transition-all duration-300 hover:bg-green-700 px-2 py-1"
                            >
                              View
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              </div>
            )}

          <div className="border-gray-300 space-y-3 p-4 relative border-4 w-full flex flex-col rounded-2xl">
            <div className="absolute font-poppins font-bold bg-white px-2 text-xl -top-3 left-2">
              Evidences & Uploaded Documents
            </div>

            {complaintDetails &&
            complaintDetails.Evidence &&
            complaintDetails.Evidence.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                {complaintDetails.Evidence.map((url, i) => {
                  const isImage = typeof url === "string" && (
                    url.match(/\.(jpeg|jpg|gif|png|webp|svg)($|\?)/i) ||
                    url.includes("image/upload") ||
                    url.includes("res.cloudinary.com")
                  );
                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                    >
                      {isImage ? (
                        <div className="w-full h-32 mb-2 overflow-hidden rounded-lg bg-slate-200 flex items-center justify-center">
                          <img
                            src={url}
                            alt={`Evidence ${i + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              // If image load fails, hide image element
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-24 mb-2 rounded-lg bg-indigo-50 flex flex-col items-center justify-center text-indigo-600 font-semibold text-xs p-2 text-center">
                          <span className="text-2xl mb-1">📄</span>
                          <span>Document File #{i + 1}</span>
                        </div>
                      )}
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 bg-violet-600 hover:bg-violet-700 text-white font-medium text-xs py-1.5 px-3 rounded-lg transition-colors w-full justify-center"
                      >
                        <span>View Document #{i + 1}</span>
                        <span className="text-xs">↗</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-4 text-center text-gray-500 italic text-sm">
                No evidence documents were uploaded for this complaint.
              </div>
            )}
          </div>
        <div className="border border-slate-200 bg-slate-50/80 p-5 w-full flex flex-col gap-4 rounded-2xl shadow-sm my-2">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 flex-wrap gap-2">
            <div className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span>Official Processing & Remarks</span>
            </div>
            {complaintDetails.complaintStatus && complaintDetails.complaintStatus.status && (
              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                complaintDetails.complaintStatus.status === "Completed"
                  ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                  : complaintDetails.complaintStatus.status === "Park"
                  ? "bg-amber-100 text-amber-800 border-amber-300"
                  : "bg-blue-100 text-blue-800 border-blue-300"
              }`}>
                Status: {complaintDetails.complaintStatus.status}
              </span>
            )}
          </div>

          {!myComplaints &&
          complaintDetails.complaintStatus &&
          complaintDetails.complaintStatus.status === "Pending" ? (
            <div className="flex flex-col gap-3">
              <label className="text-xs font-semibold text-slate-600">
                Official Remark / Action Notes (Required for Parking/Rejecting FIR):
              </label>
              <textarea
                className="p-3 rounded-xl border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm w-full min-h-[90px] shadow-inner"
                placeholder="Type official inspection notes, reason for approval, or reason for parking..."
                value={remark}
                onChange={remarkHandler}
              ></textarea>
              
              <div className="flex items-center justify-end gap-3 pt-1 flex-wrap">
                <button
                  type="button"
                  name="false"
                  onClick={statusHandler}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-600 hover:to-red-600 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>⏸ Park / Reject FIR</span>
                </button>
                <button
                  type="button"
                  name="true"
                  onClick={statusHandler}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <span>✓ Complete / Approve FIR</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-inner">
              <table className="min-w-full text-xs text-left text-slate-700">
                <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Remark</th>
                    <th className="px-4 py-3">Official ID</th>
                    <th className="px-4 py-3">Taken By</th>
                    <th className="px-4 py-3">Contact Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {complaintDetails.complaintStatus?.date
                        ? new Date(complaintDetails.complaintStatus.date).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        complaintDetails.complaintStatus?.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : complaintDetails.complaintStatus?.status === "Park"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {complaintDetails.complaintStatus?.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 italic max-w-xs">
                      {complaintDetails.complaintStatus?.remark || "No remark provided"}
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-slate-600">
                      {complaintDetails.complaintStatus?.uniqueUserId || "N/A"}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {complaintDetails.complaintStatus?.user?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {complaintDetails.complaintStatus?.user?.mobile || complaintDetails.complaintStatus?.user?.email || "N/A"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

        {personDetails && (
          <Personview
            addPersonFlag={addPersonFlag}
            personDetails={personDetails}
            setAddPersonFlag={setAddPersonFlag}
            setPersonDetails={setPersonDetails}
          />
        )}
      </div>
    )
  );
};

export default Complaintview;
