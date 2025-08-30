"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import {
  Save,
  MoreHorizontal,
  ArrowLeft,
  Trash2,
  Download,
  Copy,
  Settings,
  Keyboard,
} from "lucide-react";
import { toast } from "sonner";

interface ProblemToolbarProps {
  // Save functionality
  hasUnsavedChanges?: boolean;
  onSave?: () => void;
  isSaving?: boolean;
  saveDisabled?: boolean;

  // Delete functionality
  onDelete?: () => void;
  isDeleting?: boolean;
  deleteDisabled?: boolean;

  // Navigation
  onBack?: () => void;
  backLabel?: string;

  // Code actions
  code?: string;
  onExport?: () => void;
  onCopy?: () => void;

  // Additional actions
  children?: React.ReactNode;
}

export function ProblemToolbar({
  hasUnsavedChanges = false,
  onSave,
  isSaving = false,
  saveDisabled = false,
  onDelete,
  isDeleting = false,
  deleteDisabled = false,
  onBack,
  backLabel = "Назад",
  code,
  onExport,
  onCopy,
  children,
}: ProblemToolbarProps) {
  const handleCopyCode = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard!");
    }
  };

  const handleExportCode = () => {
    if (code) {
      const blob = new Blob([code], { type: "text/javascript" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "problem-code.js";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Code exported!");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Back Button */}
      {onBack && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Button>
          <Separator orientation="vertical" className="h-6" />
        </>
      )}

      {/* Save Button */}
      {onSave && (
        <Button
          variant={hasUnsavedChanges ? "default" : "secondary"}
          size="sm"
          onClick={onSave}
          disabled={saveDisabled || isSaving}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving
            ? "Сохранение..."
            : hasUnsavedChanges
              ? "Сохранить"
              : "Сохранено"}
        </Button>
      )}

      {/* Additional children buttons */}
      {children}

      {/* More Actions Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Code Actions */}
          <DropdownMenuItem onClick={onCopy || handleCopyCode} disabled={!code}>
            <Copy className="h-4 w-4 mr-2" />
            Копировать код
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onExport || handleExportCode}
            disabled={!code}
          >
            <Download className="h-4 w-4 mr-2" />
            Экспортировать код
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Keyboard Shortcuts Info */}
          <DropdownMenuItem disabled>
            <Keyboard className="h-4 w-4 mr-2" />
            ⌘S — Сохранить
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Delete Action */}
          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  disabled={deleteDisabled || isDeleting}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Problem</AlertDialogTitle>
                  <AlertDialogTitle>Удалить задачу</AlertDialogTitle>
                  <AlertDialogDescription>
                    Вы уверены, что хотите удалить эту задачу? Это действие
                    невозможно отменить.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отменить</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
