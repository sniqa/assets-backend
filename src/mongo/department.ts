import { WithId } from '@mongo/common.ts'


export interface DepartmentInfo {
  department_name: string;
  locations: string[];
}

export type DepartmentSchema = WithId & DepartmentInfo

export const departmentMap = {
  department_name: "部门名称",
  locations: "办公室位置",
};
