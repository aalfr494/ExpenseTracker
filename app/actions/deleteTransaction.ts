'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';

interface TransactionData {
  text: string;
  amount: number;
}

interface TransactionResult {
  data?: TransactionData;
  error?: string;
}

async function deleteTransaction(transactionId: string): Promise<{
  message?: string;
  error?: string;
}> {
  const { userId } = auth();

  // check for user

  if (!userId) {
    return { error: 'User not found' };
  }

  try {
    await db.transaction.delete({
      where: {
        id: transactionId,
        userId,
      },
    });

    // after deletion refresh/update this page essentially
    revalidatePath('/');

    return { message: 'Transaction deleted' };
  } catch (error) {
    return { error: 'Database error' };
  }
}

export default deleteTransaction;
