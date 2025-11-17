import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const StockSizeBar = ({ data }) => {
    if (!data || data.length === 0) return <p>No data available</p>;

    return (
        <div style={{ width: "100%", height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#36A2EB" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StockSizeBar;
