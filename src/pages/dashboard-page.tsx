import { LoaderCircle } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useProjectStore } from "@/store/use-project-store";
import { useBucketStore } from "@/store/use-bucket-store";
import { useAuthStore } from "@/store/use-auth-store";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { WeeklyTaskChart } from "@/components/chart/weekly-task-chart";
import { TotalTaskChart } from "@/components/chart/total-task-chart";

export default function DashboardPage() {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();

  const bucketId = searchParams.get("bucketId") || "";

  const user = useAuthStore((state) => state.user);

  const projectsLoaded = useProjectStore((state) => state.projectsLoaded);
  const loadProjects = useProjectStore((state) => state.loadProjects);
  const activeProject = useProjectStore((state) => state.activeProject);

  const loadBuckets = useBucketStore((state) => state.loadBuckets);
  const setActiveBucket = useBucketStore((state) => state.setActiveBucket);
  const buckets = useBucketStore((state) => state.buckets);
  const activeBucket = useBucketStore((state) => state.activeBucket);
  const loading = useBucketStore((state) => state.loading);

  const [delayedLoading, setDelayedLoading] = useState(true);

  // 프로젝트 로드
  useEffect(() => {
    if (user && !projectsLoaded) {
      loadProjects(user.uid, projectId);
    }
  }, [user, projectId, loadProjects, projectsLoaded]);

  // 버킷 로드
  useEffect(() => {
    if (activeProject) {
      loadBuckets(activeProject.id);
    }
  }, [activeProject, loadBuckets]);

  // 쿼리에 bucketId가 있을 때 해당 버킷 setActiveBucket
  // 프로젝트는 한번만 로드하면 되는데 버킷은 프로젝트 바뀔 때 마다 바뀌기 때문에 걍 loadBuckets에서 처리 안 함
  useEffect(() => {
    if (activeProject && bucketId && buckets.length > 0) {
      const bucket = buckets.find((bucket) => bucket.id === bucketId);
      if (bucket) {
        setActiveBucket(bucket);
      }
    }
  }, [activeProject, bucketId, setActiveBucket, buckets]);

  // 최소 로딩 시간
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (loading) {
      setDelayedLoading(true);
      timeout = setTimeout(() => {
        if (!loading) {
          setDelayedLoading(false);
        }
      }, 300);
    } else {
      timeout = setTimeout(() => {
        setDelayedLoading(false);
      }, 300);
    }

    return () => clearTimeout(timeout);
  }, [loading]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-1 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  {activeProject?.title}
                </BreadcrumbItem>
                {activeBucket && (
                  <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{activeBucket?.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {delayedLoading ? (
          <div className="flex h-full w-full items-center justify-center">
            <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : activeBucket ? (
          // 활성 버킷 있을 때 컨텐츠 표시 (기존 코드)
          <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 lg:grid-cols-3">
              <WeeklyTaskChart />
              <TotalTaskChart />
              <div className="rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </main>
        ) : (
          // 로딩 완료 & 활성 버킷 없을 때 메시지 표시 (기존 코드)
          <main className="flex h-full flex-1 items-center justify-center">
            {" "}
            {/* flex-1 추가 */}
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold">버킷을 선택하세요</h1>
              <p className="text-sm text-muted-foreground">
                사이드바에서 버킷을 선택하여 작업을 시작하세요.
              </p>
            </div>
          </main>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
