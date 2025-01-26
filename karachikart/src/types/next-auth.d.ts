import 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string;
    id: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
} 