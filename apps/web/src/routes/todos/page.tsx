import { Suspense, type FC } from "react";
import { Navigate, useSearchParams } from "react-router";
import { useListIndexSuspense } from "../../api/generated/toodl";
import TodoTable from "../../components/Todos/TodoTable";
import TodoTableSkeleton from "../../components/Todos/TodoTableSkeleton";
import WelcomeUserModal from "../../components/Todos/WelcomeUserModal";

const Todos: FC = () => {
  const [searchParams] = useSearchParams();
  const currentListId = Number(searchParams.get("list")) || 0;

  const { data: lists } = useListIndexSuspense();

  if (!currentListId && lists.length > 0) {
    return <Navigate to={`?list=${lists[0]!.id}`} replace />;
  }

  return (
    <>
      <WelcomeUserModal />
      <Suspense key={currentListId} fallback={<TodoTableSkeleton />}>
        <TodoTable />
      </Suspense>
    </>
  );
};

export default Todos;
