import { Box, Button, Container, Skeleton, Typography } from "@mui/material";
import { type FC } from "react";
import SidebarSkeleton from "../../components/Sidebar/SidebarSkeleton";

const TodosLoading: FC = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <SidebarSkeleton />
      <Box component="main" sx={{ p: 2, width: "calc(100% - 56px)" }}>
        <Box sx={{ mb: 2 }}>
          <Button sx={{ float: "left" }} disabled={true} variant="contained">
            Verwijder voltooid
          </Button>
          <Typography sx={{ float: "right" }}>
            <Skeleton width={100} />
          </Typography>
        </Box>
        <Box sx={{ mb: 2, display: "flex", justifyContent: "center" }}>
          <Skeleton width="25rem" height={40} />
        </Box>
        <Container sx={{ p: 0 }} maxWidth="md">
          <Skeleton height={60} sx={{ mb: 1 }} />
          <Skeleton height={60} sx={{ mb: 1 }} />
          <Skeleton height={60} sx={{ mb: 1 }} />
        </Container>
      </Box>
    </Box>
  );
};

export default TodosLoading;
