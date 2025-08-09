
// Simulated User entity for the demo
// In a real implementation, this would connect to Supabase

export class User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
  status: 'approved' | 'pending' | 'blocked' | 'denied';

  constructor(data: any) {
    this.id = data.id;
    this.email = data.email;
    this.full_name = data.full_name;
    this.role = data.role || 'user';
    this.status = data.status || 'pending';
  }

  static async me(): Promise<User | null> {
    // Simulate getting current user
    // In real implementation, this would use Supabase auth
    return new User({
      id: '1',
      email: 'demo@example.com',
      full_name: 'Usuário Demo',
      role: 'user',
      status: 'approved'
    });
  }

  static async logout(): Promise<void> {
    // Simulate logout
    // In real implementation, this would use Supabase auth
    console.log('User logged out');
  }
}
