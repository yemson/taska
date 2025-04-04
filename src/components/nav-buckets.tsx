import { MoreHorizontal, Trash2, Plus, PenLine } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useBucketStore } from "@/store/use-bucket-store";
import { NewBucketDialog } from "./dialog/new-bucket-dialog";
import { useEffect, useState } from "react";
import { UpdateBucketDialog } from "./dialog/update-bucket-dialog";
import { Bucket } from "@/types/bucket";
import { useProjectStore } from "@/store/use-project-store";

export function NavProjects() {
  const { isMobile } = useSidebar();

  const activeProject = useProjectStore((state) => state.activeProject);

  const buckets = useBucketStore((state) => state.buckets);
  const loadBuckets = useBucketStore((state) => state.loadBuckets);

  const [newBucketOpen, setNewBucketOpen] = useState(false);
  const [updateBucketOpen, setUpdateBucketOpen] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState<Bucket | null>(null);

  useEffect(() => {
    if (activeProject) {
      loadBuckets(activeProject.id);
    }
  }, [activeProject, loadBuckets]);

  const handleUpdateBucket = (bucket: Bucket) => {
    setSelectedBucket(bucket);
    setUpdateBucketOpen(true);
  };

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>버킷</SidebarGroupLabel>
        <SidebarMenu>
          {buckets.map((bucket) => (
            <SidebarMenuItem key={bucket.title}>
              <SidebarMenuButton asChild>
                <span>{bucket.title}</span>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">새로운 버킷</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem onClick={() => handleUpdateBucket(bucket)}>
                    <PenLine className="text-muted-foreground" />
                    <span>정보 변경</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive">
                    <Trash2 className="text-muted-foreground" />
                    <span>삭제</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setNewBucketOpen(true)}
              className="text-sidebar-foreground/70"
            >
              <Plus className="text-sidebar-foreground/70" />
              <span>새로운 버킷</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <NewBucketDialog open={newBucketOpen} onOpenChange={setNewBucketOpen} />
      <UpdateBucketDialog
        open={updateBucketOpen}
        onOpenChange={setUpdateBucketOpen}
        bucket={selectedBucket}
      />
    </>
  );
}
