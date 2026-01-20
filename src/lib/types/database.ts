export type UserRole = "client" | "professional" | "admin";
export type ProjectStatus = "draft" | "quoted" | "in_progress" | "review" | "completed" | "cancelled";
export type ProjectType = "mobile" | "web" | "api" | "ai" | "blockchain" | "biometrics" | "analytics" | "ecommerce" | "enterprise" | "other";
export type ComplexityLevel = "basic" | "intermediate" | "advanced";
export type TimelineType = "express" | "standard" | "flexible";
export type CallStatus = "scheduled" | "completed" | "cancelled" | "rescheduled";
export type MessageType = "text" | "file" | "system";
export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  company: string | null;
  phone: string | null;
  role: UserRole;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  assigned_to: string | null;
  name: string;
  description: string | null;
  project_type: ProjectType;
  complexity: ComplexityLevel;
  timeline: TimelineType;
  estimated_price_min: number | null;
  estimated_price_max: number | null;
  final_price: number | null;
  status: ProjectStatus;
  progress: number;
  start_date: string | null;
  estimated_end_date: string | null;
  actual_end_date: string | null;
  features: string[];
  tech_stack: string[];
  created_at: string;
  updated_at: string;
}

export interface DiscoveryCall {
  id: string;
  client_id: string;
  professional_id: string | null;
  project_id: string | null;
  scheduled_at: string;
  duration_minutes: number;
  timezone: string;
  status: CallStatus;
  meeting_url: string | null;
  notes: string | null;
  recording_url: string | null;
  questionnaire_responses: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  project_id: string;
  sender_id: string;
  content: string;
  message_type: MessageType;
  file_url: string | null;
  file_name: string | null;
  file_size: number | null;
  is_read: boolean;
  created_at: string;
}

export interface Deliverable {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  is_completed: boolean;
  completed_at: string | null;
  files: { url: string; name: string; size: number }[];
  order_index: number;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  project_id: string;
  client_id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issued_at: string | null;
  due_date: string | null;
  paid_at: string | null;
  payment_method: string | null;
  payment_reference: string | null;
  items: { description: string; amount: number }[];
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Quotation {
  id: string;
  user_id: string | null;
  email: string | null;
  project_type: ProjectType;
  complexity: ComplexityLevel;
  timeline: TimelineType;
  estimated_min: number | null;
  estimated_max: number | null;
  converted_to_call: boolean;
  converted_to_project: boolean;
  created_at: string;
}

// Extended types with relations
export interface ProjectWithRelations extends Project {
  client?: Profile;
  assigned_professional?: Profile;
  deliverables?: Deliverable[];
  messages?: Message[];
}

export interface DiscoveryCallWithRelations extends DiscoveryCall {
  client?: Profile;
  professional?: Profile;
  project?: Project;
}
