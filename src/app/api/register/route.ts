// API Route: POST /api/register
// Registers a new BIT Sindri coder and triggers concurrent platform score normalization.

import { NextRequest, NextResponse } from 'next/server';
import { registerNewStudent } from '@/lib/server/cache-store';
import { RegisterFormData } from '@/types/campus-cp';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      registrationNo,
      branch,
      year,
      gender,
      cfHandle,
      lcHandle,
      ccHandle,
      gfgHandle,
      hrHandle,
    } = body;

    // Strict validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Valid student name is required.' },
        { status: 400 }
      );
    }

    if (!registrationNo || typeof registrationNo !== 'string' || registrationNo.trim().length < 4) {
      return NextResponse.json(
        { success: false, error: 'Valid BIT Sindri Registration Number is required (e.g. 2301045).' },
        { status: 400 }
      );
    }

    if (!branch || typeof branch !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Engineering branch selection is required.' },
        { status: 400 }
      );
    }

    const yearNum = Number(year);
    if (isNaN(yearNum) || yearNum < 1 || yearNum > 4) {
      return NextResponse.json(
        { success: false, error: 'Academic Year must be between 1 and 4.' },
        { status: 400 }
      );
    }

    if (!gender || !['MALE', 'FEMALE', 'OTHER'].includes(gender)) {
      return NextResponse.json(
        { success: false, error: 'Gender must be MALE, FEMALE, or OTHER.' },
        { status: 400 }
      );
    }

    const formData: RegisterFormData = {
      name: name.trim(),
      registrationNo: registrationNo.trim(),
      branch: branch.trim(),
      year: yearNum,
      gender,
      cfHandle: (cfHandle || '').trim() || name.toLowerCase().replace(/\s+/g, '_'),
      lcHandle: (lcHandle || '').trim() || name.toLowerCase().replace(/\s+/g, '_'),
      ccHandle: (ccHandle || '').trim() || name.toLowerCase().replace(/\s+/g, '_'),
      gfgHandle: (gfgHandle || '').trim() || name.toLowerCase().replace(/\s+/g, '_'),
      hrHandle: (hrHandle || '').trim() || name.toLowerCase().replace(/\s+/g, '_'),
    };

    const student = await registerNewStudent(formData);

    return NextResponse.json(
      {
        success: true,
        data: student,
        message: `Coder ${student.name} (${student.registrationNo}) registered successfully with Composite Rating ${student.compositeRating}!`,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Registration failed due to internal error.';
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 400 }
    );
  }
}
