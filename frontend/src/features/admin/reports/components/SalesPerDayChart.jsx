import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

export const SalesPerDayChart = ({ salesPerDay }) => {
    if (!salesPerDay || salesPerDay.length === 0)
        return <p>No sales data available</p>;

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesPerDay}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="totalSales"
                    stroke="#36A2EB"
                    name="Total Sales"
                />
                <Line
                    type="monotone"
                    dataKey="totalOrders"
                    stroke="#FF6384"
                    name="Orders"
                />
            </LineChart>
        </ResponsiveContainer>
    );
};
