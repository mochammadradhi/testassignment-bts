import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchChecklistItems,
  addChecklistItem,
  deleteChecklistItem,
  toggleChecklistItem,
  renameChecklistItem,
} from "@/redux/features/checklistItemSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  Pencil,
} from "lucide-react";
import { useFormik } from "formik";
import type { RootState, AppDispatch } from "@/redux/store";
import { toast } from "sonner";

interface Props {
  checklistId: number;
  name: string;
  onDelete: () => void;
}

const ChecklistCard = ({ checklistId, name, onDelete }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const items = useSelector(
    (state: RootState) => state.checklistItems[checklistId] || []
  );

  useEffect(() => {
    if (open && items.length === 0) {
      dispatch(fetchChecklistItems(checklistId));
    }
  }, [open]);

  const formik = useFormik({
    initialValues: { item: "" },
    onSubmit: (values, { resetForm }) => {
      if (values.item.trim()) {
        dispatch(addChecklistItem({ checklistId, name: values.item }))
          .unwrap()
          .then(() => toast.success("Item added"))
          .catch(() => toast.error("Failed to add item"));

        resetForm();
      }
    },
  });

  return (
    <div className="bg-yellow-50 p-4 rounded-xl shadow hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-center">
        <div className="font-medium text-lg text-gray-900 break-words">
          {name}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
            {open ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {open && (
        <div className="mt-3 space-y-2">
          <form onSubmit={formik.handleSubmit} className="flex gap-2">
            <Input
              name="item"
              value={formik.values.item}
              onChange={formik.handleChange}
              placeholder="Add item"
              className="text-sm"
            />
            <Button type="submit" size="sm">
              Add
            </Button>
          </form>

          <ul className="mt-2 space-y-2">
            {items.map((item) => {
              const isEditing = editingId === item.id;

              return (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-2"
                >
                  {isEditing ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (editValue.trim()) {
                          dispatch(
                            renameChecklistItem({
                              checklistId,
                              id: item.id,
                              newName: editValue,
                            })
                          )
                            .unwrap()
                            .then(() => {
                              toast.success("Item renamed");
                              setEditingId(null);
                            })
                            .catch(() => toast.error("Rename failed"));
                        }
                      }}
                      className="flex items-center gap-2 w-full"
                    >
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                        onBlur={() => setEditingId(null)}
                        className="text-sm"
                      />
                    </form>
                  ) : (
                    <button
                      onClick={() =>
                        dispatch(
                          toggleChecklistItem({ checklistId, id: item.id })
                        )
                          .unwrap()
                          .then(() => toast.success("Item completed"))
                          .catch(() => toast.error("Failed to complete item"))
                      }
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      {item.itemCompletionStatus ? (
                        <CheckSquare className="w-5 h-5 text-green-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-500" />
                      )}
                      <span
                        className={`text-sm ${
                          item.itemCompletionStatus
                            ? "line-through text-gray-400"
                            : ""
                        }`}
                      >
                        {item.name}
                      </span>
                    </button>
                  )}

                  {!isEditing && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditValue(item.name);
                          setEditingId(item.id);
                        }}
                      >
                        <Pencil className="w-4 h-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          dispatch(
                            deleteChecklistItem({ checklistId, id: item.id })
                          )
                            .unwrap()
                            .then(() => toast.success("Item deleted"))
                            .catch(() => toast.error("Failed to delete item"))
                        }
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChecklistCard;
