import React from "react";
import { useTheme } from "@mui/material/styles";
import { Pagination as MuiPagination, Stack } from "@mui/material";

const Pagination = ({ tagsPerPage, totalTags, paginate, currentPage }) => {
    const theme = useTheme();
    const pageNumbers = Math.ceil(totalTags / tagsPerPage);

    return (
        <Stack spacing={2} justifyContent="center" alignItems="center">
            <MuiPagination
                count={pageNumbers}
                page={currentPage}
                onChange={(event, value) => paginate(value)}
                color="primary"
                size="large"
                shape="rounded"
                variant="outlined"
                siblingCount={1}
                boundaryCount={1}
            />
        </Stack>
    );
};

export default Pagination;
