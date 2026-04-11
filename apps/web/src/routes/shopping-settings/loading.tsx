import { Box, Card, CardContent, Divider, Skeleton, Typography } from "@mui/material";
import { type FC } from "react";
import SidebarSkeleton from "../../components/Sidebar/SidebarSkeleton";

const ShoppingSettingsLoading: FC = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <SidebarSkeleton />
      <Box sx={{ mx: "auto", my: 2, px: 4, width: "90%" }}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5">
              <Skeleton width={200} />
            </Typography>
          </CardContent>
          <Divider />
          <CardContent>
            <Skeleton height={60} />
            <Skeleton height={60} />
            <Skeleton height={60} />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ShoppingSettingsLoading;
