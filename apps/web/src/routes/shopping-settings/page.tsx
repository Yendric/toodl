import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import { Add, Delete, DragIndicator } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { Suspense, useEffect, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import {
  useCategoryDestroy,
  useCategoryIndexSuspense,
  useCategoryStore,
  useStoreDestroy,
  useStoreGetOrderSuspense,
  useStoreIndexSuspense,
  useStoreStore,
  useStoreUpdateOrder,
} from "../../api/generated/toodl";
import PrivateRoute from "../../components/PrivateRoute";
import Sidebar from "../../components/Sidebar/Sidebar";
import { CurrentListProvider } from "../../context/CurrentListState";

const CategoryManager: FC = () => {
  const { data: categories, refetch } = useCategoryIndexSuspense();
  const createCategoryMutation = useCategoryStore();
  const deleteCategoryMutation = useCategoryDestroy();
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit, reset } = useForm<{ name: string }>();

  const onSubmit = handleSubmit((data) => {
    createCategoryMutation.mutate(
      { data },
      {
        onSuccess: () => {
          enqueueSnackbar("Categorie toegevoegd", { variant: "success" });
          reset();
          void refetch();
        },
        onError: () => enqueueSnackbar("Fout bij toevoegen categorie", { variant: "error" }),
      }
    );
  });

  const handleDelete = (id: number) => {
    deleteCategoryMutation.mutate(
      { categoryId: id },
      {
        onSuccess: () => {
          enqueueSnackbar("Categorie verwijderd", { variant: "success" });
          void refetch();
        },
        onError: () => enqueueSnackbar("Fout bij verwijderen categorie", { variant: "error" }),
      }
    );
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">Categorieën</Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ display: "flex", mt: 1 }}>
          <TextField {...register("name", { required: true })} size="small" label="Nieuwe categorie" fullWidth />
          <Button type="submit" variant="contained" sx={{ ml: 1 }}>
            <Add />
          </Button>
        </Box>
        <List dense>
          {categories.map((cat) => (
            <ListItem
              key={cat.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(cat.id)}>
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText primary={cat.name} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

const StoreManager: FC = () => {
  const { data: stores, refetch } = useStoreIndexSuspense();
  const createStoreMutation = useStoreStore();
  const deleteStoreMutation = useStoreDestroy();
  const { enqueueSnackbar } = useSnackbar();
  const { register, handleSubmit, reset } = useForm<{ name: string }>();

  const onSubmit = handleSubmit((data) => {
    createStoreMutation.mutate(
      { data },
      {
        onSuccess: () => {
          enqueueSnackbar("Winkel toegevoegd", { variant: "success" });
          reset();
          void refetch();
        },
        onError: () => enqueueSnackbar("Fout bij toevoegen winkel", { variant: "error" }),
      }
    );
  });

  const handleDelete = (id: number) => {
    deleteStoreMutation.mutate(
      { storeId: id },
      {
        onSuccess: () => {
          enqueueSnackbar("Winkel verwijderd", { variant: "success" });
          void refetch();
        },
        onError: () => enqueueSnackbar("Fout bij verwijderen winkel", { variant: "error" }),
      }
    );
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">Winkels</Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ display: "flex", mt: 1 }}>
          <TextField {...register("name", { required: true })} size="small" label="Nieuwe winkel" fullWidth />
          <Button type="submit" variant="contained" sx={{ ml: 1 }}>
            <Add />
          </Button>
        </Box>
        <List dense>
          {stores.map((store) => (
            <ListItem
              key={store.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => handleDelete(store.id)}>
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText primary={store.name} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

const StoreOrderManager: FC<{ storeId: number }> = ({ storeId }) => {
  const { data: initialOrder, refetch: refetchOrder } = useStoreGetOrderSuspense(storeId);
  const { data: categories } = useCategoryIndexSuspense();
  const updateOrderMutation = useStoreUpdateOrder();
  const { enqueueSnackbar } = useSnackbar();

  const [order, setOrder] = useState<number[]>([]);

  useEffect(() => {
    const existingCategoryIds = initialOrder.sort((a, b) => a.position - b.position).map((o) => o.categoryId);
    const allCategoryIds = categories.map((c) => c.id);
    const missingCategoryIds = allCategoryIds.filter((id) => !existingCategoryIds.includes(id));

    setOrder([...existingCategoryIds, ...missingCategoryIds]);
  }, [initialOrder, categories, storeId]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(order);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem!);

    setOrder(items);

    updateOrderMutation.mutate(
      {
        storeId,
        data: items.map((categoryId, index) => ({ categoryId, position: index })),
      },
      {
        onSuccess: () => {
          enqueueSnackbar("Volgorde opgeslagen", { variant: "success" });
          void refetchOrder();
        },
        onError: () => enqueueSnackbar("Fout bij opslaan volgorde", { variant: "error" }),
      }
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6">Categorie volgorde</Typography>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="categories">
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {order.map((categoryId, index) => {
                  const category = categories.find((c) => c.id === categoryId);
                  return (
                    <Draggable key={categoryId} draggableId={categoryId.toString()} index={index}>
                      {(provided) => (
                        <ListItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          sx={{ borderBottom: "1px solid", borderColor: "divider" }}
                        >
                          <ListItemIcon {...provided.dragHandleProps}>
                            <DragIndicator />
                          </ListItemIcon>
                          <ListItemText primary={category?.name || `Categorie ${categoryId}`} />
                        </ListItem>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};

const ShoppingSettings: FC = () => {
  const { data: stores } = useStoreIndexSuspense();
  const [selectedStoreId, setSelectedStoreId] = useState<number | "">(stores.length > 0 ? stores[0]!.id : "");

  return (
    <PrivateRoute>
      <CurrentListProvider>
        <Box sx={{ display: "flex" }}>
          <Sidebar />
          <Box sx={{ mx: "auto", my: 2, px: 4, width: "90%" }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Winkelinstellingen
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 4 }}>
                <Suspense fallback={<Typography>Laden...</Typography>}>
                  <CategoryManager />
                </Suspense>
                <Suspense fallback={<Typography>Laden...</Typography>}>
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
                        onChange={(e) => setSelectedStoreId(e.target.value as number)}
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
                  <Suspense fallback={<Typography>Laden volgorde...</Typography>}>
                    <StoreOrderManager storeId={selectedStoreId} />
                  </Suspense>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </CurrentListProvider>
    </PrivateRoute>
  );
};

export default ShoppingSettings;
