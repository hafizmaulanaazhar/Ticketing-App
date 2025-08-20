<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LoanController;
use App\Http\Controllers\Api\SavingController;
use App\Http\Controllers\Api\SettlementController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Savings routes
    Route::get('/savings', [SavingController::class, 'index']);
    Route::post('/savings', [SavingController::class, 'store']);
    Route::get('/savings/{saving}', [SavingController::class, 'show']);
    Route::put('/savings/{saving}', [SavingController::class, 'update']);
    Route::delete('/savings/{saving}', [SavingController::class, 'destroy']);
    Route::get('/yearly-profit', [SavingController::class, 'yearlyProfit']);

    // Loans routes
    Route::get('/loans', [LoanController::class, 'index']);
    Route::post('/loans', [LoanController::class, 'store']);
    Route::post('/loans/{loan}/approve', [LoanController::class, 'approve']);
    Route::post('/loans/{loan}/reject', [LoanController::class, 'reject']);

    // Settlements routes
    Route::get('/settlements', [SettlementController::class, 'index']);
    Route::post('/settlements', [SettlementController::class, 'store']);
    Route::post('/settlements/{settlement}/approve', [SettlementController::class, 'approve']);
    Route::post('/settlements/{settlement}/reject', [SettlementController::class, 'reject']);
});
