import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Tabs, Tab } from "react-bootstrap"; // Tabs for switching
import { BASE_URL } from "../../utils/config";

const AccountReport = () => {
  const [childReports, setChildReports] = useState([]);
  const [teacherReports, setTeacherReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/reports/child-analytics`);

        const childreports = response.data?.data?.childreports || [];
        const teacherreports = response.data?.data?.teacherreports || [];

        // Helper fn → format months like "Apr 2025" → "Apr 25"
        const formatData = (data, valueKey) =>
          (data || []).map((item) => {
            if (!item?.month) return { month: "N/A", [valueKey]: 0 };
            const [monthName, year] = item.month.split(" ");
            return {
              ...item,
              month: `${monthName} ${year?.slice(-2) || ""}`,
              [valueKey]: item[valueKey] || 0,
            };
          });

        setChildReports(formatData(childreports, "total_enrollments"));
        setTeacherReports(formatData(teacherreports, "total_teachers"));
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Unable to fetch analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <div>Loading analytics...</div>;

  return (
    <div className="p-4">
      <h2 className="mb-4">Monthly Analytics</h2>

      {error && <div className="text-danger mb-3">{error}</div>}

      <Tabs defaultActiveKey="children" id="report-tabs" className="mb-3">
        {/* Children Report */}
        <Tab eventKey="children" title="Children Report">
          {childReports.length === 0 ? (
            <p>No child reports available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={childReports}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="total_enrollments"
                  fill="#2ab7a9"
                  barSize={40}
                  name="Total Enrollments"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Tab>

        {/* Staff Report */}
        <Tab eventKey="staff" title="Staff Report">
          {teacherReports.length === 0 ? (
            <p>No staff reports available.</p>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={teacherReports}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="total_teachers"
                  fill="#2ab7a9"
                  barSize={40}
                  name="Total Teachers"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Tab>
      </Tabs>
    </div>
  );
};

export default AccountReport;
