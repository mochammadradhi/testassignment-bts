import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  fetchChecklists,
  addChecklist,
  deleteChecklist,
} from "@/redux/features/checklistSlice";
import type { RootState, AppDispatch } from "@/redux/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ChecklistCard from "@/components/ChecklistCard";
import LogoutButton from "@/components/LogoutButton";
import { toast } from "sonner";

const HomePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: checklists,
    loading,
    error,
  } = useSelector((state: RootState) => state.checklist);

  useEffect(() => {
    dispatch(fetchChecklists());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: { name: "" },
    onSubmit: (values, { resetForm }) => {
      if (values.name.trim()) {
        dispatch(addChecklist(values.name))
          .unwrap()
          .then(() => toast.success("Todo added"))
          .catch(() => toast.error("Failed to add item"));
        resetForm();
      }
    },
  });

  return (
    <div className="p-6 mx-auto max-w-7xl">
      <h1 className="text-3xl font-semibold mb-6">My Todo</h1>

      <form
        onSubmit={formik.handleSubmit}
        className="flex gap-2 mb-8 sticky top-0 bg-white z-10"
      >
        <Input
          name="name"
          placeholder="Take a note..."
          value={formik.values.name}
          onChange={formik.handleChange}
          className="rounded-xl"
        />
        <Button type="submit" variant="default">
          <Plus className="w-4 h-4 mr-1" />
          Add
        </Button>
      </form>

      <LogoutButton />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {checklists.map((list) => (
          <ChecklistCard
            key={list.id}
            checklistId={list.id}
            name={list.name}
            onDelete={() =>
              dispatch(deleteChecklist(list.id))
                .unwrap()
                .then(() => toast.success("Todo deleted"))
                .catch(() => toast.error("Failed to delete checklist"))
            }
          />
        ))}
      </div>

      {loading && (
        <p className="text-sm mt-4 text-gray-500">Loading todos...</p>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default HomePage;
