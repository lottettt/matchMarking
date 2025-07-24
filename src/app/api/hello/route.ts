// Next.js API route support for App Router
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ name: 'John Doe' })
}
