import { Box, Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { Suspense, type FC } from "react";
import { useStoreIndexSuspense } from "../../api/generated/toodl";

const StoreSelect: FC<{ selectedStoreId: number | ""; onStoreChange: (id: number | "") => void }> = ({
  selectedStoreId,
  onStoreChange,
}) => {
  const { data: stores } = useStoreIndexSuspense();

  return (
    <TextField
      select
      size="small"
      value={selectedStoreId}
      onChange={(e) => onStoreChange(e.target.value as number | "")}
      sx={{ minWidth: 150 }}
      slotProps={{
        select: { displayEmpty: true },
      }}
    >
      <MenuItem value="">
        <em>Geen winkel</em>
      </MenuItem>
      {stores.map((store) => (
        <MenuItem key={store.id} value={store.id}>
          {store.name}
        </MenuItem>
      ))}
    </TextField>
  );
};

interface Props {
  completedCount: number;
  activeCount: number;
  isShoppingList: boolean;
  selectedStoreId: number | "";
  onStoreChange: (id: number | "") => void;
  onDestroyCompleted: () => void;
}

const TodoTableHeader: FC<Props> = ({
  completedCount,
  activeCount,
  isShoppingList,
  selectedStoreId,
  onStoreChange,
  onDestroyCompleted,
}) => {
  return (
    <Box
      sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        <Button disabled={completedCount === 0} onClick={onDestroyCompleted} variant="contained" sx={{ height: 40 }}>
          Verwijder voltooid
        </Button>
        {isShoppingList && (
          <Suspense fallback={null}>
            <StoreSelect selectedStoreId={selectedStoreId} onStoreChange={onStoreChange} />
          </Suspense>
        )}
      </Stack>
      <Typography variant="body2" color="text.secondary">
        Onvoltooid: <strong>{activeCount}</strong>
      </Typography>
    </Box>
  );
};

export default TodoTableHeader;
