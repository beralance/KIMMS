import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const ReusableBarChart = ({
    title,
    data,
    labelKey = "_id",
    valueKey = "value",
}) => {
    if (!data || data.length === 0) return <p>No data available</p>;

    // Convert data format — rename keys so recharts can read it easily
    const formatted = data.map((item) => ({
        name: item[labelKey],
        value: item[valueKey],
    }));

    return (
        <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formatted}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#4BC0C0" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ReusableBarChart;
