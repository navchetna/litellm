import { Skeleton } from "@/components/ui/skeleton";
import { TableRow, TableCell } from "@/components/ui/table";

interface LogTableSkeletonProps {
  columns: number;
  rows?: number;
}

export function LogTableSkeleton({ columns, rows = 5 }: LogTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="hover:bg-transparent">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex} className="py-3 first:pl-6 last:pr-6">
              <Skeleton className={`h-4 ${colIndex === 0 ? "w-24" : colIndex === 1 ? "w-16" : colIndex === 2 ? "w-8" : "w-20"}`} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
