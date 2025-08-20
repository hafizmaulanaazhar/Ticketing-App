<?php

namespace App\Http\Controllers\Api;

use App\Models\Settlement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;

class SettlementController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $settlements = Settlement::with('loan.user')->get();

        return response()->json($settlements);
    }

    public function store(Request $request)
    {
        $request->validate([
            'loan_id' => 'required|exists:loans,id',
            'settlement_date' => 'required|date',
            'proof' => 'required|file|mimes:jpeg,png,jpg,pdf|max:2048',
        ]);

        $loan = \App\Models\Loan::find($request->loan_id);
        if ($request->user()->id !== $loan->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $proofPath = $request->file('proof')->store('proofs', 'public');

        $settlement = Settlement::create([
            'loan_id' => $request->loan_id,
            'settlement_date' => $request->settlement_date,
            'proof' => $proofPath,
            'status' => 'applied',
        ]);

        return response()->json($settlement, 201);
    }

    public function approve(Request $request, Settlement $settlement)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $settlement->update(['status' => 'approved']);

        return response()->json($settlement);
    }

    public function reject(Request $request, Settlement $settlement)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $settlement->update(['status' => 'rejected']);

        return response()->json($settlement);
    }
}
