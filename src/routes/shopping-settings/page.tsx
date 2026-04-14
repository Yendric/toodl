import { Box, Card, CardContent, FormControl, Grid, MenuItem, Select, Skeleton, Typography } from "@mui/material";
import { Suspense, useState, type FC } from "react";
import { useStoreIndexSuspense } from "../../api/generated/toodl";
import CategoryManager from "../../components/ShoppingSettings/CategoryManager";
import StoreManager from "../../components/ShoppingSettings/StoreManager";
import StoreOrderManager from "../../components/ShoppingSettings/StoreOrderManager";

const ShoppingSettings: FC = () => {
  const { data: stores } = useStoreIndexSuspense();
  const [selectedStoreId, setSelectedStoreId] = useState<number | "">(stores.length > 0 ? stores[0]!.id : "");

  return (
    <Box sx={{ mx: "auto", my: 2, px: 4, width: "90%" }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Winkelinstellingen
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Suspense
            fallback={
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Skeleton width="60%" height={32} sx={{ mb: 1 }} />
                  <Skeleton height={40} sx={{ mb: 2 }} />
                  <Skeleton height={32} />
                  <Skeleton height={32} />
                  <Skeleton height={32} />
                </CardContent>
              </Card>
            }
          >
            <CategoryManager />
          </Suspense>
          <Suspense
            fallback={
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Skeleton width="60%" height={32} sx={{ mb: 1 }} />
                  <Skeleton height={40} sx={{ mb: 2 }} />
                  <Skeleton height={32} />
                  <Skeleton height={32} />
                </CardContent>
              </Card>
            }
          >
            <StoreManager />
          </Suspense>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">Selecteer winkel voor volgorde</Typography>
              <FormControl fullWidth sx={{ mt: 1 }}>
                <Select
                  value={selectedStoreId}
                  onChange={(e) => setSelectedStoreId(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>
                    Selecteer een winkel
                  </MenuItem>
                  {stores.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                      {store.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
          {selectedStoreId && (
            <Suspense
              fallback={
                <Card>
                  <CardContent>
                    <Skeleton width="60%" height={32} sx={{ mb: 2 }} />
                    <Skeleton height={48} sx={{ mb: 1 }} />
                    <Skeleton height={48} sx={{ mb: 1 }} />
                    <Skeleton height={48} sx={{ mb: 1 }} />
                  </CardContent>
                </Card>
              }
            >
              <StoreOrderManager key={selectedStoreId} storeId={selectedStoreId} />
            </Suspense>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShoppingSettings;
