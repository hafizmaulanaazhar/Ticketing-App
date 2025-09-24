<?php

namespace App\Http\Controllers\Api;

use App\Models\Loan;
use App\Models\Settlement;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class LoanController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $loans = Loan::with(['user', 'settlement'])->get();
        } else {
            $loans = Loan::with('settlement')->where('user_id', $user->id)->get();
        }

        return response()->json($loans);
    }

    public function store(Request $request)
    {
        $request->validate([
            'application_date' => 'required|date',
            'amount' => 'required|numeric|min:0',
            'phone' => 'required|string',
            'address' => 'required|string',
            'status' => 'required|in:applied,approve,reject',
        ]);

        $loan = Loan::create([
            'user_id' => $request->user()->id,
            'application_date' => $request->application_date,
            'amount' => $request->amount,
            'phone' => $request->phone,
            'address' => $request->address,
            'status' => 'applied',
        ]);

        return response()->json($loan, 201);
    }

    public function approve(Request $request, Loan $loan)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $loan->update(['status' => 'approved']);

        return response()->json($loan);
    }

    public function reject(Request $request, Loan $loan)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $loan->update(['status' => 'rejected']);

        return response()->json($loan);
    }
}
