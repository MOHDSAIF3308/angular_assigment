export interface Record {
  _id: string;
  userId: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: Date;
  accessLevel: 'public' | 'restricted';
}
