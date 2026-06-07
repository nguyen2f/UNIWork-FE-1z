import { api } from "./http-client"
import type { IssueDTO, IssueRequest } from "@/types/issue.types"

export const issueService = {
  getByTask: (taskId: number) =>
    api<IssueDTO[]>({ method: "GET", url: `/issues/task/${taskId}` }),

  getByProject: (projectId: number, page: number = 0, size: number = 10) =>
    api<any>({ 
      method: "GET", 
      url: `/issues/project/${projectId}`,
      params: { page, size }
    }),

  getMyIssues: () =>
    api<IssueDTO[]>({ method: "GET", url: "/issues/my-issues" }),

  getDetail: (issueId: number) =>
    api<IssueDTO>({ method: "GET", url: `/issues/${issueId}` }),

  create: (data: IssueRequest) =>
    api<IssueDTO>({ method: "POST", url: "/issues", data }),

  update: (issueId: number, data: Partial<IssueRequest>) =>
    api<IssueDTO>({ method: "PUT", url: `/issues/${issueId}`, data }),

  delete: (issueId: number) =>
    api<void>({ method: "DELETE", url: `/issues/${issueId}` }),
}
