'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { db } from "@/lib/db";

interface TransactionData {
  text: string;
  amount: number;
}

interface TransactionResult {
  data?: TransactionData;
  error?: string;
}

async function addTransaction(formData: FormData): Promise<TransactionResult> {
  const textValue = formData.get('text');
  const amountValue = formData.get('amount');

  // check for input values

  if (!textValue || textValue === '' || !amountValue) {
    return { error: 'Text or amount is missing' };
  }

  const text: string = textValue.toString(); // ensure text is string
  const amount: number = parseFloat(amountValue.toString()); // parse amt as number

  // Get logged in user
  const { userId } = auth();
  console.log(userId);

  // check for user

  if (!userId) {
    return { error: 'User not found' };
  }

  try {
    const transactionData: TransactionData = await db.transaction.create({
      data: {
        text,
        amount,
        userId,
      },
    });

    revalidatePath('/');

    return { data: transactionData };
  } catch (error) {
    return { error: 'Transaction not added' };
  }
}

export default addTransaction;
