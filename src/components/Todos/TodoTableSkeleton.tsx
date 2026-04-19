import {
  Box,
  Button,
  Container,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { type FC } from "react";

const TodoTableSkeleton: FC = () => {
  return (
    <Box component="main" sx={{ p: 2, flexGrow: 1, width: "100%" }}>
      {/* Header Skeleton */}
      <Box
        sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Button disabled variant="contained" sx={{ height: 40 }}>
            Verwijder voltooid
          </Button>
        </Box>
        <Typography variant="body2">
          <Skeleton width={100} />
        </Typography>
      </Box>

      {/* Create Todo Form Skeleton */}
      <Box sx={{ mb: 5, display: "flex", justifyContent: "center" }}>
        <Skeleton variant="rounded" sx={{ width: "100%", maxWidth: "25rem", height: 56 }} />
      </Box>

      {/* Table Skeleton */}
      <Container sx={{ p: 0 }} maxWidth="md">
        <TableContainer component={Paper} sx={{ mb: 2 }}>
          <Table size="small">
            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i} sx={{ height: 45 }}>
                  <TableCell sx={{ width: 48, p: "0 !important", textAlign: "center" }}>
                    <Skeleton variant="circular" width={20} height={20} sx={{ mx: "auto" }} />
                  </TableCell>

                  <TableCell sx={{ p: "0 !important" }}>
                    <Skeleton variant="text" width="60%" height={20} />
                  </TableCell>
                  <TableCell align="right" sx={{ width: 48, p: "0 !important" }}>
                    <Skeleton variant="circular" width={28} height={28} sx={{ ml: "auto", mr: 1 }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Completed Section Skeleton */}
        <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
          <Skeleton variant="text" width={150} height={32} />
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableBody>
              {[1, 2].map((i) => (
                <TableRow key={i} sx={{ height: 48 }}>
                  <TableCell sx={{ width: 48, p: "0 !important", textAlign: "center" }}>
                    <Skeleton variant="rounded" width={20} height={20} sx={{ mx: "auto" }} />
                  </TableCell>
                  <TableCell sx={{ p: "0 !important" }}>
                    <Skeleton variant="text" width="40%" height={20} />
                  </TableCell>
                  <TableCell align="right" sx={{ width: 48, p: "0 !important" }}>
                    <Skeleton variant="circular" width={28} height={28} sx={{ ml: "auto", mr: 1 }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default TodoTableSkeleton;
