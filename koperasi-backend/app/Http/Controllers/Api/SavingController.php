<?php

namespace App\Http\Controllers\Api;

use App\Models\Saving;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class SavingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $savings = Saving::with('user')->get();
        } else {
            $savings = Saving::where('user_id', $user->id)->get();
        }

        return response()->json($savings);
    }

    public function store(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:wajib,pokok',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
        ]);

        $saving = Saving::create($request->all());
        return response()->json($saving, 201);
    }

    public function show(Request $request, Saving $saving)
    {
        if (!$request->user()->isAdmin() && $request->user()->id !== $saving->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($saving->load('user'));
    }

    public function update(Request $request, Saving $saving)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:wajib,pokok',
            'amount' => 'required|numeric|min:0',
            'date' => 'required|date',
        ]);

        $saving->update($request->all());

        return response()->json($saving);
    }


    public function destroy(Request $request, Saving $saving)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $saving->delete();

        return response()->json(['message' => 'Saving deleted successfully']);
    }


    public function yearlyProfit(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            $totalWajib = Saving::where('type', 'wajib')->sum('amount');
        } else {
            $totalWajib = Saving::where('user_id', $user->id)
                ->where('type', 'wajib')
                ->sum('amount');
        }
        $yearlyProfit = ((($totalWajib * 0.93) * 0.1) / 12) * 0.6;

        return response()->json([
            'total_wajib' => $totalWajib,
            'yearly_profit' => $yearlyProfit
        ]);
    }
}
