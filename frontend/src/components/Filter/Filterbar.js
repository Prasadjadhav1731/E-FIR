import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoCloseOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import { defaultTownTree } from "../../config/townTreeData";

function Filterbar({
  currentUser,
  complaints,
  setComplaintList,
  isVisible,
  setIsVisible,
  filters,
  setFilters,
}) {
  const [townTree, setTownTree] = useState(defaultTownTree);
  const navidateIo = useNavigate();

  const Categories = [
    "Cognizable Offenses",
    "Non-Cognizable Offenses",
    "Bailable Offenses",
    "Non-Bailable Offenses",
    "Compoundable Offenses",
    "Non-Compoundable Offenses",
    "Offenses against Women",
    "Offenses against Children",
    "Economic Offenses",
    "Cyber Crimes",
    "Drug Offenses",
    "Environmental Offenses",
    "Traffic Offenses",
    "Property Offenses",
    "Terrorism-related Offenses",
    "White-collar Crimes",
    "Corruption Offenses",
    "Fraudulent Practices",
    "Domestic Violence Offenses",
    "Sexual Harassment Offenses",
    "Human Trafficking Offenses",
    "Intellectual Property Crimes",
    "Hate Crimes",
    "Juvenile Offenses",
    "Organized Crime",
    "Money Laundering Offenses",
    "Forgery and Counterfeiting Offenses",
    "Alcohol-related Offenses",
    "Public Order Offenses",
    "Violation of Intellectual Property Rights",
    "Cyberbullying Offenses",
    "Religious Offenses",
    "Wildlife Crimes",
    "Labour Law Violations",
    "Immigration Offenses",
    "Not Identified",
  ];

  useEffect(() => {
    try {
      if (!currentUser || (currentUser.role && currentUser.role !== "super"))
        navidateIo("/");
    } catch (error) {}
  }, [currentUser]);

  useEffect(() => {
    const fetchTownTree = async () => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/fetchTownTree`,
          {}
        );
        if (res.data && res.data.data && res.data.data.TownTree && typeof res.data.data.TownTree === "object" && !Array.isArray(res.data.data.TownTree)) {
          setTownTree(res.data.data.TownTree);
        }
      } catch (err) {
        console.error("Error fetching town tree:", err);
      }
    };

    fetchTownTree();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      ["page"]: 1,
      [name]: value,
    }));
  };

  const handleClearAll = () => {
    setFilters({
      page: 1,
      limit: "",
      fromDateIncident: "",
      toDateIncident: "",
      fromDateLastEdited: "",
      toDateLastEdited: "",
      district: "",
      subDistrict: "",
      status: "",
      uniqueUserId: "",
      aadhar: "",
      Categories: "",
    });
  };

  // Check if any filter value is non-empty
  const isFilterActive = Object.keys(filters).some(
    (key) => filters[key] !== ""
  );

  useEffect(() => {
    const fetch = async () => {
      try {
        const URL = generateComplaintFetchLink();
        if (!URL) return;
        const result = await axios.get(URL);
        console.log(result.data);

        setComplaintList(result.data);
      } catch (err) {}
    };

    fetch();
  }, [filters, currentUser]);

  const generateComplaintFetchLink = () => {
    if (!currentUser || !currentUser._id) return "";
    let baseUrl = `${API_BASE_URL}/complaints/fetchSuper/${currentUser._id}`;
    const url = new URL(baseUrl);

    if (filters.page) {
      url.searchParams.set("page", filters.page.toString());
    }

    if (filters.limit) {
      url.searchParams.set("limit", filters.limit.toString());
    }

    if (filters.fromDateIncident) {
      url.searchParams.set("fromDateIncident", filters.fromDateIncident);
    }

    if (filters.toDateIncident) {
      url.searchParams.set("toDateIncident", filters.toDateIncident);
    }

    if (filters.fromDateLastEdited) {
      url.searchParams.set("fromDateLastEdited", filters.fromDateLastEdited);
    }

    if (filters.toDateLastEdited) {
      url.searchParams.set("toDateLastEdited", filters.toDateLastEdited);
    }

    if (filters.district) {
      url.searchParams.set("district", filters.district);
    }

    if (filters.subDistrict) {
      url.searchParams.set("subDistrict", filters.subDistrict);
    }

    if (filters.status) {
      url.searchParams.set("status", filters.status);
    }

    if (filters.uniqueUserId) {
      url.searchParams.set("uniqueUserId", filters.uniqueUserId);
    }

    if (filters.aadhar) {
      url.searchParams.set("aadhar", filters.aadhar);
    }

    if (filters.Categories) {
      url.searchParams.set("Categories", filters.Categories);
    }

    return url.toString();
  };

  return (
    <div
      className={`w-fit z-30 h-fit sticky xs:fixed xs:w-screen xs:h-screen xs:top-0 xs:left-0 xs:bg-black xs:bg-opacity-40 flex items-start transition-all duration-300 ${
        isVisible
          ? "translate-x-0 opacity-100"
          : "-translate-x-[110%] xs:-translate-y-full opacity-0 pointer-events-none max-w-0"
      }`}
    >
      <div className="relative w-80 max-w-full font-poppins bg-rose-50/95 backdrop-blur-md rounded-2xl border border-rose-200 shadow-xl p-4 space-y-3 overflow-y-auto max-h-[85vh]">
        <div className="flex justify-between items-center pb-2 border-b border-rose-200">
          <span className="font-bold text-gray-800 text-base">Filter Complaints</span>
          <div className="flex items-center gap-2">
            {isFilterActive && (
              <button
                type="button"
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold uppercase tracking-wider transition-colors"
                onClick={handleClearAll}
              >
                Clear All
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-800 text-2xl p-0.5 rounded-full hover:bg-rose-100 transition-colors"
            >
              <IoCloseOutline />
            </button>
          </div>
        </div>

        {/* Date of Incident */}
        <div className="space-y-1">
          <label className="block text-gray-700 text-xs font-bold">
            Date of Incident:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-medium text-gray-500 block mb-0.5">From</span>
              <input
                type="date"
                name="fromDateIncident"
                value={filters.fromDateIncident}
                onChange={handleFilterChange}
                className="w-full bg-white border border-gray-300 rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm"
              />
            </div>
            <div>
              <span className="text-[10px] font-medium text-gray-500 block mb-0.5">To</span>
              <input
                type="date"
                name="toDateIncident"
                value={filters.toDateIncident}
                onChange={handleFilterChange}
                className="w-full bg-white border border-gray-300 rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Date of Filing */}
        <div className="space-y-1">
          <label className="block text-gray-700 text-xs font-bold">
            Date of Filing Complaint:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-[10px] font-medium text-gray-500 block mb-0.5">From</span>
              <input
                type="date"
                name="fromDateLastEdited"
                value={filters.fromDateLastEdited}
                onChange={handleFilterChange}
                className="w-full bg-white border border-gray-300 rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm"
              />
            </div>
            <div>
              <span className="text-[10px] font-medium text-gray-500 block mb-0.5">To</span>
              <input
                type="date"
                name="toDateLastEdited"
                value={filters.toDateLastEdited}
                onChange={handleFilterChange}
                className="w-full bg-white border border-gray-300 rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* District & Sub-District */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-gray-700 text-xs font-bold mb-1">
              District
            </label>
            <select
              name="district"
              value={filters.district}
              onChange={handleFilterChange}
              className="w-full bg-white border border-gray-300 rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm"
            >
              <option value="">All Districts</option>
              {Object.keys(townTree).map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-xs font-bold mb-1">
              Sub-District
            </label>
            <select
              name="subDistrict"
              value={filters.subDistrict}
              onChange={handleFilterChange}
              className="w-full bg-white border border-gray-300 rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm"
            >
              <option value="">All Sub-Districts</option>
              {townTree[filters.district] &&
                townTree[filters.district].map((subDistrict) => (
                  <option key={subDistrict} value={subDistrict}>
                    {subDistrict}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-1">
          <label className="block text-gray-700 text-xs font-bold">
            Categories
          </label>
          <select
            name="Categories"
            value={filters.Categories}
            onChange={handleFilterChange}
            className="w-full bg-white border border-gray-300 rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm truncate"
          >
            <option value="">Select Category</option>
            {Categories &&
              Categories.map((ele) => (
                <option key={ele} value={ele}>
                  {ele}
                </option>
              ))}
          </select>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label className="block text-gray-700 text-xs font-bold">
            Status
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full bg-white border border-gray-300 rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Park">Parked</option>
          </select>
        </div>

        {/* Official Identification Number */}
        <div className="space-y-1">
          <label className="block text-gray-700 text-xs font-bold">
            Official Identification Number
          </label>
          <input
            type="text"
            name="uniqueUserId"
            value={filters.uniqueUserId}
            onChange={handleFilterChange}
            placeholder="Enter User ID..."
            className="w-full bg-white border border-gray-300 rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm"
          />
        </div>

        {/* Aadhaar Number */}
        <div className="space-y-1">
          <label className="block text-gray-700 text-xs font-bold">
            Aadhaar Number
          </label>
          <input
            type="text"
            name="aadhar"
            value={filters.aadhar}
            onChange={handleFilterChange}
            placeholder="Enter Aadhaar..."
            className="w-full bg-white border border-gray-300 rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}

export default Filterbar;
