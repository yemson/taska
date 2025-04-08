import { useState } from "react";
import { CheckCircle, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  title: string;
  completedAt: Date;
  category: string;
}

export default function CompletedTaskCard() {
  const [tasks] = useState<Task[]>([
    {
      id: "1",
      title: "웹사이트 디자인 완성하기",
      completedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      category: "디자인",
    },
    {
      id: "2",
      title: "주간 보고서 제출",
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      category: "업무",
    },
    {
      id: "3",
      title: "팀 미팅 준비",
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      category: "회의",
    },
    {
      id: "4",
      title: "팀 미팅 준비",
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      category: "회의",
    },
    {
      id: "5",
      title: "팀 미팅 준비",
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
      category: "회의",
    },
  ]);

  // Function to format relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}초 전`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  };

  return (
    <Card>
      <CardHeader className="items-center pb-0">
        <CardTitle>최근 완료한 작업</CardTitle>
        <CardDescription>오늘 완료된 태스크</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
            <div className="grid gap-1">
              <div className="font-medium">{task.title}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{getRelativeTime(task.completedAt)}</span>
                <Badge variant="outline" className="px-2 py-0 h-5 text-xs">
                  {task.category}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
