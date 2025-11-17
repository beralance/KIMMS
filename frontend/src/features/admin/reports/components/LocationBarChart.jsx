import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
    Rectangle,
} from "recharts";

const LocationBarChart = ({ data }) => {
    if (!data || data.length === 0) return <p>No data available</p>;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart responsive data={data}>
                <Tooltip />
                <Legend />
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="value" name="Percentage" fill="#908ee6ff" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default LocationBarChart;
