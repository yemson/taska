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
import { useState } from "react";
import { UpdateBucketDialog } from "./dialog/update-bucket-dialog";
import { Bucket } from "@/types/bucket";
import { useNavigate } from "react-router";
import { DeleteBucketAlertDialog } from "./dialog/delete-bucket-alert-dialog";

export function NavProjects() {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();

  const buckets = useBucketStore((state) => state.buckets);
  const activeBucket = useBucketStore((state) => state.activeBucket);
  const setActiveBucket = useBucketStore((state) => state.setActiveBucket);

  const [newBucketOpen, setNewBucketOpen] = useState(false);
  const [updateBucketOpen, setUpdateBucketOpen] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState<Bucket | null>(null);
  const [deleteBucketOpen, setDeleteProjectOpen] = useState(false);
  const [deleteBucketId, setDeleteProjectId] = useState<string>("");

  const handleUpdateBucket = (bucket: Bucket) => {
    setSelectedBucket(bucket);
    setUpdateBucketOpen(true);
  };

  const handleSelectBucket = (bucket: Bucket) => {
    setActiveBucket(bucket);

    navigate({
      search: `?bucketId=${bucket.id}`,
    });
  };

  const handleDeleteBucket = async (bucketId: string) => {
    setDeleteProjectId(bucketId);
    setDeleteProjectOpen(true);
  };

  return (
    <>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>버킷</SidebarGroupLabel>
        <SidebarMenu>
          {buckets.map((bucket) => (
            <SidebarMenuItem key={bucket.id}>
              <SidebarMenuButton
                onClick={() => handleSelectBucket(bucket)}
                className={activeBucket?.id === bucket.id ? "bg-muted" : ""}
              >
                {bucket.title}
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal size={16} />
                    <span className="sr-only">버킷 옵션</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem onClick={() => handleUpdateBucket(bucket)}>
                    <PenLine className="mr-2 h-4 w-4 text-muted-foreground" />{" "}
                    <span>정보 변경</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => handleDeleteBucket(bucket.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>삭제</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setNewBucketOpen(true)}
              className="text-sidebar-foreground/70 hover:text-sidebar-foreground"
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
      <DeleteBucketAlertDialog
        open={deleteBucketOpen}
        onOpenChange={setDeleteProjectOpen}
        bucketId={deleteBucketId}
      />
    </>
  );
}
