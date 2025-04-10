import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://api.clerk.com/v1/users?limit=50&offset=0&order_by=-created_at', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Clerk API error: ${response.status} ${response.statusText}`);
    }

    const users = await response.json();

    interface User {
      id: string;
      username?: string;
      image_url?: string;
      first_name: string;
      last_name: string;
      email_addresses?: { email_address: string }[];
      created_at: string;
      last_sign_in_at?: string;
      public_metadata?: Record<string, unknown>;
    }

    interface FormattedUser {
      id: string;
      username?: string;
      imageUrl?: string;
      firstName: string;
      lastName: string;
      emailAddresses?: string[];
      createdAt: string;
      lastSignInAt: string;
      publicMetadata?: Record<string, unknown>;
    }

    const formattedUsers: FormattedUser[] = Array.isArray(users)
      ? users.map((user: User) => ({
        id: user.id,
        username: user?.username,
        imageUrl: user?.image_url,
        firstName: user.first_name,
        lastName: user.last_name,
        emailAddresses: user.email_addresses?.map(email => email.email_address),
        createdAt: new Date(user.created_at).toLocaleDateString(),
        lastSignInAt: user.last_sign_in_at
        ? new Date(user.last_sign_in_at).toLocaleDateString()
        : 'Never',
        publicMetadata: user.public_metadata,
      }))
      : [];

    return NextResponse.json({
      success: true,
      data: formattedUsers,
      count: formattedUsers.length,
    });
  } catch (error) {
    console.error('Error fetching users from Clerk API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch users from Clerk',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
