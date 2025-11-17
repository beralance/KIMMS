import { Box } from "@mui/material";
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

export default function SalesBySizeGraph({ data }) {
    const formatted = data.map((item) => ({
        label: item._id === true ? "Large Item" : "Small Item",
        sales: item.sales,
        count: item.count,
    }));

    return (
        <Box>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={formatted}>
                    <YAxis type="number" />
                    <XAxis type="category" dataKey="label" />
                    <Tooltip />
                    <Legend />

                    <Bar dataKey="sales" name="Total Sales" fill="#4BC0C0" />
                    <Bar dataKey="count" name="Count" fill="#f8c8a8ff" />
                </BarChart>
            </ResponsiveContainer>
        </Box>
    );
}
