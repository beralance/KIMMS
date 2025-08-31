import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

export default function ShopPagination({ page, count, onChange }) {
    return (
        <Stack spacing={1} alignItems="center" sx={{ my: 2,}}>
            <Pagination sx={{}}
                count={count}          // total number of pages
                page={page}            // current page
                onChange={onChange}    // function (event, value) => {}
                variant="text"
                shape="rounded"
                color="primary"
            />
        </Stack>
    );
}
