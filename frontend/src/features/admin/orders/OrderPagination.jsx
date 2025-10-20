import * as React from 'react';
import {Pagination, Stack} from '@mui/material';

export default function OrderPagination({count, page, onChange}) {
    return (
        <Stack spacing={2} sx={{display: count > 0 ? 'flex' : 'none', mb: 10}} alignItems={'center'}>
            <Pagination 
                count={count} 
                page={page} 
                onChange={onChange} 
                variant='contained' 
                shape="rounded" 
            />
        </Stack>
    );
}