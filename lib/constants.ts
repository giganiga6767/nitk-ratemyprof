export type Department =
  | "CSE"
  | "ECE"
  | "Mech"
  | "Civil"
  | "Electrical"
  | "IT"
  | "Chemical"
  | "Metallurgical";

export const DEPARTMENTS: Department[] = [
  "CSE",
  "ECE",
  "Mech",
  "Civil",
  "Electrical",
  "IT",
  "Chemical",
  "Metallurgical",
];

export interface Professor {
  id: string;
  name: string;
  department: Department;
}

export interface Review {
  id: string;
  professor_id: string;
  quality_rating: number;
  difficulty_rating: number;
  course_code: string;
  comment: string;
  is_approved: boolean;
}
