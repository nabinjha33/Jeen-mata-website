"use client"

import { Skeleton } from "../ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"

interface SkeletonTableProps {
  columns: number
  rows?: number
  showActions?: boolean
}

export function SkeletonTable({ columns, rows = 5, showActions = true }: SkeletonTableProps) {
  return (
    <div className="min-h-[480px]"> {/* Fixed height to prevent layout shift */}
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={index}>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            ))}
            {showActions && (
              <TableHead className="w-[70px]">
                <Skeleton className="h-4 w-12" />
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <TableCell key={colIndex}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
              {showActions && (
                <TableCell>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}