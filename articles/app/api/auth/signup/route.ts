import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://hasura.rudixops.dev/v1/graphql';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (username.length < 3 || username.length > 50) {
      return NextResponse.json(
        { error: 'Username must be between 3 and 50 characters' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if username already exists
    const checkQuery = `
      query CheckUsername($username: String!) {
        qa_users(where: {username: {_eq: $username}}) {
          id
        }
      }
    `;

    const checkResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: checkQuery,
        variables: { username },
      }),
    });

    const checkResult = await checkResponse.json();

    if (checkResult.data?.qa_users?.length > 0) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert user
    const insertQuery = `
      mutation InsertUser($username: String!, $password_hash: String!) {
        insert_qa_users(objects: {username: $username, password_hash: $password_hash}) {
          returning {
            id
            username
          }
        }
      }
    `;

    const insertResponse = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: insertQuery,
        variables: { username, password_hash: passwordHash },
      }),
    });

    const insertResult = await insertResponse.json();

    if (insertResult.errors) {
      console.error('GraphQL errors:', insertResult.errors);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    const user = insertResult.data?.insert_qa_users?.returning?.[0];

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    // Generate JWT token
    const token = generateToken(user.id, user.username);

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
