"use client";

import * as React from "react";
import { CheckSquare } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { MOCK_TASKS } from "@/lib/mock-data";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TaskItem } from "@/types/models";
import { ShaadiStorage } from "@/lib/shaadi-storage";

export default function TasksPage() {
  const [tasks, setTasks] = React.useState<TaskItem[]>([]);

  React.useEffect(() => {
    setTasks(ShaadiStorage.getTasks());
  }, []);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-900 tracking-tight">
          Wedding Operations Timeline & Task Board
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Coordinate deliverables across coordinators, families, and vendors with function linkages.
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task Title</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-semibold text-navy-900">{t.title}</TableCell>
              <TableCell>
                <Badge
                  variant={t.priority === "urgent" ? "destructive" : t.priority === "high" ? "gold" : "secondary"}
                  className="uppercase text-[10px]"
                >
                  {t.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-slate-600">{t.assigneeName}</TableCell>
              <TableCell className="text-xs capitalize font-medium text-navy-800">{t.status.replace("_", " ")}</TableCell>
              <TableCell className="text-right text-xs font-mono text-slate-500">{t.dueDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
