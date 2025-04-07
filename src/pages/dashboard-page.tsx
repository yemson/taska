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
import { useEffect } from "react";
import { useParams } from "react-router";

export default function DashboardPage() {
  const { projectId } = useParams();

  const user = useAuthStore((state) => state.user);

  const projectsLoaded = useProjectStore((state) => state.projectsLoaded);
  const loadProjects = useProjectStore((state) => state.loadProjects);
  const activeProject = useProjectStore((state) => state.activeProject);

  const loadBuckets = useBucketStore((state) => state.loadBuckets);
  const activeBucket = useBucketStore((state) => state.activeBucket);
  const loading = useBucketStore((state) => state.loading);

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

        {loading ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold">버킷을 로딩 중입니다...</h1>
              <p className="text-sm text-muted-foreground">
                버킷을 로딩 중입니다. 잠시만 기다려 주세요.
              </p>
            </div>
          </div>
        ) : activeBucket ? (
          // 활성 버킷 있을 때 컨텐츠 표시 (기존 코드)
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="grid auto-rows-min gap-4 md:grid-cols-3">
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
              <div className="aspect-video rounded-xl bg-muted/50" />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
        ) : (
          // 로딩 완료 & 활성 버킷 없을 때 메시지 표시 (기존 코드)
          <div className="flex h-full flex-1 items-center justify-center">
            {" "}
            {/* flex-1 추가 */}
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold">버킷을 선택하세요</h1>
              <p className="text-sm text-muted-foreground">
                사이드바에서 버킷을 선택하여 작업을 시작하세요.
              </p>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
